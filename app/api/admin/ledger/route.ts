import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { SplitType, Role } from "@prisma/client";

export const GET = withAuth(
  async (req, context, session) => {
    const isPrivileged = [Role.FOUNDER, Role.CO_FOUNDER].includes(session.user.role);

    // Privileged users see all company fund entries, overall stats, and pending withdrawals
    if (isPrivileged) {
      const companyFundEntries = await prisma.ledgerEntry.findMany({
        where: { type: SplitType.COMPANY_FUND },
        include: { payment: { include: { project: true } } },
        orderBy: { createdAt: "desc" },
      });

      const approvedExpenses = await prisma.expense.findMany({
        where: { status: "APPROVED" },
        orderBy: { date: "desc" },
      });

      const userBalances = await prisma.ledgerBalance.findMany({
        include: { user: true },
      });

      const pendingWithdrawals = await prisma.withdrawal.findMany({
        where: { status: "PENDING" },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });

      return ApiResponse.success({
        companyFundEntries,
        approvedExpenses,
        userBalances,
        pendingWithdrawals,
      });
    }

    // Contractor sees their own entries and balance
    const myEntries = await prisma.ledgerEntry.findMany({
      where: { userId: session.user.id },
      include: { payment: { include: { project: true } } },
      orderBy: { createdAt: "desc" },
    });

    const myBalance = await prisma.ledgerBalance.findUnique({
      where: { userId: session.user.id },
    });

    return ApiResponse.success({
      entries: myEntries,
      balance: myBalance,
    });
  },
  [Role.FOUNDER, Role.CONTRACTOR],
);
