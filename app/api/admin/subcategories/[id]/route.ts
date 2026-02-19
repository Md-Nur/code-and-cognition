import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (session?.user?.role !== Role.FOUNDER) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        await prisma.subCategory.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (session?.user?.role !== Role.FOUNDER) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const body = await req.json();
        const updated = await prisma.subCategory.update({
            where: { id },
            data: {
                title: body.title,
                slug: body.slug,
                description: body.description,
                imageUrl: body.imageUrl,
                basePriceBDT: body.basePriceBDT ?? 0,
                basePriceUSD: body.basePriceUSD ?? 0,
                mediumPriceBDT: body.mediumPriceBDT ?? 0,
                mediumPriceUSD: body.mediumPriceUSD ?? 0,
                proPriceBDT: body.proPriceBDT ?? 0,
                proPriceUSD: body.proPriceUSD ?? 0,
            },
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
