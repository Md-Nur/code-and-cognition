import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            where: { status: "ACTIVE" },
            include: {
                subCategories: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        imageUrl: true,
                        basePriceBDT: true,
                        basePriceUSD: true,
                        mediumPriceBDT: true,
                        mediumPriceUSD: true,
                        proPriceBDT: true,
                        proPriceUSD: true,
                    }
                }
            },
            orderBy: { createdAt: "asc" },
        });
        return NextResponse.json(services);
    } catch (error) {
        console.error("Error fetching services:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
