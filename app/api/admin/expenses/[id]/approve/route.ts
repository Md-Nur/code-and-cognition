import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";

export const POST = withAuth(async (req: Request, { params }: { params: Promise<{ id: string }> }, session: any) => {
    try {
        const { id } = await params;

        // 1. Record this founder's approval vote (upsert in case they change their mind)
        await prisma.expenseApproval.upsert({
            where: {
                expenseId_userId: {
                    expenseId: id,
                    userId: session.user.id
                }
            },
            update: { status: "APPROVED" },
            create: {
                expenseId: id,
                userId: session.user.id,
                status: "APPROVED"
            }
        });

        // 2. Count how many FOUNDER / CO_FOUNDER users exist
        const totalFounders = await prisma.user.count({
            where: {
                role: { in: [Role.FOUNDER, Role.CO_FOUNDER] }
            }
        });

        // 3. Count how many have voted APPROVED for this expense
        const approvedCount = await prisma.expenseApproval.count({
            where: {
                expenseId: id,
                status: "APPROVED"
            }
        });

        // 4. If everyone has approved → execute the expense
        if (approvedCount >= totalFounders) {
            await prisma.expense.update({
                where: { id },
                data: {
                    status: "APPROVED",
                    executedAt: new Date()
                }
            });

            return ApiResponse.success({
                message: "All founders have approved. Expense executed.",
                consensusReached: true,
                approvedCount,
                totalFounders
            });
        }

        return ApiResponse.success({
            message: `Approval recorded (${approvedCount}/${totalFounders} founders approved). Waiting for others.`,
            consensusReached: false,
            approvedCount,
            totalFounders
        });
    } catch (error) {
        console.error("Approve Expense Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, [Role.FOUNDER, Role.CO_FOUNDER]);
