import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role, SplitType, WithdrawalStatus } from "@prisma/client";
import { z } from "zod";

const withdrawalSchema = z.object({
    amount: z.number().positive(),
    currency: z.enum(["BDT", "USD"]),
    note: z.string().optional(),
});

export const POST = withAuth(async (req, context, session) => {
    try {
        const body = await req.json();
        const validation = withdrawalSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error("Invalid input", 400);
        }

        const { amount, currency, note } = validation.data;
        const userId = session.user.id;

        // 1. Check current balance
        const balance = await prisma.ledgerBalance.findUnique({
            where: { userId },
        });

        if (!balance) {
            return ApiResponse.error("Insufficient balance", 400);
        }

        const currentBalance = currency === "BDT" ? balance.totalBDT : balance.totalUSD;
        if (currentBalance < amount) {
            return ApiResponse.error("Insufficient balance", 400);
        }

        // 2. Process withdrawal
        const withdrawal = await prisma.$transaction(async (tx) => {
            // Create Withdrawal record
            const withdraw = await tx.withdrawal.create({
                data: {
                    userId,
                    amount,
                    currency,
                    note,
                    status: WithdrawalStatus.COMPLETED, // Auto-completed for now
                    processedAt: new Date(),
                },
            });

            // Create negative Ledger Entry
            await tx.ledgerEntry.create({
                data: {
                    userId,
                    withdrawalId: withdraw.id,
                    type: SplitType.WITHDRAWAL,
                    amountBDT: currency === "BDT" ? -amount : null,
                    amountUSD: currency === "USD" ? -amount : null,
                    note: note || "Withdrawal",
                },
            });

            // Update Ledger Balance
            await tx.ledgerBalance.update({
                where: { userId },
                data: {
                    totalBDT: { decrement: currency === "BDT" ? amount : 0 },
                    totalUSD: { decrement: currency === "USD" ? amount : 0 },
                },
            });

            return withdraw;
        });

        return ApiResponse.success({ message: "Withdrawal successful", withdrawal });
    } catch (error) {
        console.error("[WITHDRAW_POST]", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, [Role.FOUNDER, Role.CO_FOUNDER, Role.CONTRACTOR]);
