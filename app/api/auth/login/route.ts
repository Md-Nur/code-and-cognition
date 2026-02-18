import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { ApiResponse } from "@/lib/api-handler";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return ApiResponse.error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return ApiResponse.error("Invalid credentials", 401);
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            return ApiResponse.error("Invalid credentials", 401);
        }

        // Create JWT
        const token = await signToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set("auth_token", token, {
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
        console.error("Login Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}
