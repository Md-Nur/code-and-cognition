import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { ApiResponse } from "@/lib/api-handler";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { token } = body;

        if (!token) {
            return ApiResponse.error("Verification token is required", 400);
        }

        // 1. Find the Magic Link
        const magicLink = await prisma.magicLink.findUnique({
            where: { token }
        });

        if (!magicLink) {
            return ApiResponse.error("Invalid or expired login link.", 401);
        }

        // 2. Check Expiration
        if (new Date() > magicLink.expiresAt) {
            await prisma.magicLink.delete({ where: { id: magicLink.id } });
            return ApiResponse.error("This login link has expired. Please request a new one.", 401);
        }

        // 3. Find User
        const user = await prisma.user.findUnique({
            where: { email: magicLink.email }
        });

        if (!user || user.role !== "CLIENT") {
            // Failsafe: only clients should be using magic links
            await prisma.magicLink.delete({ where: { id: magicLink.id } });
            return ApiResponse.error("Invalid access.", 403);
        }

        // 4. Create JWT Session
        const jwtToken = await signToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set("auth_token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days for clients
            path: "/",
        });

        // 5. Cleanup the one-time token
        await prisma.magicLink.delete({ where: { id: magicLink.id } });

        return ApiResponse.success({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Magic Link Verify Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}
