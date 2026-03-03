"use client";

import { useState } from "react";
import { Proposal, Booking, Service } from "@prisma/client";
import { CheckCircle2, DollarSign, Clock, ArrowRight, ShieldCheck, AlertTriangle, X } from "lucide-react";
import { approveProposalByToken } from "@/app/actions/proposals";
import { useRouter } from "next/navigation";

interface PublicProposalReviewProps {
    proposal: Proposal & {
        booking: (Booking & { service: Service | null }) | null;
    };
}

// --- Custom Modal Component ---
interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
    loading?: boolean;
}

function ConfirmModal({ isOpen, onClose, onConfirm, title, children, loading }: ConfirmModalProps) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Modal Panel */}
            <div className="relative w-full max-w-md glass-panel rounded-[28px] border border-white/10 p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors"
                    disabled={loading}
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-agency-accent/10 border border-agency-accent/20 flex items-center justify-center mb-6">
                    <AlertTriangle className="w-7 h-7 text-agency-accent" />
                </div>

                <h2 className="text-xl font-display font-semibold text-white mb-3">{title}</h2>
                <div className="text-sm text-gray-400 leading-relaxed mb-8">{children}</div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-5 py-3 rounded-xl border border-white/10 text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 btn-brand px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>Sign &amp; Start Project <ArrowRight className="w-4 h-4" /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Error Modal Component ---
interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
}

function ErrorModal({ isOpen, onClose, message }: ErrorModalProps) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm glass-panel rounded-[28px] border border-red-500/20 p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                <button onClick={onClose} className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-lg font-display font-semibold text-white mb-2">Something went wrong</h2>
                <p className="text-sm text-gray-400 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full px-5 py-3 rounded-xl border border-white/10 text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                >
                    Close
                </button>
            </div>
        </div>
    );
}


export default function PublicProposalReview({ proposal }: PublicProposalReviewProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
        if (!proposal.viewToken) return;
        
        // Close the confirm modal and start processing
        setShowConfirmModal(false);
        setLoading(true);
        try {
            const res = await approveProposalByToken(proposal.viewToken, email);
            if (res.ok) {
                setVerified(false); // Reset to show success state via proposal.status
                router.refresh();
            } else {
                setErrorMessage((res as { ok: false; error: string }).error || "Failed to approve proposal");
                setShowErrorModal(true);
            }
        } catch (err) {
            setErrorMessage("An unexpected error occurred. Please try again.");
            setShowErrorModal(true);
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
        <>
            {/* Custom Confirmation Modal */}
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleSignAndPay}
                title="Authorize & Start Project"
                loading={loading}
            >
                By clicking <strong className="text-white">&ldquo;Sign &amp; Start Project&rdquo;</strong>, you confirm that you agree to the terms and payment conditions outlined in this proposal. The project will officially start immediately upon authorization.
            </ConfirmModal>

            {/* Error Modal */}
            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                message={errorMessage}
            />

            <div className="space-y-8 max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-display font-medium text-white tracking-tight">Proposal for {proposal.booking?.clientName}</h1>
                        <p className="text-gray-500 text-sm mt-1">Strategic Partnership Overview • Code &amp; Cognition</p>
                    </div>
                    {proposal.status === "SENT" && (
                        <button
                            onClick={() => setShowConfirmModal(true)}
                            disabled={loading}
                            className="btn-brand px-8 py-4 text-base font-bold flex items-center gap-3 shadow-[0_0_40px_-10px_rgba(var(--brand-rgb),0.5)] active:scale-95 transition-all disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Sign &amp; Start Project <ArrowRight className="w-5 h-5" />
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
        </>
    );
}
