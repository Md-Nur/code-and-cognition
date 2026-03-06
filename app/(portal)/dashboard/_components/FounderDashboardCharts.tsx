"use client";

import dynamic from "next/dynamic";
import { ChartPie, DollarSign } from "lucide-react";
import { ExpenseData, ProfitData } from "./DashboardCharts";

const ExpenseAnalyticsChart = dynamic(
    () => import("./DashboardCharts").then((mod) => mod.ExpenseAnalyticsChart),
    { ssr: false, loading: () => <div className="h-[250px] w-full animate-pulse bg-white/5 rounded-2xl" /> }
);

const CompanyProfitChart = dynamic(
    () => import("./DashboardCharts").then((mod) => mod.CompanyProfitChart),
    { ssr: false, loading: () => <div className="h-[250px] w-full animate-pulse bg-white/5 rounded-2xl" /> }
);

interface FounderDashboardChartsProps {
    expenseData: ExpenseData[];
    profitData: ProfitData[];
}

export function FounderDashboardCharts({ expenseData, profitData }: FounderDashboardChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col min-h-[300px]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/5 flex items-center justify-center text-cyan-500">
                        <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">Company Revenue</h3>
                        <p className="text-gray-500 text-xs">Total payments received over the last 6 months</p>
                    </div>
                </div>
                <CompanyProfitChart data={profitData} />
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col min-h-[300px]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center text-orange-500">
                        <ChartPie className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">Expense Analytics</h3>
                        <p className="text-gray-500 text-xs">Expense breakdown by category over last 6 months</p>
                    </div>
                </div>
                <ExpenseAnalyticsChart data={expenseData} />
            </div>
        </div>
    );
}
