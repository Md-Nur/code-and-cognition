import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/api-handler";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    token: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = registerSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error(JSON.stringify(validation.error.format()), 400);
        }

        const { name, email, password, token } = validation.data;

        // Check if any user exists
        const userCount = await prisma.user.count();
        let role: Role = Role.FOUNDER;

        if (userCount > 0) {
            // If users exist, token is required to register
            if (!token) {
                return ApiResponse.error("Registration requires an invitation token.", 403);
            }

            const invitation = await prisma.invitation.findUnique({
                where: { token },
            });

            if (!invitation || invitation.used || invitation.expiresAt < new Date()) {
                return ApiResponse.error("Invalid or expired invitation token.", 403);
            }

            if (invitation.email.toLowerCase() !== email.toLowerCase()) {
                return ApiResponse.error("Email does not match invitation.", 403);
            }

            role = invitation.role;

            // Mark invitation as used
            await prisma.invitation.update({
                where: { id: invitation.id },
                data: { used: true },
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            return ApiResponse.error("Email already registered.", 400);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                passwordHash,
                role,
                isCFO: userCount === 0,
            },
        });

        return ApiResponse.success({
            message: "Registration successful",
            user: { id: user.id, name: user.name, email: user.email, role: user.role, isCFO: user.isCFO },
        }, 201);

    } catch (error) {
        console.error("Registration Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}
