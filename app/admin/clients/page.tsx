"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/app/components/admin/ImageUpload";
import { Client } from "@prisma/client";

export default function AdminClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [deletingClient, setDeletingClient] = useState<Client | null>(null);
    const [form, setForm] = useState({
        name: "",
        logoUrl: "",
        website: "",
        order: 0,
    });

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        if (editingClient) {
            setForm({
                name: editingClient.name,
                logoUrl: editingClient.logoUrl,
                website: editingClient.website ?? "",
                order: editingClient.order,
            });
        } else {
            setForm({
                name: "",
                logoUrl: "",
                website: "",
                order: 0,
            });
        }
    }, [editingClient, isModalOpen]);

    async function fetchClients() {
        try {
            const res = await fetch("/api/admin/clients");
            if (res.ok) {
                const data = await res.json();
                setClients(data);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const url = editingClient ? `/api/admin/clients/${editingClient.id}` : "/api/admin/clients";
        const method = editingClient ? "PUT" : "POST";
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            setIsModalOpen(false);
            setEditingClient(null);
            fetchClients();
        } else {
            alert("Failed to save client");
        }
    }

    async function handleDelete() {
        if (!deletingClient) return;
        const res = await fetch(`/api/admin/clients/${deletingClient.id}`, { method: "DELETE" });
        if (res.ok) {
            setDeletingClient(null);
            fetchClients();
        } else alert("Failed to delete client");
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold font-display">Clients Management</h1>
                <button
                    onClick={() => { setEditingClient(null); setIsModalOpen(true); }}
                    className="btn-brand w-full sm:w-auto"
                >
                    + Add New Client
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-20 text-gray-500">Loading clients...</div>
                ) : clients.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-gray-500">No clients yet.</div>
                ) : clients.map((c) => (
                    <div key={c.id} className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col items-center bg-white/[0.02] group relative">
                        <div className="h-20 w-full flex items-center justify-center mb-2">
                            <img src={c.logoUrl} alt={c.name} className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                        </div>
                        <div className="text-center">
                            <div className="text-xs font-bold truncate max-w-full">{c.name}</div>
                            {c.website && <div className="text-[10px] text-gray-500 truncate">{new URL(c.website).hostname}</div>}
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingClient(c); setIsModalOpen(true); }} className="p-1 bg-white/10 rounded hover:bg-white/20 text-gray-300">
                                ✎
                            </button>
                            <button onClick={() => setDeletingClient(c)} className="p-1 bg-red-500/10 rounded hover:bg-red-500/20 text-red-400">
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-lg rounded-xl animate-fade-in-up">
                        <div className="p-8 pb-4 border-b border-white/5">
                            <h2 className="text-2xl font-bold">{editingClient ? "Edit Client" : "Add New Client"}</h2>
                        </div>
                        <form id="client-form" onSubmit={handleSubmit} className="p-8 pt-4 space-y-4">
                            <div>
                                <label className="input-label">Client Name</label>
                                <input type="text" required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="input-label">Website (optional)</label>
                                <input type="url" className="input-field" placeholder="https://" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                            </div>
                            <ImageUpload
                                label="Client Logo"
                                value={form.logoUrl}
                                onChange={(url) => setForm({ ...form, logoUrl: url })}
                                description="Prefer PNG with transparent background."
                            />
                            <div>
                                <label className="input-label">Display Order</label>
                                <input type="number" className="input-field" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })} />
                            </div>
                        </form>
                        <div className="p-8 pt-0 flex gap-4 mt-4">
                            <button type="button" onClick={() => { setIsModalOpen(false); setEditingClient(null); }} className="btn-outline flex-1">Cancel</button>
                            <button form="client-form" type="submit" className="btn-brand flex-1">
                                {editingClient ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deletingClient && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-md p-8 rounded-xl animate-fade-in-up border border-red-500/20">
                        <h2 className="text-xl font-bold mb-2">Delete Client?</h2>
                        <p className="text-gray-400 mb-6 text-sm">Are you sure you want to delete <span className="text-white font-semibold">"{deletingClient.name}"</span>? This action cannot be undone.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeletingClient(null)} className="btn-outline flex-1">Cancel</button>
                            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex-1">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
