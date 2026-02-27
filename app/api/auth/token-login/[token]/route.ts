import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || undefined;

    try {
        // 1. Find project by viewToken
        const project = await prisma.project.findUnique({
            where: { viewToken: token },
            include: { booking: true }
        });

        if (!project || !project.booking) {
            return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
        }

        // 2. Find associated client user
        const user = await prisma.user.findUnique({
            where: { email: project.booking.clientEmail }
        });

        if (!user || user.role !== Role.CLIENT) {
            return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
        }

        // 3. Capture Security Log
        const { getFingerprint, isSuspiciousActivity } = await import("@/lib/security");
        const fingerprint = getFingerprint(userAgent, ip);
        const isSuspicious = await isSuspiciousActivity(ip);

        await prisma.securityLog.create({
            data: {
                email: user.email,
                action: "TOKEN_LOGIN",
                status: "SUCCESS",
                ip,
                userAgent,
                fingerprint,
                isSuspicious
            }
        });

        // 4. Create 7-day Session
        const sessionToken = await signToken({
            id: user.id,
            email: user.email,
            role: user.role
        }, "7d");

        const cookieStore = await cookies();
        cookieStore.set("auth_token", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        // 5. Redirect to Project Dashboard
        return NextResponse.redirect(new URL(`/dashboard/projects/${project.id}`, req.url));

    } catch (error) {
        console.error("Token Login Error:", error);
        return NextResponse.redirect(new URL("/login?error=server_error", req.url));
    }
}
