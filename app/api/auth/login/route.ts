import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { ApiResponse } from "@/lib/api-handler";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { z } from "zod";
import bcrypt from "bcryptjs";

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required").max(128, "Password too long"),
});

export async function POST(req: Request) {
    // Rate limit: 5 attempts per 15 minutes per IP
    const ip = getIp(req);
    const { success, remaining, reset } = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);

    if (!success) {
        const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000);
        return new Response(
            JSON.stringify({ error: "Too many login attempts. Please try again later." }),
            {
                status: 429,
                headers: {
                    "Content-Type": "application/json",
                    "Retry-After": String(retryAfterSeconds),
                    "X-RateLimit-Remaining": "0",
                },
            }
        );
    }

    try {
        const body = await req.json();
        const validation = loginSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error("Invalid email or password", 400);
        }

        const { email, password } = validation.data;

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });

        // Always compare even if user doesn't exist to prevent timing attacks
        const dummyHash = "$2b$10$invalidhashfortimingnormalization00000000000000000";
        const isValid = user
            ? await bcrypt.compare(password, user.passwordHash)
            : await bcrypt.compare(password, dummyHash).then(() => false);

        if (!user || !isValid) {
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
