import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/api-handler";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        if (!token) {
            return ApiResponse.error("Token is required", 400);
        }

        const invitation = await prisma.invitation.findUnique({
            where: { token },
        });

        if (!invitation || invitation.used || invitation.expiresAt < new Date()) {
            return ApiResponse.error("Invalid or expired invitation token", 401);
        }

        return ApiResponse.success({
            email: invitation.email,
            role: invitation.role,
        });
    } catch (error) {
        console.error("Invitation Fetch Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}
