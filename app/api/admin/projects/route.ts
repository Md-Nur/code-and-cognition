import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { projectSchema } from "@/lib/validations/admin";

export const GET = withAuth(async (req: any, context: any, session: any) => {
    const { user } = session;
    let where: any = {};

    if (user.role === Role.CONTRACTOR) {
        where = {
            OR: [
                { finderId: user.id },
                { members: { some: { userId: user.id } } }
            ]
        };
    } else if (user.role === Role.CLIENT) {
        where = {
            booking: {
                clientEmail: {
                    equals: user.email,
                    mode: 'insensitive'
                }
            }
        };
    }

    const projects = await prisma.project.findMany({
        where,
        include: {
            finder: true,
            booking: true,
            _count: { select: { members: true, payments: true } },
        },
        orderBy: { createdAt: "desc" },
    });
    return ApiResponse.success(projects);
}, [Role.FOUNDER, Role.CONTRACTOR, Role.CLIENT]);

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
