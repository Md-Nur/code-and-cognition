import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";

export const POST = withAuth(async (req: Request, { params }: { params: Promise<{ id: string }> }, session: any) => {
    try {
        const { id } = await params;

        if (!session.user.isCFO) {
            return ApiResponse.error("Only the designated CFO can approve expenses", 403);
        }

        // 1. Record the approval for history
        await prisma.expenseApproval.upsert({
            where: {
                expenseId_userId: {
                    expenseId: id,
                    userId: session.user.id
                }
            },
            update: { status: "APPROVED" },
            create: {
                expenseId: id,
                userId: session.user.id,
                status: "APPROVED"
            }
        });

        // 2. Approve the expense immediately (No consensus needed)
        await prisma.expense.update({
            where: { id },
            data: {
                status: "APPROVED",
                executedAt: new Date()
            }
        });

        return ApiResponse.success({
            message: "Expense approved successfully",
            consensusReached: true
        });
    } catch (error) {
        console.error("Approve Expense Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, [Role.FOUNDER, Role.CO_FOUNDER]);
