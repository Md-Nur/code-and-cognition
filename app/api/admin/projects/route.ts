import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "@prisma/client";

const projectSchema = z.object({
    title: z.string().min(1),
    bookingId: z.string().optional(),
    finderId: z.string().min(1),
    status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
});

export async function GET() {
    const session = await auth();
    if (session?.user?.role !== Role.FOUNDER) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
        include: {
            finder: true,
            booking: true,
            _count: { select: { members: true, payments: true } },
        },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
}

export async function POST(req: Request) {
    const session = await auth();
    if (session?.user?.role !== Role.FOUNDER) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const validation = projectSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const project = await prisma.project.create({
            data: validation.data,
        });
        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
