import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { clientSchema } from "@/lib/validations/admin";

export const PUT = withAuth(async (req, { params }) => {
    try {
        const { id } = await params;
        const body = await req.json();
        const validation = clientSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error(JSON.stringify(validation.error.format()));
        }

        const client = await prisma.client.update({
            where: { id },
            data: validation.data as any,
        });
        return ApiResponse.success(client);
    } catch (error) {
        console.error("Client Update Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);

export const DELETE = withAuth(async (req, { params }) => {
    try {
        const { id } = await params;
        await prisma.client.delete({
            where: { id },
        });
        return ApiResponse.success(null, 204);
    } catch (error) {
        console.error("Client Delete Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);
