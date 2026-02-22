"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/app/components/admin/ImageUpload";
import { Testimonial } from "@prisma/client";

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [deletingTestimonial, setDeletingTestimonial] = useState<Testimonial | null>(null);
    const [form, setForm] = useState({
        name: "",
        role: "",
        company: "",
        content: "",
        avatarUrl: "",
        rating: 5,
        order: 0,
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    useEffect(() => {
        if (editingTestimonial) {
            setForm({
                name: editingTestimonial.name,
                role: editingTestimonial.role ?? "",
                company: editingTestimonial.company ?? "",
                content: editingTestimonial.content,
                avatarUrl: editingTestimonial.avatarUrl ?? "",
                rating: editingTestimonial.rating,
                order: editingTestimonial.order,
            });
        } else {
            setForm({
                name: "",
                role: "",
                company: "",
                content: "",
                avatarUrl: "",
                rating: 5,
                order: 0,
            });
        }
    }, [editingTestimonial, isModalOpen]);

    async function fetchTestimonials() {
        try {
            const res = await fetch("/api/admin/testimonials");
            if (res.ok) {
                const data = await res.json();
                setTestimonials(data);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const url = editingTestimonial ? `/api/admin/testimonials/${editingTestimonial.id}` : "/api/admin/testimonials";
        const method = editingTestimonial ? "PUT" : "POST";
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            setIsModalOpen(false);
            setEditingTestimonial(null);
            fetchTestimonials();
        } else {
            alert("Failed to save testimonial");
        }
    }

    async function handleDelete() {
        if (!deletingTestimonial) return;
        const res = await fetch(`/api/admin/testimonials/${deletingTestimonial.id}`, { method: "DELETE" });
        if (res.ok) {
            setDeletingTestimonial(null);
            fetchTestimonials();
        } else alert("Failed to delete testimonial");
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold font-display">Testimonials Management</h1>
                <button
                    onClick={() => { setEditingTestimonial(null); setIsModalOpen(true); }}
                    className="btn-brand w-full sm:w-auto"
                >
                    + Add Testimonial
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-20 text-gray-500">Loading testimonials...</div>
                ) : testimonials.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-gray-500">No testimonials yet.</div>
                ) : testimonials.map((t) => (
                    <div key={t.id} className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col h-full bg-white/[0.02]">
                        <div className="flex items-center gap-4 mb-4">
                            {t.avatarUrl ? (
                                <img src={t.avatarUrl} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl font-bold text-gray-500">
                                    {t.name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <div className="font-bold">{t.name}</div>
                                <div className="text-xs text-gray-400">{t.role}{t.company ? ` @ ${t.company}` : ""}</div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-300 italic mb-6 flex-1">"{t.content}"</p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                            <div className="flex text-yellow-500 gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < t.rating ? "text-yellow-500" : "text-gray-600"}>★</span>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => { setEditingTestimonial(t); setIsModalOpen(true); }} className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider">Edit</button>
                                <button onClick={() => setDeletingTestimonial(t)} className="text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-wider">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-lg rounded-xl animate-fade-in-up">
                        <div className="p-8 pb-4 border-b border-white/5">
                            <h2 className="text-2xl font-bold">{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</h2>
                        </div>
                        <form id="testimonial-form" onSubmit={handleSubmit} className="p-8 pt-4 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="input-label">Client Name</label>
                                    <input type="text" required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="input-label">Rating (1-5)</label>
                                    <input type="number" min="1" max="5" required className="input-field" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="input-label">Role</label>
                                    <input type="text" className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                                </div>
                                <div>
                                    <label className="input-label">Company</label>
                                    <input type="text" className="input-field" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Content</label>
                                <textarea required className="input-field min-h-[100px] py-3" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                            </div>
                            <ImageUpload
                                label="Avatar Image"
                                value={form.avatarUrl}
                                onChange={(url) => setForm({ ...form, avatarUrl: url })}
                            />
                            <div>
                                <label className="input-label">Display Order</label>
                                <input type="number" className="input-field" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })} />
                            </div>
                        </form>
                        <div className="p-8 pt-0 flex gap-4 mt-4">
                            <button type="button" onClick={() => { setIsModalOpen(false); setEditingTestimonial(null); }} className="btn-outline flex-1">Cancel</button>
                            <button form="testimonial-form" type="submit" className="btn-brand flex-1">
                                {editingTestimonial ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deletingTestimonial && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-md p-8 rounded-xl animate-fade-in-up border border-red-500/20">
                        <h2 className="text-xl font-bold mb-2">Delete Testimonial?</h2>
                        <p className="text-gray-400 mb-6 text-sm">Are you sure you want to delete <span className="text-white font-semibold">"{deletingTestimonial.name}"</span>'s testimonial? This action cannot be undone.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeletingTestimonial(null)} className="btn-outline flex-1">Cancel</button>
                            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex-1">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
