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

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("/api/admin/ledger");
            if (res.ok) setData(await res.json());
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading ledger data...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Financial Ledger & Balances</h1>
                <p className="text-gray-400">Track company funds and contractor wallet balances.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Company Fund History */}
                <div className="space-y-4">
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
                                            {entry.amountBDT ? `৳${entry.amountBDT}` : `$${entry.amountUSD}`}
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
                                    <th className="text-right p-4">BDT Balance</th>
                                    <th className="text-right p-4">USD Balance</th>
                                    <th className="text-right p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.userBalances.map((balance) => (
                                    <tr key={balance.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium">{balance.user.name}</td>
                                        <td className="p-4 text-right">৳{balance.totalBDT.toLocaleString()}</td>
                                        <td className="p-4 text-right">${balance.totalUSD.toLocaleString()}</td>
                                        <td className="p-4 text-right">
                                            <button className="text-xs btn-outline py-1 px-2">Payout</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
