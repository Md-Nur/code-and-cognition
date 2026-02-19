import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        const where: any = { status: "ACTIVE" };

        if (query) {
            const aliasMap: { [key: string]: string } = {
                "web dev": "Web Application Development",
                "web development": "Web Application Development",
                "seo": "Search Engine Optimization",
                "smm": "Social Media Marketing",
                "fb": "Facebook",
                "insta": "Instagram",
                "ui/ux": "User Interface & User Experience",
                "graphics": "Graphic Design",
            };

            const lowercaseQuery = query.toLowerCase();
            const expandedTerms = [query];

            // Check for direct alias matches
            for (const [alias, fullTerm] of Object.entries(aliasMap)) {
                if (lowercaseQuery.includes(alias)) {
                    expandedTerms.push(fullTerm);
                }
            }

            // Split into significant words (2+ chars)
            const words = query.split(/\s+/).filter(w => w.length >= 2);

            where.OR = [
                ...expandedTerms.map(term => ({ title: { contains: term, mode: "insensitive" } })),
                ...expandedTerms.map(term => ({ description: { contains: term, mode: "insensitive" } })),
                {
                    subCategories: {
                        some: {
                            OR: [
                                ...expandedTerms.map(term => ({ title: { contains: term, mode: "insensitive" } })),
                                ...expandedTerms.map(term => ({ description: { contains: term, mode: "insensitive" } })),
                            ],
                        },
                    },
                },
            ];

            // If multiple words, add an AND condition requiring ALL words to be present somewhere
            if (words.length > 1) {
                where.OR.push({
                    AND: words.map(word => ({
                        OR: [
                            { title: { contains: word, mode: "insensitive" } },
                            { description: { contains: word, mode: "insensitive" } },
                            {
                                subCategories: {
                                    some: {
                                        OR: [
                                            { title: { contains: word, mode: "insensitive" } },
                                            { description: { contains: word, mode: "insensitive" } },
                                        ],
                                    },
                                },
                            },
                        ]
                    }))
                });
            }
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
