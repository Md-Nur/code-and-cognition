import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { serviceSchema } from "@/lib/validations/admin";

export const GET = withAuth(async () => {
    const services = await prisma.service.findMany({
        orderBy: { createdAt: "desc" },
    });
    return ApiResponse.success(services);
}, Role.FOUNDER);

export const POST = withAuth(async (req) => {
    try {
        const body = await req.json();
        const validation = serviceSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error(JSON.stringify(validation.error.format()));
        }

        const service = await prisma.service.create({
            data: validation.data as any,
        });
        return ApiResponse.success(service, 201);
    } catch (error) {
        console.error("Service Create Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);
