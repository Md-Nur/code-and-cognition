import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { createInvitation, getInvitations, deleteInvitation } from "@/app/actions/invitations";

export const GET = withAuth(async () => {
    try {
        const invitations = await getInvitations();
        return ApiResponse.success(invitations);
    } catch (error: any) {
        return ApiResponse.error(error.message, 500);
    }
}, Role.FOUNDER);

export const POST = withAuth(async (req) => {
    try {
        const { email, role } = await req.json();
        if (!email || !role) {
            return ApiResponse.error("Email and role are required", 400);
        }
        const invitation = await createInvitation(email, role);
        return ApiResponse.success(invitation, 201);
    } catch (error: any) {
        return ApiResponse.error(error.message, 500);
    }
}, Role.FOUNDER);

export const DELETE = withAuth(async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return ApiResponse.error("Invitation ID is required", 400);
        }
        await deleteInvitation(id);
        return ApiResponse.success({ message: "Invitation deleted" });
    } catch (error: any) {
        return ApiResponse.error(error.message, 500);
    }
}, Role.FOUNDER);
