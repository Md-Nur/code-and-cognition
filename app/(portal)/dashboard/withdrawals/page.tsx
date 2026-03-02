"use client";

import { useEffect, useState } from "react";
import { Withdrawal } from "@prisma/client";
import {
    Wallet,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    CircleDollarSign,
    Send,
    RefreshCw,
} from "lucide-react";
import LocalTime from "@/app/components/shared/LocalTime";

type WalletData = {
    balance: { totalBDT: number; totalUSD: number };
};

const statusConfig = {
    PENDING: {
        label: "Pending",
        icon: Clock,
        color: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/20",
        dot: "bg-amber-400",
    },
    APPROVED: {
        label: "Approved",
        icon: CheckCircle2,
        color: "text-blue-400",
        bg: "bg-blue-500/10 border-blue-500/20",
        dot: "bg-blue-400",
    },
    COMPLETED: {
        label: "Completed",
        icon: CheckCircle2,
        color: "text-green-400",
        bg: "bg-green-500/10 border-green-500/20",
        dot: "bg-green-400",
    },
    REJECTED: {
        label: "Rejected",
        icon: XCircle,
        color: "text-red-400",
        bg: "bg-red-500/10 border-red-500/20",
        dot: "bg-red-400",
    },
};

export default function WithdrawalsPage() {
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form state
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState<"BDT" | "USD">("BDT");
    const [note, setNote] = useState("");

    async function fetchData() {
        const [walletRes, withdrawRes] = await Promise.all([
            fetch("/api/user/wallet"),
            fetch("/api/user/withdraw"),
        ]);
        if (walletRes.ok) setWallet(await walletRes.json());
        if (withdrawRes.ok) setWithdrawals(await withdrawRes.json());
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setSubmitting(true);

        const parsed = parseFloat(amount);
        if (!parsed || parsed <= 0) {
            setError("Please enter a valid positive amount.");
            setSubmitting(false);
            return;
        }

        try {
            const res = await fetch("/api/user/withdraw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: parsed, currency, note: note || undefined }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to submit withdrawal request.");
            } else {
                setSuccess("Withdrawal request submitted! The CFO will review it shortly.");
                setAmount("");
                setNote("");
                fetchData();
            }
        } catch {
            setError("Unexpected error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    const balance = wallet?.balance ?? { totalBDT: 0, totalUSD: 0 };
    const pendingTotal = withdrawals
        .filter((w) => w.status === "PENDING")
        .reduce((sum, w) => (w.currency === currency ? sum + w.amount : sum), 0);

    const currentBalance = currency === "BDT" ? balance.totalBDT : balance.totalUSD;
    const available = currentBalance - pendingTotal;

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Withdrawals</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Request a withdrawal from your earned balance. The CFO will review and approve.
                    </p>
                </div>
                <button
                    onClick={() => { setLoading(true); fetchData(); }}
                    className="btn-outline px-4 py-2 rounded-xl text-sm flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="p-16 text-center text-gray-500">Loading your wallet...</div>
            ) : (
                <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Balance + Request Form */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Balance Card */}
                        <div className="glass-panel p-6 rounded-3xl border-white/5 bg-gradient-to-br from-agency-accent/10 to-transparent space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-agency-accent/10 text-agency-accent">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Your Balance</p>
                                    <p className="text-xs text-gray-500">Earned from projects</p>
                                </div>
                            </div>
                            <div className="space-y-1 pt-2 border-t border-white/5">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold font-mono text-white">৳{balance.totalBDT.toLocaleString()}</span>
                                    <span className="text-sm text-gray-500">BDT</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-mono text-gray-400">${balance.totalUSD.toLocaleString()}</span>
                                    <span className="text-xs text-gray-500">USD</span>
                                </div>
                            </div>
                            {pendingTotal > 0 && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
                                    <Clock className="w-3 h-3 shrink-0" />
                                    <span>
                                        {currency === "BDT" ? "৳" : "$"}{pendingTotal.toLocaleString()} locked in pending requests
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Request Form */}
                        <div className="glass-panel rounded-3xl border-white/5 overflow-hidden">
                            <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                                <ArrowUpRight className="w-5 h-5 text-agency-accent" />
                                <h2 className="font-bold text-base">Request Withdrawal</h2>
                            </div>
                            <form onSubmit={handleSubmit} className="p-5 space-y-5">
                                {/* Currency */}
                                <div className="space-y-2">
                                    <label className="input-label">Currency</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(["BDT", "USD"] as const).map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setCurrency(c)}
                                                className={`py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${currency === c
                                                    ? "border-agency-accent/50 bg-agency-accent/10 text-agency-accent"
                                                    : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                                                    }`}
                                            >
                                                {c === "BDT" ? "৳ BDT" : "$ USD"}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Amount */}
                                <div className="space-y-2">
                                    <label className="input-label flex justify-between">
                                        <span className="flex items-center gap-1.5">
                                            <CircleDollarSign className="w-3.5 h-3.5 text-gray-500" />
                                            Amount
                                        </span>
                                        <span className="text-gray-500 text-[10px]">
                                            Available: {currency === "BDT" ? `৳${available.toLocaleString()}` : `$${available.toLocaleString()}`}
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="any"
                                        required
                                        className="input-field"
                                        placeholder={`Enter amount in ${currency}...`}
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>

                                {/* Note */}
                                <div className="space-y-2">
                                    <label className="input-label">Note (optional)</label>
                                    <textarea
                                        className="input-field resize-none"
                                        placeholder="Reason or bank details..."
                                        rows={2}
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                    />
                                </div>

                                {/* Feedback */}
                                {error && (
                                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                        <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="flex items-start gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                        {success}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-brand w-full py-3 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {submitting ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    {submitting ? "Submitting..." : "Submit Request"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right: Withdrawal History */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-3 px-2 border-l-4 border-agency-accent">
                            <h2 className="text-xl font-bold">Withdrawal History</h2>
                            {withdrawals.length > 0 && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 font-medium">
                                    {withdrawals.length}
                                </span>
                            )}
                        </div>

                        {withdrawals.length === 0 ? (
                            <div className="glass-panel rounded-3xl border-white/5 p-16 text-center space-y-3">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center">
                                    <Wallet className="w-8 h-8 text-gray-600" />
                                </div>
                                <p className="text-gray-500 font-medium">No withdrawal requests yet</p>
                                <p className="text-gray-600 text-xs">Submit your first request using the form on the left.</p>
                            </div>
                        ) : (
                            <div className="glass-panel overflow-hidden rounded-2xl border-white/5">
                                <div className="table-container">
                                    <table className="data-table w-full">
                                        <thead>
                                            <tr>
                                                <th className="text-left py-4 px-6 border-b border-white/5 bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-gray-500">Date</th>
                                                <th className="text-right py-4 px-6 border-b border-white/5 bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-gray-500">Amount</th>
                                                <th className="text-left py-4 px-6 border-b border-white/5 bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-gray-500">Note</th>
                                                <th className="text-center py-4 px-6 border-b border-white/5 bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {withdrawals.map((w) => {
                                                const cfg = statusConfig[w.status as keyof typeof statusConfig] || statusConfig.PENDING;
                                                const Icon = cfg.icon;
                                                return (
                                                    <tr key={w.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                        <td className="py-4 px-6">
                                                            <div className="text-sm text-white">
                                                                <LocalTime date={w.createdAt} />
                                                            </div>
                                                            <div className="text-[10px] text-gray-500">
                                                                <LocalTime date={w.createdAt} showTime formatStr="" />
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6 text-right">
                                                            <span className="font-mono font-bold text-white text-sm">
                                                                {w.currency === "BDT" ? "৳" : "$"}{w.amount.toLocaleString()}
                                                            </span>
                                                            <div className="text-[10px] text-gray-500 text-right">{w.currency}</div>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className="text-xs text-gray-400 italic">
                                                                {w.note || "—"}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6 text-center">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cfg.bg} ${cfg.color}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                                <Icon className="w-3 h-3" />
                                                                {cfg.label}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Info panel */}
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-gray-500 flex items-start gap-2.5">
                            <AlertCircle className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                            <div>
                                <span className="text-gray-400 font-medium">How it works: </span>
                                Submit a request with the amount you wish to withdraw. The CFO will review and approve or reject it. Once approved, the amount is deducted from your balance and processed as a payment.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
