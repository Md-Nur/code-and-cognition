import { prisma } from "@/lib/prisma";
import { processPaymentSplit } from "@/lib/splitEngine";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { paymentSchema } from "@/lib/validations/admin";

export const GET = withAuth(async () => {
    const payments = await prisma.payment.findMany({
        include: { project: true },
        orderBy: { paidAt: "desc" },
    });
    return ApiResponse.success(payments);
}, Role.FOUNDER);

export const POST = withAuth(async (req) => {
    try {
        const body = await req.json();
        const validation = paymentSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error(JSON.stringify(validation.error.format()));
        }

        const { projectId, amount, currency, note } = validation.data;

        // Create Payment Record
        const payment = await prisma.payment.create({
            data: {
                projectId,
                currency,
                amountBDT: currency === "BDT" ? amount : null,
                amountUSD: currency === "USD" ? amount : null,
                note,
            },
        });

        // Trigger Split Engine
        await processPaymentSplit(payment.id);

        return ApiResponse.success(payment, 201);
    } catch (error) {
        console.error(error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);
