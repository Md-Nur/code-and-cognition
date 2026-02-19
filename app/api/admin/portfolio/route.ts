import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";

export const GET = withAuth(async () => {
    const items = await prisma.portfolioItem.findMany({
        include: {
            service: { select: { title: true } },
            subCategory: { select: { title: true } }
        },
        orderBy: { createdAt: "desc" },
    });
    return ApiResponse.success(items);
}, Role.FOUNDER);

export const POST = withAuth(async (req) => {
    try {
        const body = await req.json();
        const item = await prisma.portfolioItem.create({
            data: {
                ...body,
                technologies: Array.isArray(body.technologies) ? body.technologies : []
            },
        });
        return ApiResponse.success(item, 201);
    } catch (error) {
        console.error("Error creating portfolio item:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);
