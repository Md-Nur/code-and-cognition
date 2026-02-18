"use client";

import { useEffect, useState } from "react";
import { Service, SubCategory } from "@prisma/client";

type ServiceWithSubs = Service & { subCategories: SubCategory[] };

export default function AdminServicesPage() {
    const [services, setServices] = useState<ServiceWithSubs[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingSubTo, setAddingSubTo] = useState<string | null>(null);
    const [newSubTitle, setNewSubTitle] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceWithSubs | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        basePriceBDT: "",
        basePriceUSD: "",
        mediumPriceBDT: "",
        mediumPriceUSD: "",
        proPriceBDT: "",
        proPriceUSD: "",
    });

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (editingService) {
            setFormData({
                title: editingService.title,
                description: editingService.description,
                basePriceBDT: editingService.basePriceBDT.toString(),
                basePriceUSD: editingService.basePriceUSD.toString(),
                mediumPriceBDT: editingService.mediumPriceBDT.toString(),
                mediumPriceUSD: editingService.mediumPriceUSD.toString(),
                proPriceBDT: editingService.proPriceBDT.toString(),
                proPriceUSD: editingService.proPriceUSD.toString(),
            });
        } else {
            setFormData({
                title: "",
                description: "",
                basePriceBDT: "",
                basePriceUSD: "",
                mediumPriceBDT: "",
                mediumPriceUSD: "",
                proPriceBDT: "",
                proPriceUSD: "",
            });
        }
    }, [editingService, isModalOpen]);

    async function fetchServices() {
        try {
            const res = await fetch("/api/admin/services");
            if (res.ok) {
                const data = await res.json();
                setServices(data);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload = {
            ...formData,
            basePriceBDT: parseFloat(formData.basePriceBDT) || 0,
            basePriceUSD: parseFloat(formData.basePriceUSD) || 0,
            mediumPriceBDT: parseFloat(formData.mediumPriceBDT) || 0,
            mediumPriceUSD: parseFloat(formData.mediumPriceUSD) || 0,
            proPriceBDT: parseFloat(formData.proPriceBDT) || 0,
            proPriceUSD: parseFloat(formData.proPriceUSD) || 0,
        };

        try {
            const url = editingService
                ? `/api/admin/services/${editingService.id}`
                : "/api/admin/services";
            const method = editingService ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setIsModalOpen(false);
                setEditingService(null);
                fetchServices();
            } else {
                alert("Failed to save service");
            }
        } catch (error) {
            console.error("Save Error:", error);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this service? This will also delete all sub-categories and may affect portfolio items.")) return;

        try {
            const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
            if (res.ok) fetchServices();
            else alert("Failed to delete service");
        } catch (error) {
            console.error("Delete Error:", error);
        }
    }

    async function toggleStatus(service: Service) {
        const newStatus = service.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        setServices(services.map(s => s.id === service.id ? { ...s, status: newStatus } : s));

        try {
            await fetch(`/api/admin/services/${service.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch (error) {
            console.error("Failed to update status", error);
            fetchServices();
        }
    }

    async function addSubCategory(serviceId: string) {
        if (!newSubTitle.trim()) return;

        try {
            const res = await fetch("/api/admin/subcategories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newSubTitle, serviceId }),
            });
            if (res.ok) {
                setNewSubTitle("");
                setAddingSubTo(null);
                fetchServices();
            }
        } catch (error) {
            console.error("Failed to add sub-category", error);
        }
    }

    async function deleteSubCategory(id: string) {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/admin/subcategories/${id}`, { method: "DELETE" });
            if (res.ok) fetchServices();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-display">Services Management</h1>
                <button
                    onClick={() => {
                        setEditingService(null);
                        setIsModalOpen(true);
                    }}
                    className="btn-brand"
                >
                    + Add New Service
                </button>
            </div>

            <div className="glass-panel overflow-hidden rounded-xl border border-white/5">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="text-left p-4">Service & Sub-categories</th>
                            <th className="text-left p-4">Base Price</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-right p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} className="text-center py-20 text-gray-500">Loading services...</td></tr>
                        ) : services.map((service) => (
                            <tr key={service.id} className="border-b border-white/5 group hover:bg-white/[0.02] transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-lg mb-2">{service.title}</div>
                                    <div className="flex flex-wrap gap-2 items-center">
                                        {service.subCategories.map(sub => (
                                            <span key={sub.id} className="text-[10px] uppercase font-bold py-1 px-2 rounded bg-white/5 border border-white/10 flex items-center gap-2 group/sub">
                                                {sub.title}
                                                <button
                                                    onClick={() => deleteSubCategory(sub.id)}
                                                    className="text-red-500 opacity-0 group-hover/sub:opacity-100 hover:text-red-400 transition-opacity"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                        {addingSubTo === service.id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    autoFocus
                                                    className="text-[10px] bg-agency-black border border-agency-accent/50 rounded px-2 py-1 outline-none w-32"
                                                    value={newSubTitle}
                                                    onChange={(e) => setNewSubTitle(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && addSubCategory(service.id)}
                                                />
                                                <button onClick={() => addSubCategory(service.id)} className="text-green-500 text-xs">✓</button>
                                                <button onClick={() => setAddingSubTo(null)} className="text-gray-500 text-xs">×</button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setAddingSubTo(service.id)}
                                                className="text-[10px] uppercase font-bold text-agency-accent hover:underline"
                                            >
                                                + Add Sub-cat
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center gap-4">
                                            <span className="text-[10px] text-gray-500 uppercase font-bold">Base</span>
                                            <div className="text-right">
                                                <div className="text-sm font-medium">৳{service.basePriceBDT.toLocaleString()}</div>
                                                <div className="text-[10px] text-gray-500">${service.basePriceUSD.toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center gap-4">
                                            <span className="text-[10px] text-gray-500 uppercase font-bold">Med</span>
                                            <div className="text-right">
                                                <div className="text-sm font-medium">৳{service.mediumPriceBDT.toLocaleString()}</div>
                                                <div className="text-[10px] text-gray-500">${service.mediumPriceUSD.toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center gap-4">
                                            <span className="text-[10px] text-gray-500 uppercase font-bold">Pro</span>
                                            <div className="text-right">
                                                <div className="text-sm font-medium">৳{service.proPriceBDT.toLocaleString()}</div>
                                                <div className="text-[10px] text-gray-500">${service.proPriceUSD.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => toggleStatus(service)}
                                        className={`text-xs px-2 py-1 rounded border transition-colors ${service.status === "ACTIVE"
                                            ? "border-green-500/30 text-green-400 bg-green-500/10 hover:bg-green-500/20"
                                            : "border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20"
                                            }`}
                                    >
                                        {service.status}
                                    </button>
                                </td>
                                <td className="text-right p-4">
                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setEditingService(service);
                                                setIsModalOpen(true);
                                            }}
                                            className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-wider"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Service Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-lg p-8 rounded-xl animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-6">
                            {editingService ? "Edit Service" : "Add New Service"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="input-label">Service Title</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    placeholder="e.g. Web Development"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="input-label">Description</label>
                                <textarea
                                    required
                                    className="input-field min-h-[100px] py-3"
                                    placeholder="Brief description of the service..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="border border-white/5 rounded-lg p-4 bg-white/5 space-y-4">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Base Package</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="input-label">Price (BDT)</label>
                                        <input
                                            type="number"
                                            required
                                            className="input-field"
                                            placeholder="৳ 50,000"
                                            value={formData.basePriceBDT}
                                            onChange={(e) => setFormData({ ...formData, basePriceBDT: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label">Price (USD)</label>
                                        <input
                                            type="number"
                                            required
                                            className="input-field"
                                            placeholder="$ 500"
                                            value={formData.basePriceUSD}
                                            onChange={(e) => setFormData({ ...formData, basePriceUSD: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border border-white/5 rounded-lg p-4 bg-white/5 space-y-4">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Medium Package</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="input-label">Price (BDT)</label>
                                        <input
                                            type="number"
                                            required
                                            className="input-field"
                                            placeholder="৳ 80,000"
                                            value={formData.mediumPriceBDT}
                                            onChange={(e) => setFormData({ ...formData, mediumPriceBDT: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label">Price (USD)</label>
                                        <input
                                            type="number"
                                            required
                                            className="input-field"
                                            placeholder="$ 800"
                                            value={formData.mediumPriceUSD}
                                            onChange={(e) => setFormData({ ...formData, mediumPriceUSD: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border border-white/5 rounded-lg p-4 bg-white/5 space-y-4">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Pro Package</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="input-label">Price (BDT)</label>
                                        <input
                                            type="number"
                                            required
                                            className="input-field"
                                            placeholder="৳ 120,000"
                                            value={formData.proPriceBDT}
                                            onChange={(e) => setFormData({ ...formData, proPriceBDT: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label">Price (USD)</label>
                                        <input
                                            type="number"
                                            required
                                            className="input-field"
                                            placeholder="$ 1,200"
                                            value={formData.proPriceUSD}
                                            onChange={(e) => setFormData({ ...formData, proPriceUSD: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingService(null);
                                    }}
                                    className="btn-outline flex-1"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-brand flex-1">
                                    {editingService ? "Update Service" : "Create Service"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
