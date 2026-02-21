import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role, MilestoneStatus } from "@prisma/client";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.FOUNDER) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { title, description, order } = await req.json();

    if (!title) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    try {
        const milestone = await prisma.milestone.create({
            data: {
                projectId: id,
                title,
                description,
                order: order || 0,
            }
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                projectId: id,
                userId: session.user.id,
                action: `added milestone: ${title}`
            }
        });

        return NextResponse.json(milestone);
    } catch (error) {
        console.error("Failed to create milestone", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.FOUNDER) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await params;
    const { id, title, description, order, status } = await req.json();

    if (!id) {
        return NextResponse.json({ error: "Milestone ID is required" }, { status: 400 });
    }

    try {
        const oldMilestone = await prisma.milestone.findUnique({
            where: { id }
        });

        const milestone = await prisma.milestone.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(order !== undefined && { order }),
                ...(status && {
                    status,
                    completedAt: status === MilestoneStatus.COMPLETED ? new Date() : null
                }),
            }
        });

        // Log status change activity
        if (status && status !== oldMilestone?.status) {
            await prisma.activityLog.create({
                data: {
                    projectId,
                    userId: session.user.id,
                    action: `marked milestone "${milestone.title}" as ${status.replace("_", " ").toLowerCase()}`
                }
            });
        }

        return NextResponse.json(milestone);
    } catch (error) {
        console.error("Failed to update milestone", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.FOUNDER) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await params;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Milestone ID is required" }, { status: 400 });
    }

    try {
        const milestone = await prisma.milestone.delete({
            where: { id }
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                projectId,
                userId: session.user.id,
                action: `removed milestone: ${milestone.title}`
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete milestone", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
