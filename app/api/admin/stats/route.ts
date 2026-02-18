import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role, ProjectStatus, BookingStatus, SplitType } from "@prisma/client";

export const GET = withAuth(async () => {
    try {
        const [
            revenue,
            activeProjects,
            pendingBookings,
            companyFunds
        ] = await Promise.all([
            // Total Revenue
            prisma.payment.aggregate({
                _sum: {
                    amountBDT: true,
                    amountUSD: true,
                }
            }),
            // Active Projects
            prisma.project.count({
                where: { status: ProjectStatus.ACTIVE }
            }),
            // Pending Bookings
            prisma.booking.count({
                where: { status: BookingStatus.PENDING }
            }),
            // Company Fund (Sum of LedgerEntry with type COMPANY_FUND)
            prisma.ledgerEntry.aggregate({
                where: { type: SplitType.COMPANY_FUND },
                _sum: {
                    amountBDT: true,
                    amountUSD: true,
                }
            })
        ]);

        return ApiResponse.success({
            revenue: {
                bdt: revenue._sum.amountBDT || 0,
            },
            activeProjects,
            pendingBookings,
            companyFund: {
                bdt: companyFunds._sum.amountBDT || 0,
            },
        });
    } catch (error) {
        console.error("Stats API Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);
