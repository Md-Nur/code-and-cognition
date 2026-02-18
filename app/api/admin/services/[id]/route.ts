import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { serviceSchema } from "@/lib/validations/admin";

export const PUT = withAuth(async (req, { params }) => {
    const { id } = params;

    try {
        const body = await req.json();
        const validation = serviceSchema.partial().safeParse(body);

        if (!validation.success) {
            return ApiResponse.error(JSON.stringify(validation.error.format()));
        }

        const service = await prisma.service.update({
            where: { id },
            data: validation.data as any,
        });
        return ApiResponse.success(service);
    } catch (error) {
        console.error("Service Update Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);

export const DELETE = withAuth(async (req, { params }) => {
    const { id } = params;

    try {
        await prisma.service.delete({
            where: { id },
        });
        return ApiResponse.success({ success: true });
    } catch (error) {
        console.error("Service Delete Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);
