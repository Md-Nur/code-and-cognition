"use client";

import { useState } from "react";
import { Proposal, Booking, Service } from "@prisma/client";
import { FileText, CheckCircle2, DollarSign, Clock, ArrowRight } from "lucide-react";
import { approveProposal } from "@/app/actions/proposals";
import { useRouter } from "next/navigation";

interface ProposalReviewProps {
    proposal: Proposal & {
        booking: (Booking & { service: Service | null }) | null;
    };
}

export default function ProposalReview({ proposal }: ProposalReviewProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSignAndPay = async () => {
        if (!confirm("By clicking 'Sign & Start Project', you agree to the terms and payment conditions outlined in this proposal. Project will officially start immediately.")) return;

        setLoading(true);
        try {
            const res = await approveProposal({ proposalId: proposal.id });
            if (res.ok) {
                router.push(`/dashboard/projects/${res.project?.id}`);
                router.refresh();
            } else {
                alert(`Error: ${res.error || "Failed to approve proposal"}`);
            }
        } catch (error) {
            alert("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (proposal.status === "APPROVED") {
        return (
            <div className="glass-panel p-12 rounded-[40px] text-center max-w-2xl mx-auto border border-emerald-500/20 bg-emerald-500/5">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Proposal Approved!</h2>
                <p className="text-gray-400 mb-8 text-balance">This proposal has been signed and the project is now officially active. You can track progress in your project workspace.</p>
                <button
                    onClick={() => router.push(`/dashboard/projects/${proposal.projectId}`)}
                    className="btn-brand px-8"
                >
                    Go to Project Workspace
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-display font-medium text-white tracking-tight">Review Proposal</h1>
                    <p className="text-gray-500 text-sm mt-1">Proposal #{proposal.id.slice(-6).toUpperCase()} for {proposal.booking?.clientName}</p>
                </div>
                {proposal.status === "SENT" && (
                    <button
                        onClick={handleSignAndPay}
                        disabled={loading}
                        className="btn-brand px-8 py-4 text-base font-bold flex items-center gap-3 shadow-[0_0_40px_-10px_rgba(var(--brand-rgb),0.5)] active:scale-95 transition-all"
                    >
                        {loading ? "Processing..." : (
                            <>
                                Sign & Start Project <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Scope Card */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-agency-accent mb-4">Project Scope</h3>
                            <div className="text-white text-lg leading-relaxed whitespace-pre-wrap">
                                {proposal.scopeSummary}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Deliverables</h4>
                                <ul className="space-y-3">
                                    {proposal.deliverables.map((d, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-agency-accent mt-1.5 shrink-0" />
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Timeline Milestones</h4>
                                <ul className="space-y-3">
                                    {proposal.milestones.map((m, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-medium">
                                            <span className="text-agency-accent font-mono text-xs w-4">{i + 1}.</span>
                                            {m}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Contract Box */}
                    {proposal.contractText && (
                        <div className="glass-panel p-8 rounded-3xl border border-white/5">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Agreement & Terms</h3>
                            <div className="bg-black/40 rounded-2xl p-6 text-xs text-gray-400 font-mono leading-loose h-64 overflow-y-auto whitespace-pre-wrap border border-white/5">
                                {proposal.contractText}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Investment Card */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-agency-accent/5 blur-3xl rounded-full" />
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6">Strategic Investment</h3>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-4xl font-display font-medium text-white">
                                {proposal.currency === "USD" ? "$" : "৳"}
                                {(proposal.budgetUSD || proposal.budgetBDT || 0).toLocaleString()}
                            </span>
                            <span className="text-gray-500 text-sm font-medium">{proposal.currency}</span>
                        </div>
                        <p className="text-xs text-gray-500">Fixed-price engagement model</p>

                        <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Clock className="w-4 h-4 text-agency-accent" />
                                <span className="text-gray-300">{proposal.estimatedDays} Days Estimated</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <DollarSign className="w-4 h-4 text-agency-accent mt-0.5" />
                                <span className="text-gray-300">{proposal.paymentTerms || "See contract for details"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-agency-accent/5">
                        <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                            <span className="text-agency-accent font-bold uppercase block mb-1">Nex-Step</span>
                            Once signed, our internal team is assigned immediately and your project workspace is initialized.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
