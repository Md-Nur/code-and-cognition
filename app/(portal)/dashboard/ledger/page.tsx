"use client";

import { useEffect, useState } from "react";
import { LedgerEntry, LedgerBalance, User, Role, Expense, Withdrawal } from "@prisma/client";
import {
    CircleDollarSign, Wallet, X, CheckCircle2,
    PlusCircle, ArrowUpRight, ArrowDownRight,
    Clock, Check, XCircle, Building2, Users, Filter, Calendar
} from "lucide-react";
import LocalTime from "@/components/shared/LocalTime";


type LedgerData = {
    transactions: (LedgerEntry & {
        payment: { project: { title: string } | null } | null;
        user: User | null;
        withdrawal: Withdrawal | null;
        expense: Expense | null;
    })[];
    userBalances: (LedgerBalance & { user: User })[];
    pendingWithdrawals: (Withdrawal & { user: User })[];
    completedWithdrawals?: (Withdrawal & { user: User })[];
    totalCompanyFund?: { bdt: number; usd: number };
    totalUserBalances?: { bdt: number; usd: number };
};

export default function LedgerPage() {
    const [data, setData] = useState<LedgerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [session, setSession] = useState<any>(null);

    // Date filter state
    type FilterMode = "all" | "month" | "range";
    const [filterMode, setFilterMode] = useState<FilterMode>("all");
    const [filterMonth, setFilterMonth] = useState<string>(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });
    const [filterFrom, setFilterFrom] = useState<string>("");
    const [filterTo, setFilterTo] = useState<string>("");

    async function fetchData() {
        const res = await fetch("/api/admin/ledger");
        if (res.ok) setData(await res.json());
        setLoading(false);
    }

    useEffect(() => {
        async function getSession() {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const s = await res.json();
                if (s.user.role === "CLIENT" || s.user.role === "CONTRACTOR") {
                    window.location.href = "/dashboard";
                }
                setSession(s);
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
            alert(`Failed to ${action} withdrawal`);
        } finally {
            setProcessingId(null);
        }
    }


    if (loading) return <div className="p-8 text-center text-gray-500">Loading ledger data...</div>;

    const isPrivileged = [Role.FOUNDER, Role.CO_FOUNDER].includes(session?.user?.role);
    const isCFO = session?.user?.isCFO;

    // Consolidate income and expenses
    // Consolidate income, expenses, and withdrawals
    const history = [
        ...(data?.transactions.map(e => {
            const isNegative = (e.amountBDT || 0) < 0 || (e.amountUSD || 0) < 0;
            let type: "INCOME" | "WITHDRAWAL" | "EXPENSE" = "INCOME";
            let source = e.payment?.project?.title || "System Transaction";

            if (e.type === "WITHDRAWAL") {
                type = "WITHDRAWAL";
                source = `Withdrawal: ${e.user?.name || 'User'}`;
            } else if (e.type === "EXPENSE") {
                type = "EXPENSE";
                source = e.expense?.title ? `Expense: ${e.expense.title}` : (e.note || "Expense");
            } else if (e.type === "EXECUTION" || e.type === "FINDER_FEE") {
                type = "INCOME";
                source = `${e.type === 'FINDER_FEE' ? 'Finder' : 'Execution'} share: ${e.user?.name || 'User'} (${source})`;
            } else if (e.type === "COMPANY_FUND") {
                type = "INCOME";
                source = `Project Share: ${source}`;
            }

            return {
                id: e.id,
                date: e.createdAt,
                source,
                amountBDT: e.amountBDT,
                amountUSD: e.amountUSD,
                type
            };
        }) || []),
        ...(data?.completedWithdrawals?.filter(w => w.status === 'REJECTED').map(w => ({
            id: w.id,
            date: w.updatedAt || w.createdAt,
            source: `Withdrawal (Rejected): ${w.user?.name || 'User'}`,
            amountBDT: w.currency === "BDT" ? (w.status === 'REJECTED' ? 0 : -w.amount) : null,
            amountUSD: w.currency === "USD" ? (w.status === 'REJECTED' ? 0 : -w.amount) : null,
            type: "WITHDRAWAL" as const
        })) || [])
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Apply date filter
    const filteredHistory = history.filter(entry => {
        const d = new Date(entry.date);
        if (filterMode === "month" && filterMonth) {
            const [yr, mo] = filterMonth.split("-").map(Number);
            return d.getFullYear() === yr && d.getMonth() + 1 === mo;
        }
        if (filterMode === "range") {
            if (filterFrom && d < new Date(filterFrom)) return false;
            if (filterTo && d > new Date(filterTo + "T23:59:59")) return false;
        }
        return true;
    });

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Company Ledger</h1>
                    <p className="text-gray-400">Manage all company transactions, earnings, and expenses.</p>
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
                </div>
            </div>

            <div className="animate-fade-in pt-4 space-y-8">
                {/* Summary Cards */}
                {isPrivileged && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="glass-panel p-6 rounded-3xl border-white/5 bg-gradient-to-br from-blue-500/10 to-transparent flex items-center gap-5 group hover:border-blue-500/30 transition-all duration-500">
                            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform duration-500">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Company Fund</p>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold font-mono text-white">৳{data?.totalCompanyFund?.bdt.toLocaleString()}</span>
                                    <span className="text-sm font-mono text-gray-500">${data?.totalCompanyFund?.usd.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-3xl border-white/5 bg-gradient-to-br from-purple-500/10 to-transparent flex items-center gap-5 group hover:border-purple-500/30 transition-all duration-500">
                            <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform duration-500">
                                <Users className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Total Balance Outstanding</p>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold font-mono text-white">৳{data?.totalUserBalances?.bdt.toLocaleString()}</span>
                                    <span className="text-sm font-mono text-gray-500">${data?.totalUserBalances?.usd.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                    {/* Consolidated Fund History */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="flex flex-wrap items-center justify-between gap-3 px-2 border-l-4 border-blue-500">
                            <h2 className="text-xl font-bold">🏛️ Company Transaction History</h2>
                            {/* Filter Controls */}
                            <div className="flex flex-wrap items-center gap-2">
                                {/* Mode buttons */}
                                <div className="flex rounded-xl overflow-hidden border border-white/10 text-[11px] font-semibold">
                                    {(["all", "month", "range"] as const).map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setFilterMode(m)}
                                            className={`px-3 py-1.5 transition-colors ${filterMode === m
                                                    ? "bg-blue-500/30 text-blue-300"
                                                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                                                }`}
                                        >
                                            {m === "all" ? "All" : m === "month" ? "Month" : "Range"}
                                        </button>
                                    ))}
                                </div>
                                {/* Month picker */}
                                {filterMode === "month" && (
                                    <input
                                        type="month"
                                        value={filterMonth}
                                        onChange={e => setFilterMonth(e.target.value)}
                                        className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white [color-scheme:dark] focus:outline-none focus:border-blue-500/50"
                                    />
                                )}
                                {/* Date range picker */}
                                {filterMode === "range" && (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="date"
                                            value={filterFrom}
                                            onChange={e => setFilterFrom(e.target.value)}
                                            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white [color-scheme:dark] focus:outline-none focus:border-blue-500/50"
                                        />
                                        <span className="text-gray-500 text-xs">to</span>
                                        <input
                                            type="date"
                                            value={filterTo}
                                            onChange={e => setFilterTo(e.target.value)}
                                            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white [color-scheme:dark] focus:outline-none focus:border-blue-500/50"
                                        />
                                        {(filterFrom || filterTo) && (
                                            <button
                                                onClick={() => { setFilterFrom(""); setFilterTo(""); }}
                                                className="text-gray-500 hover:text-gray-300 transition-colors"
                                                title="Clear dates"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
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
                                        {filteredHistory.length === 0 ? (
                                            <tr><td colSpan={3} className="p-8 text-center text-gray-500">
                                                {history.length === 0 ? "No entries yet." : "No transactions match the selected filter."}
                                            </td></tr>
                                        ) : filteredHistory.map((entry) => {
                                            const isNegative = (entry.amountBDT || 0) < 0 || (entry.amountUSD || 0) < 0;
                                            return (
                                                <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="py-4 px-6 text-sm text-gray-500">
                                                        <LocalTime date={entry.date} />
                                                    </td>
                                                    <td className="py-4 px-6 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            {isNegative ? (
                                                                <ArrowUpRight className="w-3 h-3 text-red-400" />
                                                            ) : (
                                                                <ArrowDownRight className="w-3 h-3 text-green-400" />
                                                            )}
                                                            <span className="font-medium">{entry.source}</span>
                                                        </div>
                                                    </td>
                                                    <td className={`py-4 px-6 text-right font-mono ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
                                                        {entry.amountBDT ? `৳${entry.amountBDT.toLocaleString()}` : `$${entry.amountUSD?.toLocaleString()}`}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right column - Admin Only */}
                    {isPrivileged && (
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
                                                        <div className="text-[10px] text-gray-500"><LocalTime date={w.createdAt} showTime /></div>
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
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data?.userBalances && data.userBalances.length === 0 ? (
                                                    <tr><td colSpan={3} className="p-8 text-center text-gray-500">No balances recorded.</td></tr>
                                                ) : data?.userBalances?.map((balance) => (
                                                    <tr key={balance.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                        <td className="py-4 px-6 font-medium text-xs">{balance.user.name}</td>
                                                        <td className="py-4 px-6 text-right">
                                                            <div className="text-[10px] font-mono">৳{balance.totalBDT.toLocaleString()}</div>
                                                            <div className="text-[9px] text-gray-500 font-mono">${balance.totalUSD.toLocaleString()}</div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
