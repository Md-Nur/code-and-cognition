"use client";

import { useEffect, useState } from "react";
import { Payment, Project } from "@prisma/client";
import { Briefcase, CircleDollarSign, StickyNote, X, Plus, Trash2, Edit2, CheckCircle2 } from "lucide-react";

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
    const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        async function getSession() {
            const res = await fetch("/api/auth/profile");
            if (res.ok) {
                const s = await res.json();
                if (s.user.role === "CLIENT") {
                    window.location.href = "/dashboard";
                }
                setSession(s);
            }
        }
        getSession();
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
            const url = editingPaymentId
                ? `/api/admin/payments/${editingPaymentId}`
                : "/api/admin/payments";
            const method = editingPaymentId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
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
                setEditingPaymentId(null);
            } else {
                const errorData = await res.json();
                alert(errorData.error || `Failed to ${editingPaymentId ? 'update' : 'create'} payment`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    function handleEdit(payment: PaymentWithProject) {
        setFormData({
            projectId: payment.projectId,
            amount: payment.currency === "BDT" ? (payment.amountBDT?.toString() || "") : (payment.amountUSD?.toString() || ""),
            currency: payment.currency,
            note: payment.note || ""
        });
        setEditingPaymentId(payment.id);
        setShowModal(true);
    }

    async function handleDelete(id: string) {
        if (!window.confirm("Are you sure you want to delete this payment? This will reverse the splits and affect user balances.")) return;

        setIsDeleting(id);
        try {
            const res = await fetch(`/api/admin/payments/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchPayments();
            } else {
                const errorData = await res.json();
                alert(errorData.error || "Failed to delete payment");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(null);
        }
    }

    function handleCloseModal() {
        setShowModal(false);
        setEditingPaymentId(null);
        setFormData({ projectId: "", amount: "", currency: "BDT", note: "" });
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Payments & Splits</h1>
                {session?.user?.isCFO && (
                    <button onClick={() => {
                        setEditingPaymentId(null);
                        setFormData({ projectId: "", amount: "", currency: "BDT", note: "" });
                        setShowModal(true);
                    }} className="btn-brand gap-2">
                        <Plus className="w-4 h-4" />
                        Record Payment
                    </button>
                )}
            </div>

            {/* Payment History Table */}
            <div className="glass-panel overflow-hidden rounded-xl">
                <div className="table-container">
                    <table className="data-table min-w-[800px]">
                        <thead>
                            <tr>
                                <th className="text-left p-4">Date</th>
                                <th className="text-left p-4">Project</th>
                                <th className="text-left p-4">Amount</th>
                                <th className="text-left p-4">Note</th>
                                <th className="text-left p-4">Status</th>
                                <th className="text-right p-4">Actions</th>
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
                                    <td className="p-4 text-right">
                                        {session?.user?.isCFO && (
                                            <>
                                                <button
                                                    onClick={() => handleEdit(payment)}
                                                    className="text-blue-400 hover:text-blue-300 transition-colors p-2"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(payment.id)}
                                                    className="text-red-400 hover:text-red-300 transition-colors p-2"
                                                    disabled={isDeleting === payment.id}
                                                    title="Delete"
                                                >
                                                    {isDeleting === payment.id ? (
                                                        <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-lg p-0 rounded-3xl overflow-hidden animate-fade-in-up border-white/10 shadow-brand/20">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                {editingPaymentId ? <Edit2 className="w-5 h-5 text-agency-accent" /> : <Plus className="w-5 h-5 text-agency-accent" />}
                                {editingPaymentId ? "Edit Payment" : "Record New Payment"}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="input-label flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-gray-500" />
                                    Project
                                </label>
                                <select
                                    required
                                    className="select-field"
                                    value={formData.projectId}
                                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                >
                                    <option value="">Select Project...</option>
                                    {projects.map(p => (
                                        <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="input-label flex items-center gap-2">
                                        <CircleDollarSign className="w-4 h-4 text-gray-500" />
                                        Amount
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            required
                                            className="input-field"
                                            placeholder="0.00"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="input-label">Currency</label>
                                    <select
                                        className="select-field"
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    >
                                        <option value="BDT">BDT (৳)</option>
                                        <option value="USD">USD ($)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="input-label flex items-center gap-2">
                                    <StickyNote className="w-4 h-4 text-gray-500" />
                                    Note (Optional)
                                </label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. Milestone 1 Payment"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                <button type="button" onClick={handleCloseModal} className="btn-outline flex-1 rounded-2xl py-3">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-brand flex-1 rounded-2xl py-3 gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    {editingPaymentId ? "Update Payment Info" : "Process Split"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
