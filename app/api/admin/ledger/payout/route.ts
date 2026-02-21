import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role, SplitType } from "@prisma/client";
import { z } from "zod";

const payoutSchema = z.object({
    userId: z.string().min(1),
    amount: z.number().positive(),
    currency: z.enum(["BDT", "USD"]),
});

export const POST = withAuth(async (req) => {
    try {
        const body = await req.json();
        const validation = payoutSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error("Invalid input");
        }

        const { userId, amount, currency } = validation.data;

        await prisma.$transaction(async (tx) => {
            // 1. Create negative Ledger Entry (Payout)
            // We use a dummy payment or no payment for payouts? 
            // In our schema, LedgerEntry requires a paymentId. 
            // Let's create a "System Payment" or allow null paymentId if we modify schema.
            // Since we can't easily modify schema now, we'll create a system payment record.

            const systemPayment = await tx.payment.create({
                data: {
                    projectId: (await tx.project.findFirst())?.id || "",
                    currency,
                    amountBDT: currency === "BDT" ? -amount : null,
                    amountUSD: currency === "USD" ? -amount : null,
                    note: `Payout to user ${userId}`,
                }
            });

            await tx.ledgerEntry.create({
                data: {
                    paymentId: systemPayment.id,
                    userId,
                    type: SplitType.EXECUTION, // Or Payout if we had it
                    amountBDT: currency === "BDT" ? -amount : null,
                    amountUSD: currency === "USD" ? -amount : null,
                }
            });

            // 2. Update Balance
            await tx.ledgerBalance.update({
                where: { userId },
                data: {
                    totalBDT: { decrement: currency === "BDT" ? amount : 0 },
                    totalUSD: { decrement: currency === "USD" ? amount : 0 },
                }
            });
        });

        return ApiResponse.success({ message: "Payout recorded" });
    } catch (error) {
        console.error(error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);
