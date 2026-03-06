import { Role, Prisma, SplitType } from "@prisma/client";
import { ExecutiveOverview } from "./ExecutiveOverview";
import { Suspense } from "react";
import { FolderKanban, TrendingUp, Clock, AlertCircle, FileText, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ProfitData, ExpenseData } from "./DashboardCharts";
import { FounderDashboardCharts } from "./FounderDashboardCharts";

interface OverviewDispatcherProps {
    user: {
        id: string;
        email: string;
        role: Role;
        name: string;
    };
}

export default async function OverviewDispatcher({ user }: OverviewDispatcherProps) {
    if (user.role === Role.FOUNDER || user.role === Role.CO_FOUNDER) {
        
        // Fetch expense data for chart, assuming last 6 months 
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const expenses = await prisma.expense.groupBy({
            by: ['category'],
            _sum: { amountBDT: true },
            where: { date: { gte: sixMonthsAgo } }
        });

        const categoryColors = [
            "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"
        ];

        const expenseData: ExpenseData[] = expenses.map((exp, index) => ({
            category: exp.category || "Uncategorized",
            amount: exp._sum.amountBDT || 0,
            color: categoryColors[index % categoryColors.length]
        }));

        // Fetch company revenue (Sum of Payments)
        const payments = await prisma.payment.findMany({
            where: {
                status: "APPROVED",
                paidAt: { gte: sixMonthsAgo }
            },
            select: { amountBDT: true, amountUSD: true, paidAt: true },
            orderBy: { paidAt: 'asc' }
        });
        
        const revenueByMonth = payments.reduce((acc, entry) => {
            const date = entry.paidAt || new Date();
            const monthStr = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!acc[monthStr]) {
                acc[monthStr] = { month: monthStr, profit: 0 };
            }
            // For revenue, we sum the actual payment amounts (BDT + USD converted or separately, 
            // but for simplicity in this chart, we'll follow the existing pattern of showing BDT)
            acc[monthStr].profit += entry.amountBDT || 0;
            return acc;
        }, {} as Record<string, ProfitData>);
        
        const profitData = Object.values(revenueByMonth);


        return (
            <div className="space-y-8">
                <Suspense fallback={<div className="h-64 glass-panel animate-pulse rounded-2xl" />}>
                    <ExecutiveOverview />
                </Suspense>

                <FounderDashboardCharts expenseData={expenseData} profitData={profitData} />
            </div>
        );
    }

    if (user.role === Role.CONTRACTOR) {
        // Find assigned projects
        const assignedProjectMembers = await prisma.projectMember.findMany({
            where: { userId: user.id },
            include: { project: true }
        });

        const bgColors = ["bg-blue-500/10", "bg-emerald-500/10", "bg-purple-500/10", "bg-amber-500/10"];
        const textColors = ["text-blue-500", "text-emerald-500", "text-purple-500", "text-amber-500"];

        // Get actual earnings
        const ledgerBalance = await prisma.ledgerBalance.findUnique({
            where: { userId: user.id }
        });

        const totalEarnedBDT = ledgerBalance?.totalBDT || 0;
        const totalEarnedUSD = ledgerBalance?.totalUSD || 0;

        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col justify-between min-h-[200px]">
                    <div>
                        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-4">Total Earnings (BDT)</span>
                        <div className="flex items-center justify-between">
                            <span className="text-4xl font-bold text-white">৳{totalEarnedBDT.toLocaleString()}</span>
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    {totalEarnedUSD > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-gray-500 text-xs font-semibold">USD Earnings</span>
                            <span className="text-sm font-bold text-white">${totalEarnedUSD.toLocaleString()}</span>
                        </div>
                    )}
                </div>

                <div className="glass-panel p-8 rounded-3xl border border-white/5 md:col-span-2">
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-6">Assigned Projects</span>
                    
                    {assignedProjectMembers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {assignedProjectMembers.map((member, i) => (
                                <Link
                                    key={member.projectId}
                                    href={`/dashboard/projects/${member.projectId}`}
                                    className="p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group flex items-start gap-4"
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColors[i % bgColors.length]} ${textColors[i % textColors.length]}`}>
                                        <FolderKanban className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white group-hover:text-agency-accent transition-colors truncate mb-1">
                                            {member.project.title}
                                        </h4>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-gray-400 font-medium px-2 py-0.5 rounded-full bg-white/5">
                                                {member.project.status}
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                Role: {member.role}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center">
                            <FolderKanban className="w-10 h-10 text-gray-600 mb-3" />
                            <p className="text-gray-400 text-sm">No active project assignments found.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // CLIENT
    const proposals = await prisma.proposal.findMany({
        where: {
            booking: {
                clientEmail: user.email
            },
            status: { in: ["SENT", "DRAFT"] } 
        },
        include: {
            booking: { include: { service: true } }
        }
    });

    const activeProjects = await prisma.project.findMany({
        where: {
            booking: {
                clientEmail: user.email
            },
            status: "ACTIVE"
        }
    });

    return (
        <div className="space-y-8">
            {/* Pending Proposals Section */}
            {proposals.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <div className="w-2 h-2 rounded-full bg-agency-accent animate-pulse" />
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Proposals Awaiting Your Review</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {proposals.map(p => (
                            <Link
                                key={p.id}
                                href={`/proposal/view/${p.viewToken}`}
                                className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-agency-accent/30 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-agency-accent transition-colors">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-agency-accent/10 text-agency-accent border border-agency-accent/20">
                                        Pending Review
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-agency-accent transition-colors">
                                    {p.booking?.service?.title || "Consultation Project"}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-6">
                                    {p.scopeSummary}
                                </p>
                                <div className="flex items-center justify-between text-xs pt-4 border-t border-white/5">
                                    <span className="text-gray-400 font-medium">
                                        {p.currency === "USD" ? "$" : "৳"}{(p.budgetUSD || p.budgetBDT || 0).toLocaleString()}
                                    </span>
                                    <div className="flex items-center gap-1 text-agency-accent font-bold uppercase tracking-tighter">
                                        Review & Sign <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Projects Section */}
            <div className="glass-panel p-10 rounded-[40px] border border-white/5 relative overflow-hidden text-center max-w-4xl mx-auto">
                <div className="absolute top-0 right-0 w-32 h-32 bg-agency-accent/5 blur-[60px] rounded-full" />
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-8">Your Active Projects</h2>
                    {activeProjects.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {activeProjects.map(project => (
                                <Link
                                    key={project.id}
                                    href={`/project/${project.viewToken}`}
                                    className="p-6 rounded-2xl border border-white/5 hover:bg-white/5 transition-all text-left flex items-center justify-between"
                                >
                                    <div>
                                        <h4 className="font-bold text-white">{project.title}</h4>
                                        <p className="text-xs text-gray-500">Status: {project.status}</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-600" />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border border-dashed border-white/10 rounded-[30px]">
                            <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-500">You don't have any active projects linked to this account yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
