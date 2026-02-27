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
        const userAgent = req.headers.get("user-agent") || undefined;
        const fingerprint = (await import("@/lib/security")).getFingerprint(userAgent, ip);
        const isSuspicious = await (await import("@/lib/security")).isSuspiciousActivity(ip);

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

        // --- AUTH FLOW BRANCHING ---

        // Scenario A: User is internal staff and providing password
        if (user && !isClient && password) {
            // Staff password login
            const isValid = await bcrypt.compare(password, user.passwordHash);

            if (!isValid) {
                await prisma.securityLog.create({
                    data: { email, action: "PASSWORD_LOGIN", status: "FAILURE", ip, userAgent, fingerprint, isSuspicious }
                });
                return ApiResponse.error("Invalid credentials", 401);
            }

            await prisma.securityLog.create({
                data: { email, action: "PASSWORD_LOGIN", status: "SUCCESS", ip, userAgent, fingerprint, isSuspicious }
            });

            // Create JWT
            const token = await signToken({ id: user.id, email: user.email, role: user.role });
            const cookieStore = await cookies();
            cookieStore.set("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24,
                path: "/",
            });

            return ApiResponse.success({
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
            });
        }

        // Scenario B: Magic Link Request (No password provided OR user is a client)
        if (!password || isClient) {
            // Check Cooldown
            const cooldown = await (await import("@/lib/security")).getMagicLinkCooldown(email);
            if (cooldown > 0) {
                return ApiResponse.error(`Please wait ${cooldown} seconds before requesting another link.`, 429);
            }

            // We ALWAYS return a success message to prevent email enumeration
            // unless it's a cooldown error above.

            // Perform background actions if applicable
            if (user) {
                const { sendMail } = await import("@/lib/mailer");

                if (isClient) {
                    // Generate Secure Token
                    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
                        .map((b) => b.toString(16).padStart(2, "0"))
                        .join("");

                    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

                    await prisma.magicToken.create({
                        data: { email: user.email, token, expiresAt, used: false }
                    });

                    await prisma.securityLog.create({
                        data: { email, action: "MAGIC_LINK_REQUEST", status: "SUCCESS", ip, userAgent, fingerprint, isSuspicious }
                    });

                    // Send Magic Link
                    const magicLinkUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://condencognition.com"}/magic-login?token=${token}`;
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
                } else {
                    // Staff requesting magic link - tell them to use password
                    await prisma.securityLog.create({
                        data: { email, action: "MAGIC_LINK_REQUEST", status: "REJECTED_STAFF", ip, userAgent, fingerprint, isSuspicious }
                    });

                    await sendMail(
                        user.email,
                        "Security Notice - Code & Cognition",
                        `<div style="font-family: sans-serif; padding: 20px;">
                            <h2>Secure Sign In Required</h2>
                            <p>Hi ${user.name}, you just tried to request a magic link login. As a staff member, you must sign in using your password for enhanced security.</p>
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://condencognition.com"}/login" style="display: inline-block; padding: 10px 20px; background-color: #333; color: #fff; text-decoration: none; font-weight: bold; border-radius: 5px;">Go to Login</a>
                          </div>`
                    );
                }
            } else {
                // Non-existent email - log it
                await prisma.securityLog.create({
                    data: { email, action: "MAGIC_LINK_REQUEST", status: "NOT_FOUND", ip, userAgent, fingerprint, isSuspicious }
                });
            }

            // Return generic success
            return NextResponse.json({
                magicLinkSent: true,
                message: "If an account exists for this email, you will receive a login link shortly."
            });
        }

        // Scenario C: Internal Role attempt with password but user not found or wrong password (handled above too)
        // If we reach here with a password but no valid user found
        const dummyHash = "$2b$10$invalidhashfortimingnormalization00000000000000000";
        await bcrypt.compare(password, dummyHash); // Timing normalization

        await prisma.securityLog.create({
            data: { email, action: "PASSWORD_LOGIN", status: "FAIL_NOT_FOUND", ip, userAgent, fingerprint, isSuspicious }
        });

        return ApiResponse.error("Invalid credentials", 401);

    } catch (error) {
        console.error("Login Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}
