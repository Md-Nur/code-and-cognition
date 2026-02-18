import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
    const session = await auth();
    if (session?.user?.role !== Role.FOUNDER) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, serviceId, description } = body;

        if (!title || !serviceId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const subCategory = await prisma.subCategory.create({
            data: { title, serviceId, description },
        });

        return NextResponse.json(subCategory, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
