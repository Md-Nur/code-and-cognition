import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { projectSchema } from "@/lib/validations/admin";

export const GET = withAuth(async () => {
    const projects = await prisma.project.findMany({
        include: {
            finder: true,
            booking: true,
            _count: { select: { members: true, payments: true } },
        },
        orderBy: { createdAt: "desc" },
    });
    return ApiResponse.success(projects);
}, Role.FOUNDER);

export const POST = withAuth(async (req) => {
    try {
        const body = await req.json();
        const validation = projectSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error(JSON.stringify(validation.error.format()));
        }

        const project = await prisma.project.create({
            data: validation.data as any,
        });
        return ApiResponse.success(project, 201);
    } catch (error) {
        console.error("Project Create Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);
