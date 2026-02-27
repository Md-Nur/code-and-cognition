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

    // Dynamic Split Ratios from Project
    const companyFundRatio = payment.project.companyFundRatio;
    const finderFeeRatio = payment.project.finderFeeRatio;
    const executionPoolRatio = Math.max(0, 1 - companyFundRatio - finderFeeRatio);

    // Calculate Amounts
    const companyFundAmount = amount * companyFundRatio;
    const finderFeeAmount = amount * finderFeeRatio;
    const executionPoolAmount = amount * executionPoolRatio;

    const entries: any[] = [];

    // 1. Company Fund Entry
    entries.push({
        paymentId: payment.id,
        projectId: payment.projectId,
        userId: null, // Company Fund
        type: SplitType.COMPANY_FUND,
        amountBDT: isBDT ? companyFundAmount : null,
        amountUSD: !isBDT ? companyFundAmount : null,
        note: `Company Fund (${(companyFundRatio * 100).toFixed(0)}%)`,
    });

    // 2. Finder Fee Entries (Distributed among role: FINDER)
    const finderMembers = payment.project.members.filter(m => m.role === "FINDER");
    const totalFinderShare = finderMembers.reduce((sum, m) => sum + m.share, 0);

    if (finderFeeAmount > 0) {
        if (finderMembers.length > 0) {
            for (const member of finderMembers) {
                const memberShareRatio = totalFinderShare > 0 ? member.share / totalFinderShare : 1 / finderMembers.length;
                const memberAmount = finderFeeAmount * memberShareRatio;

                entries.push({
                    paymentId: payment.id,
                    projectId: payment.projectId,
                    userId: member.userId,
                    type: SplitType.FINDER_FEE,
                    amountBDT: isBDT ? memberAmount : null,
                    amountUSD: !isBDT ? memberAmount : null,
                    note: `Finder Fee Share (${(memberShareRatio * 100).toFixed(0)}% of finder pool)`,
                });
            }
        } else if (payment.project.finderId) {
            // Fallback to legacy finderId if no FINDER members assigned
            entries.push({
                paymentId: payment.id,
                projectId: payment.projectId,
                userId: payment.project.finderId,
                type: SplitType.FINDER_FEE,
                amountBDT: isBDT ? finderFeeAmount : null,
                amountUSD: !isBDT ? finderFeeAmount : null,
                note: "Legacy Finder Fee",
            });
        }
    }

    // 3. Execution Pool Entries (Distributed among role: EXECUTION)
    const executionMembers = payment.project.members.filter(m => m.role === "EXECUTION");
    const totalExecutionShare = executionMembers.reduce((sum, m) => sum + m.share, 0);

    if (executionPoolAmount > 0 && executionMembers.length > 0) {
        for (const member of executionMembers) {
            const memberShareRatio = totalExecutionShare > 0 ? member.share / totalExecutionShare : 1 / executionMembers.length;
            const memberAmount = executionPoolAmount * memberShareRatio;

            entries.push({
                paymentId: payment.id,
                projectId: payment.projectId,
                userId: member.userId,
                type: SplitType.EXECUTION,
                amountBDT: isBDT ? memberAmount : null,
                amountUSD: !isBDT ? memberAmount : null,
                note: `Execution Share (${(memberShareRatio * 100).toFixed(0)}% of execution pool)`,
            });
        }
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
                await tx.ledgerBalance.upsert({
                    where: { userId: entry.userId },
                    update: {
                        totalBDT: { increment: entry.amountBDT || 0 },
                        totalUSD: { increment: entry.amountUSD || 0 },
                    },
                    create: {
                        userId: entry.userId,
                        totalBDT: entry.amountBDT || 0,
                        totalUSD: entry.amountUSD || 0,
                    }
                });
            }
        }

        // Add Activity Log
        await tx.activityLog.create({
            data: {
                projectId: payment.projectId,
                action: `processed revenue distribution for payment of ${amount} ${currency}: ${(companyFundRatio * 100).toFixed(0)}% Platform, ${(finderFeeRatio * 100).toFixed(0)}% Finder, and ${(executionPoolRatio * 100).toFixed(0)}% Execution Team.`,
            }
        });
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
