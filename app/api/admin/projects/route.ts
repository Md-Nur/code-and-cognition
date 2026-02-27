import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { projectSchema } from "@/lib/validations/admin";

export const GET = withAuth(async (req: any, context: any, session: any) => {
    const { user } = session;
    let where: any = {};

    if (user.role === Role.CONTRACTOR) {
        where = {
            OR: [
                { finderId: user.id },
                { members: { some: { userId: user.id } } }
            ]
        };
    } else if (user.role === Role.CLIENT) {
        where = {
            booking: {
                clientEmail: {
                    equals: user.email,
                    mode: 'insensitive'
                }
            }
        };
    }

    const projects = await prisma.project.findMany({
        where,
        include: {
            finder: true,
            booking: true,
            _count: { select: { members: true, payments: true } },
        },
        orderBy: { createdAt: "desc" },
    });
    return ApiResponse.success(projects);
}, [Role.FOUNDER, Role.CONTRACTOR, Role.CLIENT]);

export const POST = withAuth(async (req) => {
    try {
        const body = await req.json();
        const validation = projectSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error(JSON.stringify(validation.error.format()));
        }

        const project = await prisma.project.create({
            data: validation.data as any,
        });

        // --- Auto-Onboarding Workflow ---
        if (project.bookingId) {
            const booking = await prisma.booking.findUnique({
                where: { id: project.bookingId }
            });

            if (booking) {
                const existingUser = await prisma.user.findUnique({
                    where: { email: booking.clientEmail }
                });

                if (!existingUser) {
                    const { sendMail } = await import("@/lib/mailer");
                    const crypto = await import("crypto");

                    // 1. Create CLIENT User record
                    await prisma.user.create({
                        data: {
                            id: `cl_ ${Math.random().toString(36).substring(2, 10)}`, // Optional: specific prefix
                            email: booking.clientEmail.toLowerCase(),
                            name: booking.clientName,
                            role: Role.CLIENT,
                            passwordHash: "CLIENT_ACCOUNT_PASSWORDLESS_" + Math.random().toString(36), // Unmatchable hash
                        }
                    });

                    // 2. Generate Onboarding Magic Token (24 hour expiry for onboarding)
                    const token = crypto.randomBytes(32).toString("hex");
                    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

                    await prisma.magicToken.create({
                        data: { email: booking.clientEmail, token, expiresAt }
                    });

                    // 3. Send Onboarding Email
                    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://condencognition.com";
                    const magicLinkUrl = `${appUrl}/magic-login?token=${token}`;
                    const projectOverviewUrl = `${appUrl}/dashboard/projects/${project.id}`;

                    await sendMail(
                        booking.clientEmail,
                        "Welcome to Your Project Workspace - Code & Cognition",
                        `<div style="font-family: sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #000;">Welcome, ${booking.clientName}!</h2>
                            <p>We've set up your project workspace for <strong>${project.title}</strong>.</p>
                            <p>You can track milestones, view deliverables, and message the team directly through our portal.</p>
                            
                            <div style="margin: 30px 0;">
                                <a href="${magicLinkUrl}" style="display: inline-block; padding: 12px 24px; background-color: #E6FF00; color: #000; text-decoration: none; font-weight: bold; border-radius: 5px; margin-right: 10px;">Login to Portal</a>
                                <a href="${projectOverviewUrl}" style="display: inline-block; padding: 12px 24px; background-color: #f4f4f4; color: #333; text-decoration: none; font-weight: bold; border-radius: 5px;">View Project Overview</a>
                            </div>

                            <p style="font-size: 14px; color: #666;">This login link is secure and will expire in 24 hours. Once logged in, your session will stay active for 7 days.</p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="font-size: 12px; color: #999;">If you have any questions, simply reply to this email.</p>
                        </div>`
                    );

                    // Log the event
                    await prisma.activityLog.create({
                        data: {
                            projectId: project.id,
                            action: `Auto-onboarded client: ${booking.clientEmail}`,
                        }
                    });
                }
            }
        }

        return ApiResponse.success(project, 201);
    } catch (error) {
        console.error("Project Create Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);
