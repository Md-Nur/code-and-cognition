import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { SplitType, Role } from "@prisma/client";

export const GET = withAuth(async (req, context, session) => {
    const isFounder = session.user.role === Role.FOUNDER;

    // Founder sees all company fund entries and overall stats
    if (isFounder) {
        const companyFundEntries = await prisma.ledgerEntry.findMany({
            where: { type: SplitType.COMPANY_FUND },
            include: { payment: { include: { project: true } } },
            orderBy: { createdAt: "desc" },
        });

        const userBalances = await prisma.ledgerBalance.findMany({
            include: { user: true },
        });

        return ApiResponse.success({
            companyFundEntries,
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
});
