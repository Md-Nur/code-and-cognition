import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role, WithdrawalStatus } from "@prisma/client";

export const GET = withAuth(async () => {
    try {
        const withdrawals = await prisma.withdrawal.findMany({
            where: { status: WithdrawalStatus.PENDING },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        return ApiResponse.success(withdrawals);
    } catch (error) {
        console.error("Fetch Pending Withdrawals Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, [Role.FOUNDER, Role.CO_FOUNDER]);
