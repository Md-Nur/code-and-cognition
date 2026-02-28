import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role, VoteStatus } from "@prisma/client";

export const POST = withAuth(async (req, { params }: { params: Promise<{ id: string }> }, session: any) => {
    try {
        const { id } = await params;

        // 1. Record/Update approval
        await prisma.coFounderApproval.upsert({
            where: {
                proposalId_userId: {
                    proposalId: id,
                    userId: session.user.id
                }
            },
            update: { status: "APPROVED" },
            create: {
                proposalId: id,
                userId: session.user.id,
                status: "APPROVED"
            }
        });

        // 2. Fetch proposal and all current founders/co-founders
        const [proposal, founders, approvals] = await Promise.all([
            prisma.coFounderProposal.findUnique({
                where: { id },
                include: { user: true }
            }),
            prisma.user.findMany({
                where: { role: { in: [Role.FOUNDER, Role.CO_FOUNDER] } },
                select: { id: true }
            }),
            prisma.coFounderApproval.findMany({
                where: { proposalId: id, status: "APPROVED" }
            })
        ]);

        if (!proposal) return ApiResponse.notFound("Proposal");

        const founderIds = founders.map(f => f.id);
        const approvedUserIds = approvals.map(a => a.userId);

        // 3. Check consensus
        const allApproved = founderIds.every(fid => approvedUserIds.includes(fid));

        if (allApproved) {
            // Transaction to update role and create shares
            await prisma.$transaction([
                prisma.user.update({
                    where: { id: proposal.userId },
                    data: { role: Role.CO_FOUNDER }
                }),
                prisma.companyShare.create({
                    data: {
                        userId: proposal.userId,
                        percentage: proposal.targetShare,
                        lockedUntil: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000), // 2 years
                        note: "Initial co-founder share allocation via consensus"
                    }
                }),
                prisma.coFounderProposal.update({
                    where: { id },
                    data: { status: "APPROVED" }
                })
            ]);

            // Optional: Create activity log
            await prisma.activityLog.create({
                data: {
                    action: `CONTRACTOR_TO_COFOUNDER_SUCCESS: ${proposal.user.name} promoted to Co-Founder`,
                    projectId: "SYSTEM", // System level event
                    userId: session.user.id
                }
            });
        }

        return ApiResponse.success({
            message: "Approval recorded",
            consensusReached: allApproved
        });
    } catch (error) {
        console.error("Approve Proposal Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, [Role.FOUNDER, Role.CO_FOUNDER]);
