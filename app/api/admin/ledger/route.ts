import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { SplitType, Role } from "@prisma/client";

export const GET = withAuth(
  async (req, context, session) => {
    const isPrivileged = [Role.FOUNDER, Role.CO_FOUNDER].includes(session.user.role);

    // All allowed users (Founders, Co-Founders, Contractors) see company fund entries and approved expenses
    // All allowed users (Founders, Co-Founders, Contractors) see company transaction history
    // and approved expenses
    const transactions = await prisma.ledgerEntry.findMany({
      include: { 
        payment: { include: { project: true } },
        user: true,
        withdrawal: true
      },
      orderBy: { createdAt: "desc" },
    });

    const approvedExpenses = await prisma.expense.findMany({
      where: { status: "APPROVED" },
      orderBy: { date: "desc" },
    });

    // Privileged users also see overall stats and pending withdrawals
    if (isPrivileged) {
      const userBalances = await prisma.ledgerBalance.findMany({
        include: { user: true },
      });

      const pendingWithdrawals = await prisma.withdrawal.findMany({
        where: { status: "PENDING" },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });

      return ApiResponse.success({
        transactions,
        approvedExpenses,
        userBalances,
        pendingWithdrawals,
      });
    }

    return ApiResponse.success({
      transactions,
      approvedExpenses,
    });
  },
  [Role.FOUNDER, Role.CO_FOUNDER, Role.CONTRACTOR],
);
