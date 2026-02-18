"use client";

import { useEffect, useState } from "react";
import { Payment, Project } from "@prisma/client";

type PaymentWithProject = Payment & { project: Project };

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<PaymentWithProject[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [projects, setProjects] = useState<Project[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        projectId: "",
        amount: "",
        currency: "BDT",
        note: ""
    });

    useEffect(() => {
        fetchPayments();
        fetchProjects();
    }, []);

    async function fetchPayments() {
        const res = await fetch("/api/admin/payments");
        if (res.ok) setPayments(await res.json());
        setLoading(false);
    }

    async function fetchProjects() {
        const res = await fetch("/api/admin/projects");
        if (res.ok) setProjects(await res.json());
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    amount: parseFloat(formData.amount),
                }),
            });

            if (res.ok) {
                setShowModal(false);
                fetchPayments();
                setFormData({ projectId: "", amount: "", currency: "BDT", note: "" });
            } else {
                alert("Failed to create payment");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Payments & Splits</h1>
                <button onClick={() => setShowModal(true)} className="btn-brand">
                    + Record Payment
                </button>
            </div>

            {/* Payment History Table */}
            <div className="glass-panel overflow-hidden rounded-xl">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="text-left p-4">Date</th>
                            <th className="text-left p-4">Project</th>
                            <th className="text-left p-4">Amount</th>
                            <th className="text-left p-4">Note</th>
                            <th className="text-left p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
                        ) : payments.map((payment) => (
                            <tr key={payment.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4 text-gray-400">
                                    {new Date(payment.paidAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 font-medium">{payment.project.title}</td>
                                <td className="p-4 font-bold text-white">
                                    {payment.currency === "BDT" ? `৳${payment.amountBDT}` : `$${payment.amountUSD}`}
                                </td>
                                <td className="p-4 text-sm text-gray-500">{payment.note || "-"}</td>
                                <td className="p-4">
                                    <span className="text-xs px-2 py-1 rounded border border-green-500/30 text-green-400 bg-green-500/10">
                                        Split Processed
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-md p-6 rounded-xl animate-fade-in-up">
                        <h2 className="text-xl font-bold mb-4">Record New Payment</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="input-label">Project</label>
                                <select
                                    required
                                    className="input-field"
                                    value={formData.projectId}
                                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                >
                                    <option value="">Select Project...</option>
                                    {projects.map(p => (
                                        <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="input-label">Amount</label>
                                    <input
                                        type="number"
                                        required
                                        className="input-field"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="input-label">Currency</label>
                                    <select
                                        className="input-field"
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    >
                                        <option value="BDT">BDT (৳)</option>
                                        <option value="USD">USD ($)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="input-label">Note (Optional)</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. Milestone 1 Payment"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-brand flex-1">
                                    Process Split
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
