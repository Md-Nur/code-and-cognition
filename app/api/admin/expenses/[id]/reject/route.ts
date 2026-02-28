import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";

export const POST = withAuth(async (req: Request, { params }: { params: Promise<{ id: string }> }, session: any) => {
    try {
        const { id } = await params;

        // 1. Record this founder's rejection vote
        await prisma.expenseApproval.upsert({
            where: {
                expenseId_userId: {
                    expenseId: id,
                    userId: session.user.id
                }
            },
            update: { status: "REJECTED" },
            create: {
                expenseId: id,
                userId: session.user.id,
                status: "REJECTED"
            }
        });

        // 2. A single rejection is enough to reject the expense immediately
        await prisma.expense.update({
            where: { id },
            data: { status: "REJECTED" }
        });

        return ApiResponse.success({ message: "Expense rejected." });
    } catch (error) {
        console.error("Reject Expense Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, [Role.FOUNDER, Role.CO_FOUNDER]);
