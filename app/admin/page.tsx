"use client";

import { useEffect, useState } from "react";

type DashboardStats = {
    revenue: { bdt: number; usd: number };
    activeProjects: number;
    pendingBookings: number;
    companyFund: { bdt: number; usd: number };
    expenses: { bdt: number; usd: number };
    netProfit: { bdt: number; usd: number };
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/admin/stats");
                if (res.ok) {
                    setStats(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const statCards = [
        {
            label: "Total Revenue",
            value: `৳${stats?.revenue.bdt.toLocaleString() || 0}`,
            color: "text-green-400"
        },
        {
            label: "Total Expenses",
            value: `৳${stats?.expenses.bdt.toLocaleString() || 0}`,
            color: "text-red-400"
        },
        {
            label: "Net Profit",
            value: `৳${stats?.netProfit.bdt.toLocaleString() || 0}`,
            color: "text-cyan-400"
        },
        {
            label: "Company Fund",
            value: `৳${stats?.companyFund.bdt.toLocaleString() || 0}`,
            color: "text-purple-400"
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-400 mt-2">Welcome back, Founder.</p>
                </div>
                <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="glass-panel p-6 rounded-xl animate-pulse">
                            <div className="h-4 w-24 bg-white/5 rounded mb-4" />
                            <div className="h-8 w-32 bg-white/10 rounded" />
                        </div>
                    ))
                ) : statCards.map((stat, i) => (
                    <div key={i} className="glass-panel p-6 rounded-xl hover:border-white/20 transition-colors">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">{stat.label}</h3>
                        <div className="flex items-end justify-between">
                            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-xl min-h-[300px] flex items-center justify-center border-dashed border-2 border-white/10">
                    <p className="text-gray-500">Revenue Analytics Chart (Coming Soon)</p>
                </div>
                <div className="glass-panel p-6 rounded-xl min-h-[300px] flex items-center justify-center border-dashed border-2 border-white/10">
                    <p className="text-gray-500">Project Distribution Chart (Coming Soon)</p>
                </div>
            </div>
        </div>
    );
}
