import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            finder: true,
            booking: true,
            members: {
                include: { user: true },
            },
            payments: {
                orderBy: { paidAt: "desc" },
                include: { splits: true },
            },
        },
    });

    if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Access Control: Founder OR Member of the project
    const isMember = project.members.some(m => m.userId === session.user.id);
    if (session.user.role !== Role.FOUNDER && !isMember) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(project);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.FOUNDER) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
        return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    try {
        const project = await prisma.project.update({
            where: { id },
            data: { status },
            include: {
                booking: true,
            }
        });

        // Automation: If COMPLETED, move to Portfolio
        if (status === "COMPLETED") {
            // Check if already exists in portfolio to avoid duplicates (optional but good)
            const existing = await prisma.portfolioItem.findFirst({
                where: { title: project.title }
            });

            if (!existing) {
                await prisma.portfolioItem.create({
                    data: {
                        title: project.title,
                        description: project.booking?.message || "Successfully completed project.",
                        serviceId: project.booking?.serviceId || "unassigned", // Need to handle if booking doesn't exist
                        technologies: [],
                        isFeatured: false,
                        // projectUrl and imageUrl would be added manually later in portfolio management
                    }
                });
            }
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error("Failed to update project", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
