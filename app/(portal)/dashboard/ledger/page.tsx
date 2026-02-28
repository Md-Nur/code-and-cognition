"use client";

import { useEffect, useState } from "react";
import { LedgerEntry, LedgerBalance, User, Role, Expense, Withdrawal } from "@prisma/client";
import {
    CircleDollarSign, Wallet, X, CheckCircle2, LayoutDashboard,
    UserCircle, PlusCircle, ArrowUpRight, ArrowDownRight,
    Clock, Check, XCircle
} from "lucide-react";
import WalletView from "@/app/components/dashboard/WalletView";

type LedgerData = {
    companyFundEntries: (LedgerEntry & { payment: { project: { title: string } } })[];
    approvedExpenses: Expense[];
    userBalances: (LedgerBalance & { user: User })[];
    pendingWithdrawals: (Withdrawal & { user: User })[];
};

export default function LedgerPage() {
    const [data, setData] = useState<LedgerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [payoutAmount, setPayoutAmount] = useState("");
    const [currency, setCurrency] = useState<"BDT" | "USD">("BDT");
    const [activeTab, setActiveTab] = useState<"admin" | "personal">("personal");
    const [processingId, setProcessingId] = useState<string | null>(null);

    const [session, setSession] = useState<any>(null);

    async function fetchData() {
        const res = await fetch("/api/admin/ledger");
        if (res.ok) setData(await res.json());
        setLoading(false);
    }

    useEffect(() => {
        async function getSession() {
            const res = await fetch("/api/auth/profile");
            if (res.ok) {
                const s = await res.json();
                if (s.user.role === "CLIENT") {
                    window.location.href = "/dashboard";
                }
                setSession(s);
                // Default to admin tab for privileged roles
                const privileged = [Role.FOUNDER, Role.CO_FOUNDER, Role.CASHIER].includes(s.user.role);
                if (privileged) {
                    setActiveTab("admin");
                }
            }
        }
        getSession();
        fetchData();
    }, []);

    async function handleWithdrawAction(id: string, action: 'approve' | 'reject') {
        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/withdrawals/${id}/${action}`, { method: "POST" });
            if (res.ok) {
                fetchData();
            } else {
                alert(`Failed to ${action} withdrawal`);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setProcessingId(null);
        }
    }

    async function handlePayout(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedUser) return;

        try {
            const res = await fetch("/api/admin/ledger/payout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: selectedUser.id,
                    amount: parseFloat(payoutAmount),
                    currency,
                }),
            });

            if (res.ok) {
                setShowPayoutModal(false);
                setPayoutAmount("");
                fetchData();
            } else {
                alert("Failed to record payout");
            }
        } catch (e) {
            console.error(e);
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Loading ledger data...</div>;

    const isPrivileged = [Role.FOUNDER, Role.CO_FOUNDER, Role.CASHIER].includes(session?.user?.role);

    // Consolidate income and expenses
    const history = [
        ...(data?.companyFundEntries.map(e => ({
            id: e.id,
            date: e.createdAt,
            source: e.payment?.project?.title || "Project Payment",
            amountBDT: e.amountBDT,
            amountUSD: e.amountUSD,
            type: "INCOME" as const
        })) || []),
        ...(data?.approvedExpenses.map(e => ({
            id: e.id,
            date: e.date,
            source: e.title,
            amountBDT: -e.amountBDT,
            amountUSD: e.amountUSD ? -e.amountUSD : null,
            type: "EXPENSE" as const
        })) || [])
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Financial Ledger & Wallet</h1>
                    <p className="text-gray-400">Manage earnings, payouts, and company funds.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {isPrivileged && (
                        <a
                            href="/dashboard/expenses"
                            className="btn-brand px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Add Expense
                        </a>
                    )}
                    {isPrivileged && (
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
                            <button
                                onClick={() => setActiveTab("admin")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'admin' ? 'bg-agency-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Admin Ledger
                            </button>
                            <button
                                onClick={() => setActiveTab("personal")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'personal' ? 'bg-agency-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                <UserCircle className="w-4 h-4" />
                                My Wallet
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {activeTab === "personal" ? (
                <WalletView />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                    {/* Consolidated Fund History */}
                    <div className="space-y-4 lg:col-span-2">
                        <h2 className="text-lg font-bold flex items-center gap-2 px-2">
                            🏛️ Company Transaction History
                        </h2>
                        <div className="glass-panel overflow-hidden rounded-2xl border-white/5">
                            <div className="table-container">
                                <table className="data-table w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left py-4 px-6 border-b border-white/5 bg-white/[0.02]">Date</th>
                                            <th className="text-left py-4 px-6 border-b border-white/5 bg-white/[0.02]">Description</th>
                                            <th className="text-right py-4 px-6 border-b border-white/5 bg-white/[0.02]">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.length === 0 ? (
                                            <tr><td colSpan={3} className="p-8 text-center text-gray-500">No entries yet.</td></tr>
                                        ) : history.map((entry) => (
                                            <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-6 text-sm text-gray-500">
                                                    {new Date(entry.date).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-6 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        {entry.type === "INCOME" ? (
                                                            <ArrowDownRight className="w-3 h-3 text-green-400" />
                                                        ) : (
                                                            <ArrowUpRight className="w-3 h-3 text-red-400" />
                                                        )}
                                                        <span className="font-medium">{entry.source}</span>
                                                    </div>
                                                </td>
                                                <td className={`py-4 px-6 text-right font-mono ${entry.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                                                    {entry.amountBDT ? `৳${entry.amountBDT.toLocaleString()}` : `$${entry.amountUSD?.toLocaleString()}`}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-8">
                        {/* Pending Withdrawals */}
                        {data?.pendingWithdrawals && data.pendingWithdrawals.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold flex items-center gap-2 px-2 text-amber-400">
                                    <Clock className="w-5 h-5" />
                                    Pending Withdrawals
                                </h2>
                                <div className="glass-panel border-amber-500/20 bg-amber-500/5 rounded-2xl overflow-hidden p-4 space-y-4">
                                    {data.pendingWithdrawals.map((w) => (
                                        <div key={w.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-bold text-sm">{w.user.name}</div>
                                                    <div className="text-[10px] text-gray-500">{new Date(w.createdAt).toLocaleString()}</div>
                                                </div>
                                                <div className="font-mono font-bold text-amber-400">
                                                    {w.currency === "BDT" ? `৳${w.amount.toLocaleString()}` : `$${w.amount.toLocaleString()}`}
                                                </div>
                                            </div>
                                            {w.note && <div className="text-[10px] text-gray-400 italic">"{w.note}"</div>}
                                            {isCFO && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleWithdrawAction(w.id, 'approve')}
                                                        disabled={processingId === w.id}
                                                        className="flex-1 py-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleWithdrawAction(w.id, 'reject')}
                                                        disabled={processingId === w.id}
                                                        className="flex-1 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                                                    >
                                                        <XCircle className="w-3 h-3" />
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* User Balances */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2 px-2">
                                👥 Contractor Balances
                            </h2>
                            <div className="glass-panel overflow-hidden rounded-2xl border-white/5">
                                <div className="table-container">
                                    <table className="data-table w-full">
                                        <thead>
                                            <tr>
                                                <th className="text-left py-4 px-6 border-b border-white/5 bg-white/[0.02]">User</th>
                                                <th className="text-right py-4 px-6 border-b border-white/5 bg-white/[0.02]">Balance</th>
                                                <th className="text-right py-4 px-6 border-b border-white/5 bg-white/[0.02]">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.userBalances.length === 0 ? (
                                                <tr><td colSpan={3} className="p-8 text-center text-gray-500">No balances recorded.</td></tr>
                                            ) : data?.userBalances.map((balance) => (
                                                <tr key={balance.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="py-4 px-6 font-medium text-xs">{balance.user.name}</td>
                                                    <td className="py-4 px-6 text-right">
                                                        <div className="text-[10px] font-mono">৳{balance.totalBDT.toLocaleString()}</div>
                                                        <div className="text-[9px] text-gray-500 font-mono">${balance.totalUSD.toLocaleString()}</div>
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUser(balance.user);
                                                                setShowPayoutModal(true);
                                                            }}
                                                            className="text-[10px] btn-outline py-1 px-2 rounded-lg"
                                                            title="Direct Payout"
                                                        >
                                                            Payout
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payout Modal */}
            {showPayoutModal && selectedUser && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-sm p-0 rounded-3xl overflow-hidden animate-fade-in-up border-white/10 shadow-brand/20">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-agency-accent" />
                                Record Payout
                            </h3>
                            <button onClick={() => setShowPayoutModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handlePayout} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Recording payout for <span className="text-white font-medium">{selectedUser.name}</span></p>
                            </div>

                            <div className="space-y-2">
                                <label className="input-label">Currency</label>
                                <select
                                    className="select-field"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value as any)}
                                >
                                    <option value="BDT">BDT (৳)</option>
                                    <option value="USD">USD ($)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="input-label flex items-center gap-2">
                                    <CircleDollarSign className="w-4 h-4 text-gray-500" />
                                    Payout Amount
                                </label>
                                <input
                                    type="number"
                                    required
                                    className="input-field"
                                    placeholder="Enter amount..."
                                    value={payoutAmount}
                                    onChange={(e) => setPayoutAmount(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                <button type="button" onClick={() => setShowPayoutModal(false)} className="btn-outline flex-1 rounded-2xl py-3">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-brand flex-1 rounded-2xl py-3 gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Confirm Payout
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
