"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { sendMail } from "@/lib/mailer";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function createInvitation(email: string, role: Role) {
    const session = await auth();
    if (!session || (session.user.role !== Role.FOUNDER && session.user.role !== Role.CO_FOUNDER)) {
        throw new Error("Unauthorized");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await prisma.invitation.create({
        data: {
            email: email.toLowerCase(),
            role,
            token,
            expiresAt,
        },
    });

    const registrationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/register?token=${token}&email=${encodeURIComponent(email)}`;

    // Send Invitation Email (Non-blocking)
    (async () => {
        try {
            await sendMail(
                email,
                "Invitation to Join Code & Cognition",
                `<div style="font-family: sans-serif; padding: 20px;">
          <h2>You've Been Invited!</h2>
          <p>You have been invited to join the Code & Cognition team as a <strong>${role}</strong>.</p>
          <p>Click the link below to create your account:</p>
          <a href="${registrationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #E6FF00; color: #000; text-decoration: none; font-weight: bold; border-radius: 5px;">Join Now</a>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">This invitation expires in 7 days.</p>
        </div>`
            );
        } catch (err) {
            console.error(`[INVITATION] Failed to send email to ${email}`, err);
        }
    })();

    revalidatePath("/dashboard/admin/users");
    return invitation;
}

export async function getInvitations() {
    const session = await auth();
    if (!session || (session.user.role !== Role.FOUNDER && session.user.role !== Role.CO_FOUNDER)) {
        throw new Error("Unauthorized");
    }

    return prisma.invitation.findMany({
        where: { used: false },
        orderBy: { createdAt: "desc" },
    });
}

export async function deleteInvitation(id: string) {
    const session = await auth();
    if (!session || (session.user.role !== Role.FOUNDER && session.user.role !== Role.CO_FOUNDER)) {
        throw new Error("Unauthorized");
    }

    await prisma.invitation.delete({
        where: { id },
    });

    revalidatePath("/dashboard/admin/users");
}
