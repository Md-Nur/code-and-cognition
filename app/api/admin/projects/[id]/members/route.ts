import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { z } from "zod";

const addMemberSchema = z.object({
    userId: z.string().min(1),
    role: z.enum(["FINDER", "EXECUTION"]).default("EXECUTION"),
    share: z.number().min(0).max(100),
});

export const POST = withAuth(async (req, { params }) => {
    try {
        const { id: projectId } = await params;
        const body = await req.json();
        const validation = addMemberSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error("Invalid input");
        }

        const { userId, role, share } = validation.data;

        const member = await prisma.projectMember.upsert({
            where: {
                projectId_userId_role: {
                    projectId,
                    userId,
                    role,
                },
            },
            update: { share },
            create: {
                projectId,
                userId,
                role,
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
        const { id: projectId } = await params;
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const roleStr = searchParams.get("role") || "EXECUTION";
        const role = roleStr as any; // Cast to bypass simple check, zod would be better but keeping it simple here

        if (!userId) return ApiResponse.error("User ID required");

        await prisma.projectMember.delete({
            where: {
                projectId_userId_role: {
                    projectId,
                    userId,
                    role,
                },
            },
        });

        return ApiResponse.success({ message: "Member removed" });
    } catch (error) {
        console.error(error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);
