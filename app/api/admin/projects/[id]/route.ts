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
