"use client";

import { useEffect, useState } from "react";
import { LedgerEntry, LedgerBalance, User, Role } from "@prisma/client";
import { CircleDollarSign, Wallet, X, CheckCircle2, LayoutDashboard, UserCircle } from "lucide-react";
import WalletView from "@/app/components/dashboard/WalletView";

type LedgerData = {
    companyFundEntries: (LedgerEntry & { payment: { project: { title: string } } })[];
    userBalances: (LedgerBalance & { user: User })[];
};

export default function LedgerPage() {
    const [data, setData] = useState<LedgerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [payoutAmount, setPayoutAmount] = useState("");
    const [currency, setCurrency] = useState<"BDT" | "USD">("BDT");
    const [activeTab, setActiveTab] = useState<"admin" | "personal">("personal");

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
                // Default to admin tab for founders
                if (s.user.role === Role.FOUNDER || s.user.role === Role.CO_FOUNDER) {
                    setActiveTab("admin");
                }
            }
        }
        getSession();
        fetchData();
    }, []);

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

    const isAdmin = session?.user?.role === Role.FOUNDER || session?.user?.role === Role.CO_FOUNDER;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Financial Ledger & Wallet</h1>
                    <p className="text-gray-400">Manage earnings, payouts, and company funds.</p>
                </div>

                {isAdmin && (
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

            {activeTab === "personal" ? (
                <WalletView />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                    {/* Company Fund History */}
                    <div className="space-y-4 lg:col-span-2">
                        <h2 className="text-lg font-bold flex items-center gap-2 px-2">
                            🏛️ Company Fund History
                        </h2>
                        <div className="glass-panel overflow-hidden rounded-2xl border-white/5">
                            <div className="table-container">
                                <table className="data-table w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left py-4 px-6 border-b border-white/5 bg-white/[0.02]">Date</th>
                                            <th className="text-left py-4 px-6 border-b border-white/5 bg-white/[0.02]">Source</th>
                                            <th className="text-right py-4 px-6 border-b border-white/5 bg-white/[0.02]">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.companyFundEntries.length === 0 ? (
                                            <tr><td colSpan={3} className="p-8 text-center text-gray-500">No entries yet.</td></tr>
                                        ) : data?.companyFundEntries.map((entry) => (
                                            <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-6 text-sm text-gray-500">
                                                    {new Date(entry.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-6 text-sm font-medium">{entry.payment?.project?.title || "Project"}</td>
                                                <td className="py-4 px-6 text-right font-mono text-green-400">
                                                    {entry.amountBDT ? `৳${entry.amountBDT.toLocaleString()}` : `$${entry.amountUSD?.toLocaleString()}`}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

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
                                                <td className="py-4 px-6 font-medium">{balance.user.name}</td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="text-sm font-mono">৳{balance.totalBDT.toLocaleString()}</div>
                                                    <div className="text-xs text-gray-500 font-mono">${balance.totalUSD.toLocaleString()}</div>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(balance.user);
                                                            setShowPayoutModal(true);
                                                        }}
                                                        className="text-xs btn-outline py-1 px-3 rounded-lg"
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
