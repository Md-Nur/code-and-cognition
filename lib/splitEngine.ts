import { prisma } from "@/lib/prisma";
import { Currency, SplitType } from "@prisma/client";

export async function processPaymentSplit(paymentId: string) {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
            project: {
                include: {
                    members: true,
                    finder: true,
                },
            },
        },
    });

    if (!payment) throw new Error("Payment not found");
    if (!payment.amountBDT && !payment.amountUSD) throw new Error("Payment has no amount");

    const amount = (payment.amountBDT || payment.amountUSD) as number;
    const currency = payment.currency;

    const isBDT = currency === Currency.BDT;

    // Split Ratios
    const companyFundRatio = 0.20;
    const finderFeeRatio = 0.10;
    const executionPoolRatio = 0.70;

    // Calculate Amounts
    const companyFundAmount = amount * companyFundRatio;
    const finderFeeAmount = amount * finderFeeRatio;
    const executionPoolAmount = amount * executionPoolRatio;

    const entries: any[] = [];

    // 1. Company Fund Entry
    entries.push({
        paymentId: payment.id,
        userId: null, // Company Fund
        type: SplitType.COMPANY_FUND,
        amountBDT: isBDT ? companyFundAmount : 0,
        amountUSD: !isBDT ? companyFundAmount : 0,
    });

    // 2. Finder Fee Entry
    // The finder is stored on the Project model
    const finderId = payment.project.finderId;
    entries.push({
        paymentId: payment.id,
        userId: finderId,
        type: SplitType.FINDER_FEE,
        amountBDT: isBDT ? finderFeeAmount : 0,
        amountUSD: !isBDT ? finderFeeAmount : 0,
    });

    // 3. Execution Pool Entries
    const members = payment.project.members;
    // Total share calculation to normalize if needed, assuming shares sum to 100 or 1.
    // Let's assume shares are percentages (e.g. 50, 50).
    const totalShare = members.reduce((sum, m) => sum + m.share, 0);

    for (const member of members) {
        const memberShareRatio = member.share / totalShare;
        const memberAmount = executionPoolAmount * memberShareRatio;

        entries.push({
            paymentId: payment.id,
            userId: member.userId,
            type: SplitType.EXECUTION,
            amountBDT: isBDT ? memberAmount : 0,
            amountUSD: !isBDT ? memberAmount : 0,
        });
    }

    // Database Transaction
    await prisma.$transaction(async (tx) => {
        // Create Ledger Entries
        await tx.ledgerEntry.createMany({
            data: entries,
        });

        // Update Ledger Balances
        for (const entry of entries) {
            if (entry.userId) { // Skip company fund for user balance updates
                const balance = await tx.ledgerBalance.findUnique({
                    where: { userId: entry.userId }
                });

                if (balance) {
                    await tx.ledgerBalance.update({
                        where: { userId: entry.userId },
                        data: {
                            totalBDT: { increment: entry.amountBDT || 0 },
                            totalUSD: { increment: entry.amountUSD || 0 },
                        }
                    });
                } else {
                    await tx.ledgerBalance.create({
                        data: {
                            userId: entry.userId,
                            totalBDT: entry.amountBDT || 0,
                            totalUSD: entry.amountUSD || 0,
                        }
                    });
                }
            }
        }
    });

    return { success: true, entriesGenerated: entries.length };
}

export async function reversePaymentSplit(paymentId: string) {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { splits: true },
    });

    if (!payment) throw new Error("Payment not found");

    // Database Transaction
    await prisma.$transaction(async (tx) => {
        // Reverse Ledger Balances
        for (const entry of payment.splits) {
            if (entry.userId) { // Skip company fund as it's not tracked in LedgerBalance
                const balance = await tx.ledgerBalance.findUnique({
                    where: { userId: entry.userId }
                });

                if (balance) {
                    await tx.ledgerBalance.update({
                        where: { userId: entry.userId },
                        data: {
                            totalBDT: { decrement: entry.amountBDT || 0 },
                            totalUSD: { decrement: entry.amountUSD || 0 },
                        }
                    });
                }
            }
        }

        // Delete Ledger Entries
        await tx.ledgerEntry.deleteMany({
            where: { paymentId },
        });
    });

    return { success: true };
}
