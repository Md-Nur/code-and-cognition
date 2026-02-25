import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
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

        // 1. Initial Email Check + Potential Password Submission
        const email = body.email?.toLowerCase().trim();
        const password = body.password;

        if (!email) {
            return ApiResponse.error("Email is required", 400);
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        const isClient = user?.role === "CLIENT";

        // --- PASSWORDLESS MAGIC LINK FLOW (CLIENTS) ---
        if (isClient || (!user && !password)) {
            // If they are a client, OR if they just submitted an email and we pretend they might be a client (timing mitigation)
            if (user && isClient) {
                // Generate Secure Token
                const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
                    .map((b) => b.toString(16).padStart(2, "0"))
                    .join("");

                const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

                await prisma.magicLink.create({
                    data: { email: user.email, token, expiresAt }
                });

                // Send Email
                const magicLinkUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify?token=${token}`;

                // Dynamic import to prevent circular dependency issues if mailer relies on auth
                const { sendMail } = await import("@/lib/mailer");
                await sendMail(
                    user.email,
                    "Your Login Link - Code & Cognition",
                    `<div style="font-family: sans-serif; padding: 20px;">
                        <h2>Login to Your Dashboard</h2>
                        <p>Click the secure link below to access your project. This link expires in 15 minutes.</p>
                        <a href="${magicLinkUrl}" style="display: inline-block; padding: 10px 20px; background-color: #E6FF00; color: #000; text-decoration: none; font-weight: bold; border-radius: 5px;">Login Now</a>
                        <p style="color: #666; font-size: 12px; mt-4">If you did not request this link, please ignore this email.</p>
                      </div>`
                );
            }

            // We always return this success message genericly if they don't provide a password and aren't forcing an internal login block
            if (!password || isClient) {
                return NextResponse.json({ magicLinkSent: true, message: "Check your email for the login link." });
            }
        }

        // --- PASSWORD FLOW (INTERNAL ROLES) ---
        // If we reach here, they must provide a password because they are internal
        if (!password) {
            return NextResponse.json({ requirePassword: true, message: "Internal staff require a password." });
        }

        // Always compare even if user doesn't exist to prevent timing attacks
        const dummyHash = "$2b$10$invalidhashfortimingnormalization00000000000000000";
        const isValid = user
            ? await bcrypt.compare(password, user.passwordHash)
            : await bcrypt.compare(password, dummyHash).then(() => false);

        if (!user || !isValid || user.role === "CLIENT") {
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
