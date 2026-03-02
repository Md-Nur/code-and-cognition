import { prisma } from "@/lib/prisma";
import { processPaymentSplit } from "@/lib/splitEngine";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { paymentSchema } from "@/lib/validations/admin";

export const GET = withAuth(async (req, context, session) => {
    if (session?.user?.role !== Role.FOUNDER && session?.user?.role !== Role.CO_FOUNDER && !session?.user?.isCFO) {
        return ApiResponse.error("Forbidden", 403);
    }
    const payments = await prisma.payment.findMany({
        include: {
            project: true,
            approvals: {
                include: {
                    user: {
                        select: { name: true, email: true }
                    }
                }
            }
        },
        orderBy: { paidAt: "desc" },
    });
    return ApiResponse.success(payments);
});

export const POST = withAuth(async (req, context, session) => {
    try {
        if (!session?.user?.isCFO) {
            return ApiResponse.error("Only the CFO can add a payment", 403);
        }

        const body = await req.json();
        const validation = paymentSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error(JSON.stringify(validation.error.format()));
        }

        const { projectId, amount, currency, note } = validation.data;

        // Validation for Finder and Execution members
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { members: true },
        });

        if (!project) {
            return ApiResponse.error("Project not found", 404);
        }

        const hasFinder = project.finderId || project.members.some(m => m.role === "FINDER");
        const hasExecution = project.members.some(m => m.role === "EXECUTION");

        if (!hasFinder || !hasExecution) {
            return ApiResponse.error("Please add a finder and at least one executive member to this project before adding a payment.", 400);
        }

        // Create Payment Record (Immediately APPROVED for CFO)
        const payment = await prisma.payment.create({
            data: {
                projectId,
                currency,
                amountBDT: currency === "BDT" ? amount : null,
                amountUSD: currency === "USD" ? amount : null,
                note,
                status: "APPROVED",
                executedAt: new Date()
            },
        });

        // Split Engine triggered immediately
        await processPaymentSplit(payment.id);

        return ApiResponse.success(payment, 201);
    } catch (error) {
        console.error(error);
        return ApiResponse.error("Internal Server Error", 500);
    }
});
