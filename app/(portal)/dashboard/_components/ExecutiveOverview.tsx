import { prisma } from "@/lib/prisma";
import { SplitType } from "@prisma/client";
import { DashboardCard } from "./DashboardCard";
import {
    DollarSign,
    Briefcase,
    AlertTriangle,
    Clock,
    Wallet,
    TrendingUp,
} from "lucide-react";

export async function ExecutiveOverview() {
    const [
        companyFundEntries,
        expenses,
        activeProjects,
        pendingApprovals,
        bookings,
    ] = await Promise.all([
        prisma.ledgerEntry.aggregate({
            where: { type: SplitType.COMPANY_FUND },
            _sum: { amountBDT: true, amountUSD: true },
        }),
        prisma.expense.aggregate({
            _sum: { amountBDT: true, amountUSD: true },
        }),
        prisma.project.count({
            where: { status: "ACTIVE" },
        }),
        prisma.changeRequest.count({
            where: { status: "PENDING" },
        }),
        prisma.booking.findMany({
            select: {
                status: true,
                createdAt: true,
                budgetUSD: true,
                budgetBDT: true,
            }
        }),
    ]);

    const totalProfitBDT = companyFundEntries._sum.amountBDT || 0;
    const totalProfitUSD = companyFundEntries._sum.amountUSD || 0;

    const totalExpenseBDT = expenses._sum.amountBDT || 0;
    const totalExpenseUSD = expenses._sum.amountUSD || 0;

    const companyFundBDT = totalProfitBDT - totalExpenseBDT;
    const companyFundUSD = totalProfitUSD - totalExpenseUSD;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <DashboardCard
                title="Project Shares (BDT)"
                value={`৳${totalProfitBDT.toLocaleString()}`}
                icon={<TrendingUp className="w-5 h-5" />}
                colorClass="text-green-400"
            />
            <DashboardCard
                title="Project Shares (USD)"
                value={`$${totalProfitUSD.toLocaleString()}`}
                icon={<TrendingUp className="w-5 h-5" />}
                colorClass="text-green-400"
            />

            <DashboardCard
                title="Company Fund (BDT)"
                value={`৳${companyFundBDT.toLocaleString()}`}
                icon={<Wallet className="w-5 h-5" />}
                colorClass="text-purple-400"
            />
            <DashboardCard
                title="Company Fund (USD)"
                value={`$${companyFundUSD.toLocaleString()}`}
                icon={<Wallet className="w-5 h-5" />}
                colorClass="text-purple-400"
            />

            <DashboardCard
                title="Total Expense (BDT)"
                value={`৳${totalExpenseBDT.toLocaleString()}`}
                icon={<TrendingUp className="w-5 h-5" />}
                colorClass="text-red-400"
            />
            <DashboardCard
                title="Total Expense (USD)"
                value={`$${totalExpenseUSD.toLocaleString()}`}
                icon={<TrendingUp className="w-5 h-5" />}
                colorClass="text-red-400"
            />

            <DashboardCard
                title="Active Projects"
                value={activeProjects}
                icon={<Briefcase className="w-5 h-5" />}
                colorClass="text-blue-400"
            />

            <DashboardCard
                title="Pending Approvals"
                value={pendingApprovals}
                icon={<Clock className="w-5 h-5" />}
                colorClass={pendingApprovals > 0 ? "text-yellow-400" : "text-gray-400"}
            />
        </div>
    );
}
