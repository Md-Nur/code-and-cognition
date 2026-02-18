import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

export async function GET() {
    const session = await auth();
    if (session?.user?.role !== Role.FOUNDER) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.portfolioItem.findMany({
        include: { service: { select: { title: true } } },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
}

export async function POST(req: Request) {
    const session = await auth();
    if (session?.user?.role !== Role.FOUNDER) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const item = await prisma.portfolioItem.create({
            data: body,
        });
        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error("Error creating portfolio item:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
