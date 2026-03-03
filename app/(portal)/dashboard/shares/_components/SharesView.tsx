"use client";

import { useState, useEffect, useMemo } from "react";
import {
    FileText,
    TrendingUp,
    Lock,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    UserPlus,
    Loader2,
    Shield
} from "lucide-react";
import ProposeCoFounderModal from "./ProposeCoFounderModal";

interface Share {
    id: string;
    userId: string;
    percentage: number;
    grantedAt: Date | string;
    lockedUntil: Date | string;
    note: string | null;
    user: { name: string; email: string; role: string };
}

interface Proposal {
    id: string;
    userId: string;
    targetShare: number;
    status: string;
    createdAt: Date | string;
    user: { name: string; email: string; createdAt: Date | string };
    proposer: { name: string };
    approvals: { userId: string; status: string; user: { name: string } }[];
}

interface Founder {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date | string;
}

export default function SharesView({
    initialData,
    currentUserId
}: {
    initialData: { shares: Share[], founders: Founder[], transitions: Proposal[] },
    currentUserId: string
}) {
    const [shares, setShares] = useState(initialData.shares);
    const [transitions, setTransitions] = useState(initialData.transitions);
    const [founders] = useState(initialData.founders);
    const [showProposeModal, setShowProposeModal] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const totalEquity = useMemo(() => shares.reduce((acc, s) => acc + s.percentage, 0), [shares]);

    async function fetchData() {
        setIsRefreshing(true);
        try {
            const res = await fetch("/api/admin/shares");
            if (res.ok) {
                const data = await res.json();
                setShares(data.shares);
                setTransitions(data.transitions);
            }
        } catch (err) {
            alert("Failed to fetch shares");
        } finally {
            setIsRefreshing(false);
        }
    }

    async function handleApprove(proposalId: string) {
        if (!confirm("Are you sure you want to approve this co-founder transition?")) return;
        try {
            const res = await fetch(`/api/admin/shares/proposals/${proposalId}/approve`, { method: "POST" });
            if (res.ok) {
                const data = await res.json();
                if (data.consensusReached) {
                    alert("Consensus reached! Member has been promoted to Co-Founder.");
                } else {
                    alert("Approval recorded. Waiting for others.");
                }
                fetchData();
            }
        } catch (err) {
            alert("Failed to approve proposal");
        }
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5">
                <div>
                    <h1 className="text-3xl font-display font-medium tracking-tight text-white mb-2">Equity & Ownership</h1>
                    <p className="text-gray-500 text-sm max-w-lg">Track company share distribution and manage the transition of key contributors to co-founder status via consensus.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowProposeModal(true)}
                        className="btn-brand rounded-2xl px-6 py-4 gap-2 text-sm font-bold"
                    >
                        <UserPlus className="w-4 h-4" />
                        Propose Co-Founder
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-3xl border-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-agency-accent/10 text-agency-accent">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Allocated</span>
                    </div>
                    <p className="text-4xl font-display font-bold text-white mb-1">{totalEquity}%</p>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-agency-accent" style={{ width: `${totalEquity}%` }} />
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                            <Shield className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stakeholders</span>
                    </div>
                    <p className="text-4xl font-display font-bold text-white mb-1">{shares.length}</p>
                    <p className="text-xs text-gray-500">Founders & Co-Founders</p>
                </div>

                <div className="glass-panel p-6 rounded-3xl border-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                            <Clock className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Proposals</span>
                    </div>
                    <p className="text-4xl font-display font-bold text-white mb-1">{transitions.length}</p>
                    <p className="text-xs text-gray-500">Pending consensus</p>
                </div>
            </div>

            {/* Active Transitions / Proposals */}
            {transitions.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                        <FileText className="w-4 h-4" />
                        Pending Co-Founder Transitions
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {transitions.map((proposal) => {
                            const hasApproved = proposal.approvals.some(a => a.userId === currentUserId);
                            const approvalCount = proposal.approvals.length;
                            const totalNeeded = founders.length;
                            const progress = (approvalCount / totalNeeded) * 100;

                            return (
                                <div key={proposal.id} className="glass-panel p-8 rounded-[2rem] border-white/5 flex flex-col md:flex-row gap-6 items-center">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl font-bold text-white">
                                                {proposal.user.name[0]}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white truncate">{proposal.user.name}</h3>
                                                <p className="text-xs text-gray-500">Proposed by {proposal.proposer.name} • Target Share: {proposal.targetShare}%</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center gap-4">
                                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-agency-accent transition-all duration-1000"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-mono text-agency-accent font-bold">
                                                {approvalCount}/{totalNeeded} Approvals
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 justify-center shrink-0">
                                        {founders.map(f => {
                                            const approved = proposal.approvals.some(a => a.userId === f.id);
                                            return (
                                                <div
                                                    key={f.id}
                                                    title={f.name}
                                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[8px] font-bold ${approved ? "bg-agency-accent/20 border-agency-accent text-agency-accent" : "bg-white/5 border-white/10 text-gray-500"
                                                        }`}
                                                >
                                                    {f.name.split(' ').map((n: any) => n[0]).join('')}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="shrink-0 w-full md:w-auto">
                                        {hasApproved ? (
                                            <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs font-bold flex items-center gap-2 justify-center w-full">
                                                <CheckCircle2 className="w-4 h-4 text-agency-accent" />
                                                Approved
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleApprove(proposal.id)}
                                                className="w-full bg-agency-accent text-white px-8 py-3 rounded-xl text-xs font-bold hover:brightness-110 shadow-[0_0_20px_rgba(255,51,102,0.2)]"
                                            >
                                                Approve Transition
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Stakeholders List */}
            <div className="space-y-4">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4" />
                    Share Distribution
                </h2>
                <div className="glass-panel overflow-hidden rounded-[2.5rem] border border-white/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01]">
                                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">Stakeholder</th>
                                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">Equity</th>
                                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">Lock-in Status</th>
                                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">Granted Date</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-bold uppercase tracking-widest text-gray-500">Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shares.map((share) => {
                                    const isLocked = new Date(share.lockedUntil) > new Date();
                                    return (
                                        <tr key={share.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-agency-accent/10 flex items-center justify-center text-xs font-bold text-agency-accent border border-agency-accent/20">
                                                        {share.user.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-sm">{share.user.name}</p>
                                                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 font-bold uppercase tracking-tighter border border-white/5">
                                                            {share.user.role}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-xl font-display font-bold text-white">{share.percentage}%</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                {isLocked ? (
                                                    <div className="flex items-center gap-2 text-yellow-500/80">
                                                        <Lock className="w-3.5 h-3.5" />
                                                        <span className="text-xs font-medium">Locked until {new Date(share.lockedUntil).toLocaleDateString()}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-agency-accent">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        <span className="text-xs font-medium">Unlocked</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-xs text-gray-500 font-mono">
                                                {new Date(share.grantedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <p className="text-xs text-gray-500 italic max-w-xs ml-auto truncate">{share.note || "No notes"}</p>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showProposeModal && (
                <ProposeCoFounderModal
                    onClose={() => setShowProposeModal(false)}
                    onSuccess={fetchData}
                />
            )}
        </div>
    );
}
