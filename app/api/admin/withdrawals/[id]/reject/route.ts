import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role, WithdrawalStatus } from "@prisma/client";

export const POST = withAuth(async (req: Request, { params }: { params: Promise<{ id: string }> }, session: any) => {
    try {
        const { id } = await params;

        if (!session.user.isCFO) {
            return ApiResponse.error("Only the designated CFO can reject withdrawals", 403);
        }

        const withdrawal = await prisma.withdrawal.findUnique({
            where: { id }
        });

        if (!withdrawal) {
            return ApiResponse.error("Withdrawal not found", 404);
        }

        await prisma.withdrawal.update({
            where: { id },
            data: { status: "REJECTED" }
        });

        return ApiResponse.success({ message: "Withdrawal rejected" });
    } catch (error) {
        console.error("Reject Withdrawal Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, [Role.FOUNDER]);
