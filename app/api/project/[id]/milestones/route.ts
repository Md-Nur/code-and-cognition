import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withProjectAuth } from "@/lib/api-handler";
import { Role } from "@prisma/client";

export const POST = withProjectAuth(async (req, { params, project }, session) => {
    try {
        const { title, description } = await req.json();

        // Clients logically shouldn't be creating milestones directly in most agencies
        if (session.user.role === Role.CLIENT) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (!title?.trim()) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const milestoneCount = await prisma.milestone.count({
            where: { projectId: project.id }
        });

        const milestone = await prisma.milestone.create({
            data: {
                projectId: project.id,
                title: title.trim(),
                description: description?.trim() || null,
                order: milestoneCount,
            }
        });

        return NextResponse.json(milestone);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
});

export const PUT = withProjectAuth(async (req, { params, project }, session) => {
    try {
        const { id, title, description, status } = await req.json();

        if (session.user.role === Role.CLIENT) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (!id) return NextResponse.json({ error: "Milestone ID required" }, { status: 400 });

        const data: any = {};
        if (title !== undefined) data.title = title.trim();
        if (description !== undefined) data.description = description.trim();
        if (status !== undefined) {
            data.status = status;
            if (status === "COMPLETED") data.completedAt = new Date();
            else data.completedAt = null;
        }

        const milestone = await prisma.milestone.update({
            where: { id, projectId: project.id },
            data
        });

        return NextResponse.json(milestone);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
});
