import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role, SplitType, WithdrawalStatus } from "@prisma/client";
import { z } from "zod";

// GET /api/user/withdraw — list current user's withdrawal history
export const GET = withAuth(async (req, context, session) => {
    try {
        const userId = session.user.id;
        const withdrawals = await prisma.withdrawal.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return ApiResponse.success(withdrawals);
    } catch (error) {
        console.error("[WITHDRAW_GET]", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, [Role.FOUNDER, Role.CO_FOUNDER, Role.CONTRACTOR]);

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

        // 1. Check current balance vs (requested amount + pending withdrawals)
        const balance = await prisma.ledgerBalance.findUnique({
            where: { userId },
        });

        if (!balance) {
            return ApiResponse.error("Insufficient balance", 400);
        }

        const pendingWithdrawals = await prisma.withdrawal.findMany({
            where: { userId, status: WithdrawalStatus.PENDING },
        });

        const totalPending = pendingWithdrawals.reduce((sum, w) => {
            if (w.currency === currency) return sum + w.amount;
            return sum;
        }, 0);

        const currentBalance = currency === "BDT" ? balance.totalBDT : balance.totalUSD;
        if (currentBalance < (amount + totalPending)) {
            return ApiResponse.error("Insufficient balance (including pending requests)", 400);
        }

        // 2. Create withdrawal request (PENDING)
        const withdrawal = await prisma.withdrawal.create({
            data: {
                userId,
                amount,
                currency,
                note,
                status: WithdrawalStatus.PENDING,
            },
        });

        return ApiResponse.success({ message: "Withdrawal request submitted for approval", withdrawal });
    } catch (error) {
        console.error("[WITHDRAW_POST]", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, [Role.FOUNDER, Role.CO_FOUNDER, Role.CONTRACTOR]);
