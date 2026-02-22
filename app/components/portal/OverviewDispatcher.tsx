import { Role } from "@prisma/client";
import { ExecutiveOverview } from "@/app/components/admin/ExecutiveOverview";
import { Suspense } from "react";
import { FolderKanban, TrendingUp, Clock, AlertCircle } from "lucide-react";

interface OverviewDispatcherProps {
    user: {
        id: string;
        email: string;
        role: Role;
        name: string;
    };
}

export default function OverviewDispatcher({ user }: OverviewDispatcherProps) {
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
    return (
        <div className="space-y-8">
            <div className="glass-panel p-10 rounded-[40px] border border-white/5 relative overflow-hidden text-center max-w-4xl mx-auto">
                <div className="absolute top-0 right-0 w-32 h-32 bg-agency-accent/5 blur-[60px] rounded-full" />
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-8">Your Projects</h2>
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-[30px]">
                        <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-500">You don't have any active projects linked to this account yet.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
