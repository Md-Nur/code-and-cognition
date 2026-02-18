import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { SplitType, Role } from "@prisma/client";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

        return NextResponse.json({
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

    return NextResponse.json({
        entries: myEntries,
        balance: myBalance,
    });
}
