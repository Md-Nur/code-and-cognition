import { prisma } from "@/lib/prisma";
import { processPaymentSplit, reversePaymentSplit } from "@/lib/splitEngine";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { paymentSchema } from "@/lib/validations/admin";

export const PUT = withAuth(async (req, context, session) => {
    try {
        if (!session?.user?.isCFO) {
            return ApiResponse.error("Only the CFO can update a payment", 403);
        }

        const { id } = context.params;
        const body = await req.json();
        const validation = paymentSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error(JSON.stringify(validation.error.format()));
        }

        const { projectId, amount, currency, note } = validation.data;

        // Verify Payment exists
        const existingPayment = await prisma.payment.findUnique({
            where: { id },
        });

        if (!existingPayment) {
            return ApiResponse.error("Payment not found", 404);
        }

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (existingPayment.paidAt < twentyFourHoursAgo) {
            return ApiResponse.error("Payment cannot be edited or deleted after 24 hours.", 403);
        }

        // 1. Reverse the existing split
        await reversePaymentSplit(id);

        // 2. Update the Payment record
        await prisma.payment.update({
            where: { id },
            data: {
                projectId,
                currency,
                amountBDT: currency === "BDT" ? amount : null,
                amountUSD: currency === "USD" ? amount : null,
                note,
            },
        });

        // 3. Process new split
        await processPaymentSplit(id);

        return ApiResponse.success({ message: "Payment updated successfully" });
    } catch (error) {
        console.error(error);
        return ApiResponse.error("Internal Server Error", 500);
    }
});

export const DELETE = withAuth(async (req, context, session) => {
    try {
        if (!session?.user?.isCFO) {
            return ApiResponse.error("Only the CFO can delete a payment", 403);
        }

        const { id } = context.params;

        // Verify Payment exists
        const payment = await prisma.payment.findUnique({
            where: { id },
        });

        if (!payment) {
            return ApiResponse.error("Payment not found", 404);
        }

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (payment.paidAt < twentyFourHoursAgo) {
            return ApiResponse.error("Payment cannot be edited or deleted after 24 hours.", 403);
        }

        // 1. Reverse the existing split
        await reversePaymentSplit(id);

        // 2. Delete the Payment record
        await prisma.payment.delete({
            where: { id },
        });

        return ApiResponse.success({ message: "Payment deleted successfully" });
    } catch (error) {
        console.error(error);
        return ApiResponse.error("Internal Server Error", 500);
    }
});
