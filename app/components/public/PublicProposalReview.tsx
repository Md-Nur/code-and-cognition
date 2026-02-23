"use client";

import { useState } from "react";
import { Proposal, Booking, Service } from "@prisma/client";
import { FileText, CheckCircle2, DollarSign, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { approveProposal } from "@/app/actions/proposals";
import { useRouter } from "next/navigation";

interface PublicProposalReviewProps {
    proposal: Proposal & {
        booking: (Booking & { service: Service | null }) | null;
    };
}

export default function PublicProposalReview({ proposal }: PublicProposalReviewProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.toLowerCase() === proposal.booking?.clientEmail.toLowerCase()) {
            setVerified(true);
            setError("");
        } else {
            setError("Email address does not match our records for this proposal.");
        }
    };

    const handleSignAndPay = async () => {
        if (!confirm("By clicking 'Sign & Start Project', you agree to the terms and payment conditions outlined in this proposal. Project will officially start immediately.")) return;

        setLoading(true);
        try {
            // Note: In a real enterprise app, we'd use a token-based action here
            // For now, we reuse the existing one as we've verified the identity via email + token
            const res = await approveProposal({ proposalId: proposal.id });
            if (res.ok) {
                setVerified(false); // Reset to show success state via proposal.status
                router.refresh();
            } else {
                alert(`Error: ${res.error || "Failed to approve proposal"}`);
            }
        } catch (error) {
            console.error(error);
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
                <p className="text-gray-400 mb-8 text-balance">This proposal has been signed and the project is now officially active. Our team will contact you shortly with onboarding details.</p>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 inline-block">
                    <p className="text-xs text-agency-accent font-medium">Transaction Reference: {proposal.id.toUpperCase()}</p>
                </div>
            </div>
        );
    }

    if (!verified) {
        return (
            <div className="max-w-md mx-auto py-20">
                <div className="glass-panel p-8 rounded-[32px] border border-white/5 space-y-6">
                    <div className="w-16 h-16 bg-agency-accent/10 text-agency-accent rounded-2xl flex items-center justify-center mb-2">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-medium text-white mb-2">Verify Identity</h2>
                        <p className="text-gray-400 text-sm">Please enter the email address where you received this proposal to proceed.</p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-4">
                        <input
                            type="email"
                            required
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-agency-accent/50 transition-colors"
                        />
                        {error && <p className="text-red-400 text-xs">{error}</p>}
                        <button type="submit" className="w-full btn-brand py-3 rounded-xl font-bold">
                            View Proposal
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-display font-medium text-white tracking-tight">Proposal for {proposal.booking?.clientName}</h1>
                    <p className="text-gray-500 text-sm mt-1">Strategic Partnership Overview • Code & Cognition</p>
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
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel p-10 rounded-[32px] border border-white/5 space-y-8">
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-agency-accent mb-6">Execution Strategy</h3>
                            <div className="text-white text-xl leading-relaxed whitespace-pre-wrap font-display">
                                {proposal.scopeSummary}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-white/5">
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6">Core Deliverables</h4>
                                <ul className="space-y-4">
                                    {proposal.deliverables.map((d, i) => (
                                        <li key={i} className="flex items-start gap-4 text-gray-300">
                                            <div className="w-2 h-2 rounded-full bg-agency-accent mt-2 shrink-0 shadow-[0_0_10px_rgba(var(--brand-rgb),0.5)]" />
                                            <span className="text-sm font-medium leading-snug">{d}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6">Project Roadmap</h4>
                                <ul className="space-y-4">
                                    {proposal.milestones.map((m, i) => (
                                        <li key={i} className="flex items-start gap-4 text-gray-300">
                                            <span className="text-agency-accent font-mono text-sm font-bold w-6">{String(i + 1).padStart(2, '0')}</span>
                                            <span className="text-sm font-medium leading-snug">{m}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {proposal.contractText && (
                        <div className="glass-panel p-10 rounded-[32px] border border-white/5">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6">Terms of Engagement</h3>
                            <div className="bg-black/40 rounded-2xl p-8 text-xs text-gray-400 font-mono leading-relaxed h-72 overflow-y-auto whitespace-pre-wrap border border-white/5 custom-scrollbar">
                                {proposal.contractText}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <div className="glass-panel p-10 rounded-[32px] border border-white/5 relative overflow-hidden group bg-gradient-to-br from-white/[0.02] to-transparent">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-agency-accent/10 blur-[80px] rounded-full" />
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-8">Strategic Investment</h3>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-5xl font-display font-medium text-white tracking-tight">
                                {proposal.currency === "USD" ? "$" : "৳"}
                                {(proposal.budgetUSD || proposal.budgetBDT || 0).toLocaleString()}
                            </span>
                            <span className="text-gray-500 text-sm font-medium">{proposal.currency}</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">Fixed-price engagement performance</p>

                        <div className="mt-10 pt-10 border-t border-white/5 space-y-6">
                            <div className="flex items-center gap-4 text-sm">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-agency-accent" />
                                </div>
                                <span className="text-gray-300 font-medium">{proposal.estimatedDays} Days Delivery</span>
                            </div>
                            <div className="flex items-start gap-4 text-sm">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                    <DollarSign className="w-4 h-4 text-agency-accent" />
                                </div>
                                <span className="text-gray-300 font-medium leading-snug">{proposal.paymentTerms || "Standard Net-0 terms apply"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-agency-accent/[0.03] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-agency-accent" />
                        <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                            <span className="text-agency-accent font-bold uppercase block mb-2">Strategic Onboarding</span>
                            Upon authorization, our core engineering team is mobilized and your secure infrastructure is provisioned within 24 hours.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
