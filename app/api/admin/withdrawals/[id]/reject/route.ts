import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role, WithdrawalStatus } from "@prisma/client";

export const POST = withAuth(async (req, { params }) => {
    try {
        const { id } = await params;

        const withdrawal = await prisma.withdrawal.findUnique({
            where: { id }
        });

        if (!withdrawal || withdrawal.status !== WithdrawalStatus.PENDING) {
            return ApiResponse.error("Withdrawal request not found or not pending", 400);
        }

        await prisma.withdrawal.update({
            where: { id },
            data: {
                status: WithdrawalStatus.REJECTED,
                processedAt: new Date()
            }
        });

        return ApiResponse.success({ message: "Withdrawal rejected" });
    } catch (error) {
        console.error("Reject Withdrawal Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, [Role.FOUNDER]);
