"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LedgerEntry, LedgerBalance, User, Project } from "@prisma/client";

type ContractorData = {
    entries: (LedgerEntry & { payment: { project: { title: string } } })[];
    balance: LedgerBalance & { user: User };
};

export default function ContractorPage() {
    const [data, setData] = useState<ContractorData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("/api/admin/ledger");
            if (res.ok) setData(await res.json());
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-agency-black flex items-center justify-center text-gray-500">
            Loading your dashboard...
        </div>
    );

    return (
        <div className="min-h-screen bg-agency-black font-sans text-white p-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/" className="text-xl font-display font-bold tracking-tight mb-2 block">
                            Code<span className="text-agency-accent">&</span>Cognition
                        </Link>
                        <h1 className="text-3xl font-bold">Contractor Portal</h1>
                        <p className="text-gray-400">Welcome, {data?.balance?.user?.name}</p>
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="btn-outline text-sm"
                    >
                        Log Out
                    </button>
                </div>

                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <span className="text-6xl">৳</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Total Earnings (BDT)</h3>
                        <div className="text-4xl font-bold text-green-400">
                            ৳{data?.balance?.totalBDT?.toLocaleString() || 0}
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <span className="text-6xl">$</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Total Earnings (USD)</h3>
                        <div className="text-4xl font-bold text-blue-400">
                            ${data?.balance?.totalUSD?.toLocaleString() || 0}
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="glass-panel rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-white/5">
                        <h2 className="text-xl font-bold">Recent Payments</h2>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-sm">
                            <tr>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Project</th>
                                <th className="p-4 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data?.entries.length === 0 ? (
                                <tr><td colSpan={3} className="p-8 text-center text-gray-500">No payment history yet.</td></tr>
                            ) : data?.entries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-gray-400">
                                        {new Date(entry.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 font-medium">
                                        {entry.payment.project.title}
                                    </td>
                                    <td className="p-4 text-right font-mono text-green-400">
                                        {entry.amountBDT ? `৳${entry.amountBDT}` : `$${entry.amountUSD}`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
