import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        const where: any = { status: "ACTIVE" };

        if (query) {
            where.OR = [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                {
                    subCategories: {
                        some: {
                            OR: [
                                { title: { contains: query, mode: "insensitive" } },
                                { description: { contains: query, mode: "insensitive" } },
                            ],
                        },
                    },
                },
            ];
        }

        const services = await prisma.service.findMany({
            where,
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
                },
                portfolioItems: {
                    select: {
                        id: true,
                        title: true,
                        imageUrl: true,
                    },
                    take: 3,
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
