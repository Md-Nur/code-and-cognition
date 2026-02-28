import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role, ProposalStatus } from "@prisma/client";

export const GET = withAuth(async (req, context, session) => {
    try {
        const proposals = await prisma.coFounderProposal.findMany({
            include: {
                user: { select: { name: true, email: true, createdAt: true } },
                proposer: { select: { name: true } },
                approvals: { include: { user: { select: { name: true } } } }
            },
            orderBy: { createdAt: "desc" }
        });

        return ApiResponse.success(proposals);
    } catch (error) {
        console.error("GET Proposals Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, [Role.FOUNDER, Role.CO_FOUNDER]);

export const POST = withAuth(async (req, context, session) => {
    try {
        const body = await req.json();
        const { userId, targetShare } = body;

        if (!userId || targetShare === undefined) {
            return ApiResponse.error("User ID and target share are required");
        }

        // 1. Check if user exists and is a contractor
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) return ApiResponse.notFound("User");
        if (user.role !== Role.CONTRACTOR) return ApiResponse.error("Only contractors can be proposed as co-founders");

        // 2. Check 3-month requirement
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        if (user.createdAt > threeMonthsAgo) {
            return ApiResponse.error("Contractors must be with the company for at least 3 months before being proposed as co-founders");
        }

        // 3. Create proposal
        const proposal = await prisma.coFounderProposal.create({
            data: {
                proposerId: session.user.id,
                userId,
                targetShare: parseFloat(targetShare),
                status: "SENT" // Skip DRAFT for now to trigger voting
            },
            include: { user: { select: { name: true } } }
        });

        return ApiResponse.success({ message: "Co-founder proposal created successfully", proposal });
    } catch (error) {
        console.error("POST Proposal Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, [Role.FOUNDER, Role.CO_FOUNDER]);
