"use client";

import { useEffect, useState } from "react";
import { Expense } from "@prisma/client";

export default function AdminExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
    const [form, setForm] = useState({
        title: "",
        amountBDT: "",
        amountUSD: "",
        category: "",
        date: new Date().toISOString().split('T')[0],
        note: ""
    });

    useEffect(() => {
        fetchExpenses();
    }, []);

    useEffect(() => {
        if (editingExpense) {
            setForm({
                title: editingExpense.title,
                amountBDT: editingExpense.amountBDT.toString(),
                amountUSD: editingExpense.amountUSD?.toString() || "",
                category: editingExpense.category || "",
                date: new Date(editingExpense.date).toISOString().split('T')[0],
                note: editingExpense.note || ""
            });
        } else {
            setForm({
                title: "",
                amountBDT: "",
                amountUSD: "",
                category: "",
                date: new Date().toISOString().split('T')[0],
                note: ""
            });
        }
    }, [editingExpense, isModalOpen]);

    async function fetchExpenses() {
        try {
            const res = await fetch("/api/admin/expenses");
            if (res.ok) {
                const data = await res.json();
                setExpenses(data);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const url = editingExpense ? `/api/admin/expenses/${editingExpense.id}` : "/api/admin/expenses";
        const method = editingExpense ? "PATCH" : "POST";
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            setIsModalOpen(false);
            setEditingExpense(null);
            fetchExpenses();
        } else {
            alert("Failed to save expense");
        }
    }

    async function handleDelete() {
        if (!deletingExpense) return;
        const res = await fetch(`/api/admin/expenses/${deletingExpense.id}`, { method: "DELETE" });
        if (res.ok) {
            setDeletingExpense(null);
            fetchExpenses();
        } else {
            alert("Failed to delete expense");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-display">Expenses Management</h1>
                    <p className="text-sm text-gray-400 mt-1">Track and manage costs for your page.</p>
                </div>
                <button
                    onClick={() => { setEditingExpense(null); setIsModalOpen(true); }}
                    className="btn-brand w-full sm:w-auto"
                >
                    + Add New Expense
                </button>
            </div>

            <div className="glass-panel rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-white/[0.02]">
                            <tr>
                                <th className="text-left py-4 px-6 text-[10px] uppercase text-gray-500 font-bold tracking-wide">Date</th>
                                <th className="text-left py-4 px-6 text-[10px] uppercase text-gray-500 font-bold tracking-wide">Title</th>
                                <th className="text-left py-4 px-6 text-[10px] uppercase text-gray-500 font-bold tracking-wide">Category</th>
                                <th className="text-right py-4 px-6 text-[10px] uppercase text-gray-500 font-bold tracking-wide">Amount (BDT)</th>
                                <th className="text-right py-4 px-6 text-[10px] uppercase text-gray-500 font-bold tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-gray-500">Loading expenses...</td>
                                </tr>
                            ) : expenses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-gray-500 italic">No expenses recorded yet.</td>
                                </tr>
                            ) : expenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-4 px-6 text-gray-400">
                                        {new Date(expense.date).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-medium">{expense.title}</div>
                                        {expense.note && <div className="text-[10px] text-gray-500 truncate max-w-[200px]">{expense.note}</div>}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400">
                                            {expense.category || "General"}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right font-bold text-red-400">
                                        ৳{expense.amountBDT.toLocaleString()}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex justify-end gap-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => { setEditingExpense(expense); setIsModalOpen(true); }}
                                                className="text-xs font-bold text-gray-400 hover:text-white uppercase"
                                            >Edit</button>
                                            <button
                                                onClick={() => setDeletingExpense(expense)}
                                                className="text-xs font-bold text-red-400 hover:text-red-300 uppercase"
                                            >Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Expense Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-lg rounded-xl animate-fade-in-up">
                        <div className="p-8 pb-4 border-b border-white/5">
                            <h2 className="text-2xl font-bold">{editingExpense ? "Edit Expense" : "Add New Expense"}</h2>
                        </div>
                        <form id="expense-form" onSubmit={handleSubmit} className="p-8 pt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="input-label">Title</label>
                                    <input type="text" required className="input-field" placeholder="e.g. Server Hosting"
                                        value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                                </div>
                                <div>
                                    <label className="input-label">Amount (BDT)</label>
                                    <input type="number" step="0.01" required className="input-field" placeholder="৳"
                                        value={form.amountBDT} onChange={(e) => setForm({ ...form, amountBDT: e.target.value })} />
                                </div>
                                <div>
                                    <label className="input-label">Date</label>
                                    <input type="date" required className="input-field"
                                        value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="input-label">Category</label>
                                    <input type="text" className="input-field" placeholder="e.g. Marketing"
                                        value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                                </div>
                                <div>
                                    <label className="input-label">Amount (USD - Optional)</label>
                                    <input type="number" step="0.01" className="input-field" placeholder="$"
                                        value={form.amountUSD} onChange={(e) => setForm({ ...form, amountUSD: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="input-label">Note (Optional)</label>
                                    <textarea className="input-field min-h-[80px] py-3" placeholder="Additional details..."
                                        value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                                </div>
                            </div>
                        </form>
                        <div className="p-8 pt-0 flex gap-4">
                            <button type="button" onClick={() => { setIsModalOpen(false); setEditingExpense(null); }} className="btn-outline flex-1">Cancel</button>
                            <button form="expense-form" type="submit" className="btn-brand flex-1">
                                {editingExpense ? "Update Expense" : "Add Expense"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deletingExpense && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-md p-8 rounded-xl animate-fade-in-up border border-red-500/20">
                        <h2 className="text-xl font-bold mb-2">Delete Expense?</h2>
                        <p className="text-gray-400 mb-6 text-sm">
                            Are you sure you want to delete <span className="text-white font-semibold">"{deletingExpense.title}"</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeletingExpense(null)} className="btn-outline flex-1">Cancel</button>
                            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex-1">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
