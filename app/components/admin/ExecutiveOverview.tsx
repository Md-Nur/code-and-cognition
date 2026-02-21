import { prisma } from "@/lib/prisma";
import { DashboardCard } from "./DashboardCard";
import {
    DollarSign,
    Briefcase,
    AlertTriangle,
    Clock,
    Wallet,
} from "lucide-react";

export async function ExecutiveOverview() {
    const [
        payments,
        companyFundEntries,
        activeProjects,
        projectsAtRisk,
        pendingApprovals,
    ] = await Promise.all([
        prisma.payment.aggregate({
            _sum: { amountBDT: true, amountUSD: true },
        }),
        prisma.ledgerEntry.aggregate({
            where: { type: "COMPANY_FUND" },
            _sum: { amountBDT: true, amountUSD: true },
        }),
        prisma.project.count({
            where: { status: "ACTIVE" },
        }),
        prisma.project.count({
            where: { status: "ACTIVE", health: { in: ["YELLOW", "RED"] } },
        }),
        prisma.changeRequest.count({
            where: { status: "PENDING" },
        }),
    ]);

    const totalRevenueBDT = payments._sum.amountBDT || 0;
    const totalRevenueUSD = payments._sum.amountUSD || 0;

    const companyFundBDT = companyFundEntries._sum.amountBDT || 0;
    /* By requirement USD is also shown, but client focuses on both.
       We will show both Company Fund BDT and USD inline or separated.
       The user requested: "Total Revenue (BDT + USD separately)", "Active Projects count",
       "Projects At Risk (status = YELLOW or RED)", "Pending Client Approvals", "Company Fund Balance"
    */

    // Wait, let's also aggregate expenses if want to show Net Profit? 
    // User explicitly asked for: 
    // - Total Revenue (BDT + USD separately) 
    // - Active Projects count 
    // - Projects At Risk (status = YELLOW or RED) 
    // - Pending Client Approvals 
    // - Company Fund Balance 

    const companyFundUSD = companyFundEntries._sum.amountUSD || 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <DashboardCard
                title="Revenue (BDT)"
                value={`৳${totalRevenueBDT.toLocaleString()}`}
                icon={<DollarSign className="w-5 h-5" />}
                colorClass="text-green-400"
            />
            <DashboardCard
                title="Revenue (USD)"
                value={`$${totalRevenueUSD.toLocaleString()}`}
                icon={<DollarSign className="w-5 h-5" />}
                colorClass="text-green-400"
            />

            <DashboardCard
                title="Active Projects"
                value={activeProjects}
                icon={<Briefcase className="w-5 h-5" />}
                colorClass="text-blue-400"
            />

            <DashboardCard
                title="Projects At Risk"
                value={projectsAtRisk}
                icon={<AlertTriangle className="w-5 h-5" />}
                colorClass={projectsAtRisk > 0 ? "text-red-400" : "text-green-400"}
            />

            <DashboardCard
                title="Pending Approvals"
                value={pendingApprovals}
                icon={<Clock className="w-5 h-5" />}
                colorClass={pendingApprovals > 0 ? "text-yellow-400" : "text-gray-400"}
            />

            <DashboardCard
                title="Company Fund"
                value={`৳${companyFundBDT.toLocaleString()} / $${companyFundUSD.toLocaleString()}`}
                icon={<Wallet className="w-5 h-5" />}
                colorClass="text-purple-400"
            />
        </div>
    );
}
