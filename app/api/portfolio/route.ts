import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');

    try {
        const portfolioItems = await prisma.portfolioItem.findMany({
            where: serviceId ? { serviceId } : {},
            include: {
                service: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(portfolioItems);
    } catch (error) {
        console.error("Error fetching portfolio items:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
