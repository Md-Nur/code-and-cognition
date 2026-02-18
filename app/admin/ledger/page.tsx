"use client";

import { useEffect, useState } from "react";
import { LedgerEntry, LedgerBalance, User } from "@prisma/client";

type LedgerData = {
    companyFundEntries: (LedgerEntry & { payment: { project: { title: string } } })[];
    userBalances: (LedgerBalance & { user: User })[];
};

export default function AdminLedgerPage() {
    const [data, setData] = useState<LedgerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [payoutAmount, setPayoutAmount] = useState("");
    const [currency, setCurrency] = useState<"BDT" | "USD">("BDT");

    async function fetchData() {
        const res = await fetch("/api/admin/ledger");
        if (res.ok) setData(await res.json());
        setLoading(false);
    }

    useEffect(() => {
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

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Financial Ledger & Balances</h1>
                <p className="text-gray-400">Track company funds and contractor wallet balances.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Company Fund History */}
                <div className="space-y-4 lg:col-span-2">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        🏛️ Company Fund History
                    </h2>
                    <div className="glass-panel overflow-hidden rounded-xl">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th className="text-left p-4">Date</th>
                                    <th className="text-left p-4">Source</th>
                                    <th className="text-right p-4">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.companyFundEntries.map((entry) => (
                                    <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-sm text-gray-500">
                                            {new Date(entry.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-sm">{entry.payment.project.title}</td>
                                        <td className="p-4 text-right font-mono text-green-400">
                                            {entry.amountBDT ? `৳${entry.amountBDT.toLocaleString()}` : `$${entry.amountUSD?.toLocaleString()}`}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* User Balances */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        👥 Contractor Balances
                    </h2>
                    <div className="glass-panel overflow-hidden rounded-xl">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th className="text-left p-4">User</th>
                                    <th className="text-right p-4">Balance</th>
                                    <th className="text-right p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.userBalances.map((balance) => (
                                    <tr key={balance.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium">{balance.user.name}</td>
                                        <td className="p-4 text-right">
                                            <div className="text-sm">৳{balance.totalBDT.toLocaleString()}</div>
                                            <div className="text-xs text-gray-500">${balance.totalUSD.toLocaleString()}</div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(balance.user);
                                                    setShowPayoutModal(true);
                                                }}
                                                className="text-xs btn-outline py-1 px-2"
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

            {/* Payout Modal */}
            {showPayoutModal && selectedUser && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-sm p-6 rounded-xl animate-fade-in-up">
                        <h3 className="text-lg font-bold mb-4">Record Payout for {selectedUser.name}</h3>
                        <form onSubmit={handlePayout} className="space-y-4">
                            <div>
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
                            <div>
                                <label className="input-label">Payout Amount</label>
                                <input
                                    type="number"
                                    required
                                    className="input-field"
                                    placeholder="Enter amount..."
                                    value={payoutAmount}
                                    onChange={(e) => setPayoutAmount(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setShowPayoutModal(false)} className="btn-outline flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-brand flex-1">
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
