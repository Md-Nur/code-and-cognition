"use client";

import { useEffect, useState } from "react";
import { CircleDollarSign, Wallet, ArrowDownCircle, ArrowUpCircle, History, Landmark, X, CheckCircle2 } from "lucide-react";
import LocalTime from "@/app/components/shared/LocalTime";

type Transaction = {
    id: string;
    type: string;
    amountBDT: number | null;
    amountUSD: number | null;
    note: string | null;
    createdAt: Date;
    payment?: {
        project: {
            title: string;
        }
    };
    withdrawal?: {
        note: string | null;
    };
};

type WalletData = {
    balance: {
        totalBDT: number;
        totalUSD: number;
    };
    transactions: Transaction[];
};

export default function WalletView() {
    const [data, setData] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState<"BDT" | "USD">("BDT");
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function fetchData() {
        setLoading(true);
        try {
            const res = await fetch("/api/user/wallet");
            if (res.ok) {
                setData(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch wallet data", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    async function handleWithdraw(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/user/withdraw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    currency,
                    note,
                }),
            });

            if (res.ok) {
                setShowWithdrawModal(false);
                setAmount("");
                setNote("");
                fetchData();
            } else {
                const err = await res.json();
                alert(err.error || "Withdrawal failed");
            }
        } catch (error) {
            console.error("Withdrawal error", error);
            alert("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading && !data) return <div className="p-8 text-center text-gray-500">Loading wallet...</div>;

    const balance = data?.balance || { totalBDT: 0, totalUSD: 0 };
    const transactions = data?.transactions || [];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <Landmark className="w-24 h-24 text-agency-accent" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Local Balance</p>
                        <h3 className="text-4xl font-bold font-mono">৳{balance.totalBDT.toLocaleString()}</h3>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            onClick={() => { setCurrency("BDT"); setShowWithdrawModal(true); }}
                            className="btn-brand py-2 px-4 rounded-xl text-sm gap-2"
                        >
                            <ArrowUpCircle className="w-4 h-4" />
                            Withdraw BDT
                        </button>
                    </div>
                </div>

                <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group border-white/5">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <CircleDollarSign className="w-24 h-24 text-blue-400" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Global Balance</p>
                        <h3 className="text-4xl font-bold font-mono">${balance.totalUSD.toLocaleString()}</h3>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            onClick={() => { setCurrency("USD"); setShowWithdrawModal(true); }}
                            className="btn-outline py-2 px-4 rounded-xl text-sm gap-2"
                        >
                            <ArrowUpCircle className="w-4 h-4" />
                            Withdraw USD
                        </button>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <History className="w-5 h-5 text-gray-400" />
                        Transaction History
                    </h2>
                </div>

                <div className="glass-panel overflow-hidden rounded-2xl border-white/5">
                    <div className="table-container">
                        <table className="data-table w-full">
                            <thead>
                                <tr>
                                    <th className="text-left py-4 px-6 border-b border-white/5 bg-white/[0.02]">Status</th>
                                    <th className="text-left py-4 px-6 border-b border-white/5 bg-white/[0.02]">Description</th>
                                    <th className="text-left py-4 px-6 border-b border-white/5 bg-white/[0.02]">Date</th>
                                    <th className="text-right py-4 px-6 border-b border-white/5 bg-white/[0.02]">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-gray-500">
                                            No transactions yet.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((tx) => {
                                        const isNegative = (tx.amountBDT || 0) < 0 || (tx.amountUSD || 0) < 0;
                                        return (
                                            <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                                <td className="py-4 px-6">
                                                    <div className={`p-2 rounded-full w-fit ${isNegative ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                                        {isNegative ? <ArrowUpCircle className="w-4 h-4" /> : <ArrowDownCircle className="w-4 h-4" />}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="font-medium text-white">{tx.note || (isNegative ? 'Withdrawal' : 'Payment')}</div>
                                                    {tx.payment?.project && (
                                                        <div className="text-xs text-gray-500">{tx.payment.project.title}</div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-500">
                                                    <LocalTime date={tx.createdAt} />
                                                </td>
                                                <td className="py-4 px-6 text-right font-mono">
                                                    <div className={isNegative ? 'text-red-400' : 'text-green-400'}>
                                                        {tx.amountBDT !== null ?
                                                            `${isNegative ? '-' : '+'} ৳${Math.abs(tx.amountBDT).toLocaleString()}` :
                                                            `${isNegative ? '-' : '+'} $${Math.abs(tx.amountUSD || 0).toLocaleString()}`
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-md p-0 rounded-3xl overflow-hidden animate-fade-in-up border-white/10 shadow-brand/20">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-agency-accent" />
                                Initiate Withdrawal
                            </h3>
                            <button onClick={() => setShowWithdrawModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleWithdraw} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
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
                                    <label className="input-label">Amount</label>
                                    <input
                                        type="number"
                                        step="any"
                                        required
                                        placeholder="0.00"
                                        className="input-field"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="input-label">Note (Optional)</label>
                                <textarea
                                    className="input-field min-h-[100px] resize-none"
                                    placeholder="Add a reason or note for this withdrawal..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowWithdrawModal(false)}
                                    className="btn-outline flex-1 rounded-2xl py-3"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-brand flex-1 rounded-2xl py-3 gap-2 disabled:opacity-50"
                                >
                                    {submitting ? (
                                        "Processing..."
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            Confirm
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
