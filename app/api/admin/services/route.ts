import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "@prisma/client";

const serviceSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    basePriceBDT: z.number().min(0),
    basePriceUSD: z.number().min(0),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export async function GET() {
    const session = await auth();
    if (session?.user?.role !== Role.FOUNDER) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const services = await prisma.service.findMany({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(services);
}

export async function POST(req: Request) {
    const session = await auth();
    if (session?.user?.role !== Role.FOUNDER) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const validation = serviceSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const service = await prisma.service.create({
            data: validation.data,
        });
        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
