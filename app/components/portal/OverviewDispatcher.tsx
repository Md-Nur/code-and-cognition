import { Role, Prisma } from "@prisma/client";
import { ExecutiveOverview } from "@/app/components/admin/ExecutiveOverview";
import { Suspense } from "react";
import { FolderKanban, TrendingUp, Clock, AlertCircle, FileText, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface OverviewDispatcherProps {
    user: {
        id: string;
        email: string;
        role: Role;
        name: string;
    };
}

export default async function OverviewDispatcher({ user }: OverviewDispatcherProps) {
    if (user.role === Role.FOUNDER) {
        return (
            <div className="space-y-8">
                <Suspense fallback={<div className="h-64 glass-panel animate-pulse rounded-2xl" />}>
                    <ExecutiveOverview />
                </Suspense>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center min-h-[300px] text-center">
                        <div className="w-16 h-16 rounded-2xl bg-agency-accent/5 flex items-center justify-center text-agency-accent mb-6">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <h3 className="text-white font-bold mb-2">Revenue Analytics</h3>
                        <p className="text-gray-500 text-sm max-w-xs">Financial performance and projections across all projects.</p>
                    </div>
                    <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center min-h-[300px] text-center">
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/5 flex items-center justify-center text-blue-500 mb-6">
                            <FolderKanban className="w-8 h-8" />
                        </div>
                        <h3 className="text-white font-bold mb-2">Project Velocity</h3>
                        <p className="text-gray-500 text-sm max-w-xs">Tracking milestone completion and delivery efficiency.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (user.role === Role.CONTRACTOR) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-panel p-8 rounded-3xl border border-white/5">
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-4">Earnings</span>
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold">$0.00</span>
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                </div>
                <div className="glass-panel p-8 rounded-3xl border border-white/5 md:col-span-2">
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-6">Assigned Projects</span>
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-gray-500 text-sm">No active project assignments found.</p>
                    </div>
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
            status: { in: ["SENT", "DRAFT"] } // Show only pending ones to client (wait, DRAFT should be hidden from client? Let's check logic)
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
                                href={`/dashboard/proposals/${p.id}`}
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
                                    href={`/dashboard/projects/${project.id}`}
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
