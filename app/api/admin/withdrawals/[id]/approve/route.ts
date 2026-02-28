import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role, WithdrawalStatus, SplitType } from "@prisma/client";

export const POST = withAuth(async (req: Request, { params }: { params: Promise<{ id: string }> }, session: any) => {
    try {
        const { id } = await params;

        if (!session.user.isCFO) {
            return ApiResponse.error("Only the designated CFO can approve withdrawals", 403);
        }

        const withdrawal = await prisma.withdrawal.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!withdrawal || withdrawal.status !== WithdrawalStatus.PENDING) {
            return ApiResponse.error("Withdrawal request not found or not pending", 400);
        }

        // Process approval in a transaction
        await prisma.$transaction(async (tx) => {
            // 1. Update status
            await tx.withdrawal.update({
                where: { id },
                data: {
                    status: WithdrawalStatus.COMPLETED,
                    processedAt: new Date()
                }
            });

            // 2. Create negative Ledger Entry
            await tx.ledgerEntry.create({
                data: {
                    userId: withdrawal.userId,
                    withdrawalId: withdrawal.id,
                    type: SplitType.WITHDRAWAL,
                    amountBDT: withdrawal.currency === "BDT" ? -withdrawal.amount : null,
                    amountUSD: withdrawal.currency === "USD" ? -withdrawal.amount : null,
                    note: withdrawal.note || "Withdrawal Approved",
                }
            });

            // 3. Update Ledger Balance
            await tx.ledgerBalance.update({
                where: { userId: withdrawal.userId },
                data: {
                    totalBDT: { decrement: withdrawal.currency === "BDT" ? withdrawal.amount : 0 },
                    totalUSD: { decrement: withdrawal.currency === "USD" ? withdrawal.amount : 0 },
                }
            });
        });

        return ApiResponse.success({ message: "Withdrawal approved successfully" });
    } catch (error) {
        console.error("Approve Withdrawal Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, [Role.FOUNDER]);
