"use client";

import { useEffect, useState } from "react";
import { Service, SubCategory } from "@prisma/client";

type SubCategoryWithPricing = SubCategory;
type ServiceWithSubs = Service & { subCategories: SubCategoryWithPricing[] };

const emptySubForm = {
    title: "",
    description: "",
    imageUrl: "",
    basePriceBDT: "",
    basePriceUSD: "",
    mediumPriceBDT: "",
    mediumPriceUSD: "",
    proPriceBDT: "",
    proPriceUSD: "",
};

export default function AdminServicesPage() {
    const [services, setServices] = useState<ServiceWithSubs[]>([]);
    const [loading, setLoading] = useState(true);

    // Service CRUD
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceWithSubs | null>(null);
    const [deletingService, setDeletingService] = useState<ServiceWithSubs | null>(null);
    const [serviceForm, setServiceForm] = useState({ title: "", description: "" });

    // Sub-category CRUD
    const [subModalFor, setSubModalFor] = useState<string | null>(null); // serviceId
    const [editingSub, setEditingSub] = useState<SubCategoryWithPricing | null>(null);
    const [subForm, setSubForm] = useState(emptySubForm);
    const [deletingSub, setDeletingSub] = useState<SubCategoryWithPricing | null>(null);

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (editingService) {
            setServiceForm({ title: editingService.title, description: editingService.description });
        } else {
            setServiceForm({ title: "", description: "" });
        }
    }, [editingService, isServiceModalOpen]);

    useEffect(() => {
        if (editingSub) {
            setSubForm({
                title: editingSub.title,
                description: editingSub.description ?? "",
                imageUrl: editingSub.imageUrl ?? "",
                basePriceBDT: editingSub.basePriceBDT.toString(),
                basePriceUSD: editingSub.basePriceUSD.toString(),
                mediumPriceBDT: editingSub.mediumPriceBDT.toString(),
                mediumPriceUSD: editingSub.mediumPriceUSD.toString(),
                proPriceBDT: editingSub.proPriceBDT.toString(),
                proPriceUSD: editingSub.proPriceUSD.toString(),
            });
        } else {
            setSubForm(emptySubForm);
        }
    }, [editingSub, subModalFor]);

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

    async function handleServiceSubmit(e: React.FormEvent) {
        e.preventDefault();
        const url = editingService ? `/api/admin/services/${editingService.id}` : "/api/admin/services";
        const method = editingService ? "PUT" : "POST";
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(serviceForm),
        });
        if (res.ok) {
            setIsServiceModalOpen(false);
            setEditingService(null);
            fetchServices();
        } else {
            alert("Failed to save service");
        }
    }

    async function handleServiceDelete() {
        if (!deletingService) return;
        const res = await fetch(`/api/admin/services/${deletingService.id}`, { method: "DELETE" });
        if (res.ok) {
            setDeletingService(null);
            fetchServices();
        } else alert("Failed to delete service");
    }

    async function toggleStatus(service: ServiceWithSubs) {
        const newStatus = service.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        setServices(services.map(s => s.id === service.id ? { ...s, status: newStatus } : s));
        await fetch(`/api/admin/services/${service.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
    }

    async function handleSubSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload = {
            ...subForm,
            serviceId: subModalFor,
            basePriceBDT: parseFloat(subForm.basePriceBDT) || 0,
            basePriceUSD: parseFloat(subForm.basePriceUSD) || 0,
            mediumPriceBDT: parseFloat(subForm.mediumPriceBDT) || 0,
            mediumPriceUSD: parseFloat(subForm.mediumPriceUSD) || 0,
            proPriceBDT: parseFloat(subForm.proPriceBDT) || 0,
            proPriceUSD: parseFloat(subForm.proPriceUSD) || 0,
        };

        const url = editingSub ? `/api/admin/subcategories/${editingSub.id}` : "/api/admin/subcategories";
        const method = editingSub ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            setSubModalFor(null);
            setEditingSub(null);
            fetchServices();
        } else {
            alert("Failed to save sub-service");
        }
    }

    async function handleSubDelete() {
        if (!deletingSub) return;
        const res = await fetch(`/api/admin/subcategories/${deletingSub.id}`, { method: "DELETE" });
        if (res.ok) {
            setDeletingSub(null);
            fetchServices();
        } else alert("Failed to delete sub-service");
    }

    const pricingField = (label: string, bdtKey: keyof typeof subForm, usdKey: keyof typeof subForm) => (
        <div className="border border-white/5 rounded-lg p-4 bg-white/5 space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</h4>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="input-label">Price (BDT)</label>
                    <input type="number" min="0" className="input-field" placeholder="৳" value={subForm[bdtKey]}
                        onChange={(e) => setSubForm({ ...subForm, [bdtKey]: e.target.value })} />
                </div>
                <div>
                    <label className="input-label">Price (USD)</label>
                    <input type="number" min="0" className="input-field" placeholder="$" value={subForm[usdKey]}
                        onChange={(e) => setSubForm({ ...subForm, [usdKey]: e.target.value })} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold font-display">Services Management</h1>
                <button
                    onClick={() => { setEditingService(null); setIsServiceModalOpen(true); }}
                    className="btn-brand w-full sm:w-auto"
                >
                    + Add New Service
                </button>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading services...</div>
                ) : services.map((service) => (
                    <div key={service.id} className="glass-panel rounded-xl border border-white/5 overflow-hidden">
                        {/* Service Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 border-b border-white/5">
                            <div>
                                <div className="font-bold text-lg">{service.title}</div>
                                <div className="text-sm text-gray-400 mt-1">{service.description}</div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <button
                                    onClick={() => toggleStatus(service)}
                                    className={`text-xs px-2 py-1 rounded border transition-colors ${service.status === "ACTIVE"
                                        ? "border-green-500/30 text-green-400 bg-green-500/10 hover:bg-green-500/20"
                                        : "border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20"
                                        }`}
                                >
                                    {service.status}
                                </button>
                                <button
                                    onClick={() => { setEditingService(service); setIsServiceModalOpen(true); }}
                                    className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setDeletingService(service)}
                                    className="text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-wider"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* Sub-services Table */}
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
                                    Sub-services ({service.subCategories.length})
                                </span>
                                <button
                                    onClick={() => { setEditingSub(null); setSubModalFor(service.id); }}
                                    className="text-[10px] uppercase font-bold text-agency-accent hover:underline"
                                >
                                    + Add Sub-service
                                </button>
                            </div>

                            {service.subCategories.length === 0 ? (
                                <div className="text-sm text-gray-600 italic py-2">No sub-services yet. Add one to define pricing tiers.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="text-left py-2 pr-4 text-[10px] uppercase text-gray-500 font-bold tracking-wide">Sub-service</th>
                                                <th className="text-right py-2 px-4 text-[10px] uppercase text-gray-500 font-bold tracking-wide">Basic</th>
                                                <th className="text-right py-2 px-4 text-[10px] uppercase text-gray-500 font-bold tracking-wide">Plus</th>
                                                <th className="text-right py-2 px-4 text-[10px] uppercase text-gray-500 font-bold tracking-wide">Pro</th>
                                                <th className="text-right py-2 text-[10px] uppercase text-gray-500 font-bold tracking-wide">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {service.subCategories.map(sub => (
                                                <tr key={sub.id} className="border-b border-white/5 last:border-0 group hover:bg-white/[0.02]">
                                                    <td className="py-3 pr-4">
                                                        <div className="flex items-center gap-2">
                                                            {sub.imageUrl && (
                                                                <img src={sub.imageUrl} alt="" className="w-5 h-5 rounded object-cover" />
                                                            )}
                                                            <div>
                                                                <div className="font-medium">{sub.title}</div>
                                                                {sub.description && <div className="text-[10px] text-gray-500">{sub.description}</div>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <div className="font-medium">৳{sub.basePriceBDT.toLocaleString()}</div>
                                                        <div className="text-[10px] text-gray-500">${sub.basePriceUSD}</div>
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <div className="font-medium">৳{sub.mediumPriceBDT.toLocaleString()}</div>
                                                        <div className="text-[10px] text-gray-500">${sub.mediumPriceUSD}</div>
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <div className="font-medium">৳{sub.proPriceBDT.toLocaleString()}</div>
                                                        <div className="text-[10px] text-gray-500">${sub.proPriceUSD}</div>
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => { setEditingSub(sub); setSubModalFor(service.id); }}
                                                                className="text-xs font-bold text-gray-400 hover:text-white uppercase"
                                                            >Edit</button>
                                                            <button
                                                                onClick={() => setDeletingSub(sub)}
                                                                className="text-xs font-bold text-red-400 hover:text-red-300 uppercase"
                                                            >Delete</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Service Form Modal */}
            {isServiceModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-lg rounded-xl animate-fade-in-up">
                        <div className="p-8 pb-4 border-b border-white/5">
                            <h2 className="text-2xl font-bold">{editingService ? "Edit Service" : "Add New Service"}</h2>
                        </div>
                        <form id="service-form" onSubmit={handleServiceSubmit} className="p-8 pt-4 space-y-4">
                            <div>
                                <label className="input-label">Service Title</label>
                                <input type="text" required className="input-field" placeholder="e.g. Digital Marketing"
                                    value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="input-label">Description</label>
                                <textarea required className="input-field min-h-[100px] py-3" placeholder="Brief description..."
                                    value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} />
                            </div>
                            <p className="text-xs text-gray-500 bg-white/5 rounded-lg px-4 py-3">
                                💡 Pricing tiers (Basic / Plus / Pro) are set individually on each sub-service below.
                            </p>
                        </form>
                        <div className="p-8 pt-0 flex gap-4">
                            <button type="button" onClick={() => { setIsServiceModalOpen(false); setEditingService(null); }} className="btn-outline flex-1">Cancel</button>
                            <button form="service-form" type="submit" className="btn-brand flex-1">
                                {editingService ? "Update Service" : "Create Service"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sub-service Form Modal */}
            {subModalFor && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-lg rounded-xl animate-fade-in-up flex flex-col max-h-[90vh]">
                        <div className="p-8 pb-4 border-b border-white/5">
                            <h2 className="text-2xl font-bold">{editingSub ? "Edit Sub-service" : "Add Sub-service"}</h2>
                            <p className="text-sm text-gray-400 mt-1">Define Basic, Plus, and Pro pricing for this sub-service.</p>
                        </div>
                        <div className="p-8 pt-4 overflow-y-auto flex-1 custom-scrollbar">
                            <form id="sub-form" onSubmit={handleSubSubmit} className="space-y-4">
                                <div>
                                    <label className="input-label">Sub-service Title</label>
                                    <input type="text" required className="input-field" placeholder="e.g. Facebook Marketing"
                                        value={subForm.title} onChange={(e) => setSubForm({ ...subForm, title: e.target.value })} />
                                </div>
                                <div>
                                    <label className="input-label">Description (optional)</label>
                                    <input type="text" className="input-field" placeholder="Short description..."
                                        value={subForm.description} onChange={(e) => setSubForm({ ...subForm, description: e.target.value })} />
                                </div>
                                <div>
                                    <label className="input-label">Image URL (optional)</label>
                                    <input type="text" className="input-field" placeholder="https://..."
                                        value={subForm.imageUrl} onChange={(e) => setSubForm({ ...subForm, imageUrl: e.target.value })} />
                                </div>
                                {pricingField("Basic Package", "basePriceBDT", "basePriceUSD")}
                                {pricingField("Plus Package", "mediumPriceBDT", "mediumPriceUSD")}
                                {pricingField("Pro Package", "proPriceBDT", "proPriceUSD")}
                            </form>
                        </div>
                        <div className="p-8 pt-4 border-t border-white/5 flex gap-4">
                            <button type="button" onClick={() => { setSubModalFor(null); setEditingSub(null); }} className="btn-outline flex-1">Cancel</button>
                            <button form="sub-form" type="submit" className="btn-brand flex-1">
                                {editingSub ? "Update Sub-service" : "Create Sub-service"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Service Confirmation */}
            {deletingService && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-md p-8 rounded-xl animate-fade-in-up border border-red-500/20">
                        <h2 className="text-xl font-bold mb-2">Delete Service?</h2>
                        <p className="text-gray-400 mb-6 text-sm">
                            Are you sure you want to delete <span className="text-white font-semibold">"{deletingService.title}"</span>?
                            This will also delete all <span className="text-white font-semibold">{deletingService.subCategories.length} sub-services</span>. This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeletingService(null)} className="btn-outline flex-1">Cancel</button>
                            <button onClick={handleServiceDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex-1">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Sub-service Confirmation */}
            {deletingSub && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-md p-8 rounded-xl animate-fade-in-up border border-red-500/20">
                        <h2 className="text-xl font-bold mb-2">Delete Sub-service?</h2>
                        <p className="text-gray-400 mb-6 text-sm">
                            Are you sure you want to delete <span className="text-white font-semibold">"{deletingSub.title}"</span>?
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeletingSub(null)} className="btn-outline flex-1">Cancel</button>
                            <button onClick={handleSubDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex-1">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
