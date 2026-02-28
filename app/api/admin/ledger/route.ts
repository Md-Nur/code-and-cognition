import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { SplitType, Role } from "@prisma/client";

export const GET = withAuth(
  async (req, context, session) => {
    const isFounder = session.user.role === Role.FOUNDER;

    // Founder sees all company fund entries and overall stats
    if (isFounder) {
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

      // Combine and format for UI consistency if needed, 
      // but for now just sending both lists is fine as the UI handles them.
      return ApiResponse.success({
        companyFundEntries,
        approvedExpenses,
        userBalances,
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
