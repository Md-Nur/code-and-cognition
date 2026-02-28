import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";

export const GET = withAuth(async (req, context, session) => {
    try {
        const userId = session.user.id;

        const balance = await prisma.ledgerBalance.findUnique({
            where: { userId },
        });

        const transactions = await prisma.ledgerEntry.findMany({
            where: { userId },
            include: {
                payment: {
                    include: {
                        project: true,
                    },
                },
                withdrawal: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return ApiResponse.success({
            balance: balance || { totalBDT: 0, totalUSD: 0 },
            transactions,
        });
    } catch (error) {
        console.error("[WALLET_GET]", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, [Role.FOUNDER, Role.CO_FOUNDER, Role.CONTRACTOR]);
