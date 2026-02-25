import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withProjectAuth } from "@/lib/api-handler";
import { auth } from "@/lib/auth";

export const GET = withProjectAuth(async (req, { params, project }) => {
    try {
        const messages = await prisma.message.findMany({
            where: { projectId: project.id },
            orderBy: { createdAt: "asc" },
            include: {
                sender: { select: { id: true, name: true, role: true } },
            },
        });
        return NextResponse.json(messages);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}, { allowClient: true, includeFinder: true });

export const POST = withProjectAuth(async (req, { params, project }) => {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { content } = await req.json();

        if (!content || !content.trim()) {
            return NextResponse.json({ error: "Message content cannot be empty" }, { status: 400 });
        }

        const message = await prisma.message.create({
            data: {
                content: content.trim(),
                senderId: userId,
                projectId: project.id,
            },
            include: {
                sender: { select: { id: true, name: true, role: true } },
            }
        });

        return NextResponse.json(message);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}, { allowClient: true, includeFinder: true });
