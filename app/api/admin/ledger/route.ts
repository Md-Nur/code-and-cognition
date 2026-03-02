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
        withdrawal: true,
        expense: true
      },
      orderBy: { createdAt: "desc" },
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

      const completedWithdrawals = await prisma.withdrawal.findMany({
        where: { status: { in: ["COMPLETED", "REJECTED"] } },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });

      // Calculate Company Fund (All income - All expenses)
      const companyFundPool = await prisma.ledgerEntry.aggregate({
        where: { type: { in: [SplitType.COMPANY_FUND, SplitType.EXPENSE] } },
        _sum: { amountBDT: true, amountUSD: true }
      });

      const totalCompanyFund = {
        bdt: (companyFundPool._sum.amountBDT || 0),
        usd: (companyFundPool._sum.amountUSD || 0),
      };

      const totalUserBalances = {
        bdt: userBalances.reduce((acc, curr) => acc + curr.totalBDT, 0),
        usd: userBalances.reduce((acc, curr) => acc + curr.totalUSD, 0),
      };

      return ApiResponse.success({
        transactions,
        userBalances,
        pendingWithdrawals,
        completedWithdrawals,
        totalCompanyFund,
        totalUserBalances,
      });
    }

    return ApiResponse.success({
      transactions,
    });
  },
  [Role.FOUNDER, Role.CO_FOUNDER, Role.CONTRACTOR],
);
