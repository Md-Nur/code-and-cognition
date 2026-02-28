import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";

export const POST = withAuth(async (req: Request, { params }: { params: Promise<{ id: string }> }, session: any) => {
    try {
        const { id } = await params;

        // 1. Record the approval
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

        // 2. Check if all founders/co-founders have approved
        const [founders, approvals] = await Promise.all([
            prisma.user.findMany({
                where: {
                    role: { in: [Role.FOUNDER, Role.CO_FOUNDER] }
                }
            }),
            prisma.expenseApproval.findMany({
                where: { expenseId: id, status: "APPROVED" }
            })
        ]);

        const founderIds = founders.map(f => f.id);
        const approvedUserIds = approvals.map(a => a.userId);

        // Check if all founders are in the approved list
        const allApproved = founderIds.every(fid => approvedUserIds.includes(fid));

        if (allApproved) {
            await prisma.expense.update({
                where: { id },
                data: {
                    status: "APPROVED",
                    executedAt: new Date()
                }
            });
        }

        return ApiResponse.success({
            message: "Expense approved successfully",
            consensusReached: allApproved
        });
    } catch (error) {
        console.error("Approve Expense Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, [Role.FOUNDER, Role.CO_FOUNDER]);
