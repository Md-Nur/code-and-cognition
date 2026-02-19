import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { clientSchema } from "@/lib/validations/admin";

export const GET = withAuth(async () => {
    const clients = await prisma.client.findMany({
        orderBy: { order: "asc" },
    });
    return ApiResponse.success(clients);
}, Role.FOUNDER);

export const POST = withAuth(async (req) => {
    try {
        const body = await req.json();
        const validation = clientSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error(JSON.stringify(validation.error.format()));
        }

        const client = await prisma.client.create({
            data: validation.data as any,
        });
        return ApiResponse.success(client, 201);
    } catch (error) {
        console.error("Client Create Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);
