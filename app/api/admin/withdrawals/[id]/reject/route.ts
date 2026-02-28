import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role, WithdrawalStatus } from "@prisma/client";

export const POST = withAuth(async (req: Request, { params }: { params: Promise<{ id: string }> }, session: any) => {
    try {
        const { id } = await params;

        // Re-fetch isCFO from DB to guard against stale JWTs
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { isCFO: true },
        });

        if (!dbUser?.isCFO) {
            return ApiResponse.error("Only the designated CFO can reject withdrawals", 403);
        }

        const withdrawal = await prisma.withdrawal.findUnique({
            where: { id }
        });

        if (!withdrawal) {
            return ApiResponse.error("Withdrawal not found", 404);
        }

        if (withdrawal.status !== WithdrawalStatus.PENDING) {
            return ApiResponse.error("Only pending withdrawals can be rejected", 400);
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
