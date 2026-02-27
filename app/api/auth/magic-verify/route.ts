import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/lib/api-handler";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { token } = body;

        if (!token) {
            return ApiResponse.error("Token is required", 400);
        }

        // 1. Find token
        const magicToken = await prisma.magicToken.findUnique({
            where: { token },
        });

        if (!magicToken) {
            return ApiResponse.error("Invalid token", 401);
        }

        if (magicToken.used) {
            return ApiResponse.error("Token has already been used", 401);
        }

        if (new Date() > magicToken.expiresAt) {
            return ApiResponse.error("Token has expired", 401);
        }

        // 2. Find associated user
        const user = await prisma.user.findUnique({
            where: { email: magicToken.email },
        });

        if (!user || user.role !== "CLIENT") {
            return ApiResponse.error("User not found or unauthorized", 401);
        }

        // 3. Mark token as used
        await prisma.magicToken.update({
            where: { id: magicToken.id },
            data: { used: true },
        });

        // 4. Create JWT session
        const sessionToken = await signToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        // 5. Set cookie
        const cookieStore = await cookies();
        cookieStore.set("auth_token", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        });

        return ApiResponse.success({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Magic Login Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}
