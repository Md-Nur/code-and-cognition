import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { z } from "zod";

const addMemberSchema = z.object({
    userId: z.string().min(1),
    share: z.number().min(0).max(100),
});

export const POST = withAuth(async (req, { params }) => {
    try {
        const { id: projectId } = params;
        const body = await req.json();
        const validation = addMemberSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error("Invalid input");
        }

        const { userId, share } = validation.data;

        const member = await prisma.projectMember.upsert({
            where: {
                projectId_userId: {
                    projectId,
                    userId,
                },
            },
            update: { share },
            create: {
                projectId,
                userId,
                share,
            },
        });

        return ApiResponse.success(member, 201);
    } catch (error) {
        console.error(error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);

export const DELETE = withAuth(async (req, { params }) => {
    try {
        const { id: projectId } = params;
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) return ApiResponse.error("User ID required");

        await prisma.projectMember.delete({
            where: {
                projectId_userId: {
                    projectId,
                    userId,
                },
            },
        });

        return ApiResponse.success({ message: "Member removed" });
    } catch (error) {
        console.error(error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);
