import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/lib/api-handler";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const goto = searchParams.get("goto") || "/dashboard";

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || undefined;

    try {
        if (!token) {
            return NextResponse.redirect(new URL("/login?error=token_required", req.url));
        }

        // 1. Find token
        const magicToken = await prisma.magicToken.findUnique({
            where: { token },
        });

        if (!magicToken || magicToken.used || new Date() > magicToken.expiresAt) {
            return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
        }

        // 2. Find associated user
        const user = await prisma.user.findUnique({
            where: { email: magicToken.email },
        });

        if (!user || user.role !== "CLIENT") {
            return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
        }

        // 3. Mark token as used
        await prisma.magicToken.update({
            where: { id: magicToken.id },
            data: { used: true },
        });

        // 4. Capture Security Log
        const { getFingerprint, isSuspiciousActivity } = await import("@/lib/security");
        const fingerprint = getFingerprint(userAgent, ip);
        const isSuspicious = await isSuspiciousActivity(ip);

        await prisma.securityLog.create({
            data: { email: user.email, action: "MAGIC_LINK_VERIFY", status: "SUCCESS", ip, userAgent, fingerprint, isSuspicious }
        });

        // 5. Create JWT session
        const sessionToken = await signToken({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        }, "7d");

        // 6. Set cookie
        const cookieStore = await cookies();
        cookieStore.set("auth_token", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        // 7. Redirect to destination
        return NextResponse.redirect(new URL(goto, req.url));

    } catch (error) {
        console.error("Magic Login Redirect Error:", error);
        return NextResponse.redirect(new URL("/login?error=server_error", req.url));
    }
}
