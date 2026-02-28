import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";

export const GET = withAuth(async (req, context, session) => {
    try {
        const [shares, founders, transitions] = await Promise.all([
            prisma.companyShare.findMany({
                include: { user: { select: { name: true, email: true, role: true } } },
                orderBy: { percentage: "desc" }
            }),
            prisma.user.findMany({
                where: { role: { in: [Role.FOUNDER, Role.CO_FOUNDER] } },
                select: { id: true, name: true, email: true, role: true, createdAt: true }
            }),
            prisma.coFounderProposal.findMany({
                where: { status: { in: ["DRAFT", "SENT"] } },
                include: {
                    user: { select: { name: true, email: true } },
                    approvals: true
                }
            })
        ]);

        return ApiResponse.success({ shares, founders, transitions });
    } catch (error) {
        console.error("GET Shares Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, [Role.FOUNDER, Role.CO_FOUNDER]);

export const POST = withAuth(async (req, context, session) => {
    try {
        const body = await req.json();
        const { userId, percentage, note, lockedUntil } = body;

        if (!userId || percentage === undefined) {
            return ApiResponse.error("User ID and percentage are required");
        }

        const lockDate = lockedUntil ? new Date(lockedUntil) : new Date(Date.now() + 730 * 24 * 60 * 60 * 1000); // 2 years default

        const share = await prisma.companyShare.create({
            data: {
                userId,
                percentage: parseFloat(percentage),
                note,
                lockedUntil: lockDate
            },
            include: { user: { select: { name: true, email: true } } }
        });

        return ApiResponse.success({ message: "Share granted successfully", share });
    } catch (error) {
        console.error("POST Shares Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, [Role.FOUNDER, Role.CO_FOUNDER]);
