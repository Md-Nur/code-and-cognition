import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { processPaymentSplit } from "@/lib/splitEngine";

export const POST = withAuth(async (req: Request, { params }: { params: Promise<{ id: string }> }, session: any) => {
    try {
        const { id } = await params;

        // 1. Record this founder's approval vote
        await prisma.paymentApproval.upsert({
            where: {
                paymentId_userId: {
                    paymentId: id,
                    userId: session.user.id
                }
            },
            update: { status: "APPROVED" },
            create: {
                paymentId: id,
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

        // 3. Count how many have voted APPROVED for this payment
        const approvedCount = await prisma.paymentApproval.count({
            where: {
                paymentId: id,
                status: "APPROVED"
            }
        });

        // 4. If everyone has approved → execute the payment splits
        if (approvedCount >= totalFounders) {
            await prisma.payment.update({
                where: { id },
                data: {
                    status: "APPROVED",
                    executedAt: new Date()
                }
            });

            // Trigger Split Engine
            await processPaymentSplit(id);

            return ApiResponse.success({
                message: "All founders have approved. Payment splits processed.",
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
        console.error("Approve Payment Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, [Role.FOUNDER, Role.CO_FOUNDER]);
