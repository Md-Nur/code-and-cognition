"use client";

import { useEffect, useState } from "react";
import { Service } from "@prisma/client";
import ImageUpload from "@/app/components/admin/ImageUpload";

const emptySubForm = {
    title: "",
    slug: "",
    description: "",
    imageUrl: "",
    basePriceBDT: "",
    basePriceUSD: "",
    mediumPriceBDT: "",
    mediumPriceUSD: "",
    proPriceBDT: "",
    proPriceUSD: "",
    mediumDescription: "",
    proDescription: "",
};

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export default function AdminServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    // Service CRUD
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [deletingService, setDeletingService] = useState<Service | null>(null);
    const [serviceForm, setServiceForm] = useState({ title: "", slug: "", description: "", thumbnailUrl: "" });

    // Sub-category CRUD
    const [subModalFor, setSubModalFor] = useState<string | null>(null); // serviceId
    const [subForm, setSubForm] = useState(emptySubForm);

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (editingService) {
            setServiceForm({
                title: editingService.title,
                slug: editingService.slug,
                description: editingService.description,
                thumbnailUrl: editingService.thumbnailUrl ?? ""
            });
        } else {
            setServiceForm({ title: "", slug: "", description: "", thumbnailUrl: "" });
        }
    }, [editingService, isServiceModalOpen]);


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


    }

    const pricingField = (label: string, bdtKey: keyof typeof subForm, usdKey: keyof typeof subForm, descKey?: keyof typeof subForm) => (
        <div className="border border-white/5 rounded-lg p-4 bg-white/5 space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            {descKey && (
                <div>
                    <label className="input-label">Package Description</label>
                    <textarea
                        className="input-field min-h-[80px] py-3"
                        placeholder="What's included in this package..."
                        value={subForm[descKey]}
                        onChange={(e) => setSubForm({ ...subForm, [descKey]: e.target.value })}
                    />
                </div>
            )}
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
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
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

                    </div>
                ))}
            </div>

            {/* Service Form Modal */}
            {isServiceModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-lg rounded-xl animate-fade-in-up">
                        <div className="p-4 sm:p-8 pb-4 border-b border-white/5">
                            <h2 className="text-xl sm:text-2xl font-bold">{editingService ? "Edit Service" : "Add New Service"}</h2>
                        </div>
                        <form id="service-form" onSubmit={handleServiceSubmit} className="p-4 sm:p-8 pt-4 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="input-label">Service Title</label>
                                    <input type="text" required className="input-field" placeholder="e.g. Digital Marketing"
                                        value={serviceForm.title}
                                        onChange={(e) => {
                                            const newTitle = e.target.value;
                                            setServiceForm(prev => ({
                                                ...prev,
                                                title: newTitle,
                                                slug: editingService ? prev.slug : slugify(newTitle)
                                            }));
                                        }} />
                                </div>
                                <div>
                                    <label className="input-label">Slug</label>
                                    <input type="text" required className="input-field" placeholder="e.g. digital-marketing"
                                        value={serviceForm.slug}
                                        onChange={(e) => setServiceForm({ ...serviceForm, slug: slugify(e.target.value) })} />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Description</label>
                                <textarea required className="input-field min-h-[100px] py-3" placeholder="Brief description..."
                                    value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} />
                            </div>
                            <ImageUpload
                                label="Thumbnail Image"
                                value={serviceForm.thumbnailUrl}
                                onChange={(url) => setServiceForm({ ...serviceForm, thumbnailUrl: url })}
                                description="This image will represent the service category."
                            />
                            <p className="text-xs text-gray-500 bg-white/5 rounded-lg px-4 py-3">
                                💡 Pricing tiers (Basic / Plus / Pro) are set individually on each sub-service below.
                            </p>
                        </form>
                        <div className="p-4 sm:p-8 pt-0 flex gap-4">
                            <button type="button" onClick={() => { setIsServiceModalOpen(false); setEditingService(null); }} className="btn-outline flex-1">Cancel</button>
                            <button form="service-form" type="submit" className="btn-brand flex-1">
                                {editingService ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sub-service Form Modal */}
            {subModalFor && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-lg rounded-xl animate-fade-in-up flex flex-col max-h-[90vh]">
                        <div className="p-4 sm:p-8 pb-4 border-b border-white/5">
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">Define Basic, Plus, and Pro pricing for this sub-service.</p>
                        </div>
                        <div className="p-4 sm:p-8 pt-4 overflow-y-auto flex-1 custom-scrollbar">
                            <form id="sub-form" onSubmit={handleSubSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="input-label">Sub-service Title</label>
                                        <input type="text" required className="input-field" placeholder="e.g. Facebook Marketing"
                                            value={subForm.title}
                                            onChange={(e) => {
                                                const newTitle = e.target.value;
                                                setSubForm(prev => ({
                                                    ...prev,
                                                    title: newTitle,
                                                }));
                                            }} />
                                    </div>
                                    <div>
                                        <label className="input-label">Slug</label>
                                        <input type="text" required className="input-field" placeholder="e.g. facebook-marketing"
                                            value={subForm.slug}
                                            onChange={(e) => setSubForm({ ...subForm, slug: slugify(e.target.value) })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="input-label">Description (Basic Package)</label>
                                    <textarea
                                        className="input-field min-h-[100px] py-3"
                                        placeholder="What's included in the basic package..."
                                        value={subForm.description}
                                        onChange={(e) => setSubForm({ ...subForm, description: e.target.value })}
                                    />
                                </div>
                                <ImageUpload
                                    label="Sub-service Image"
                                    value={subForm.imageUrl}
                                    onChange={(url) => setSubForm({ ...subForm, imageUrl: url })}
                                    description="Visual representation for this specific sub-service."
                                />
                                {pricingField("Basic Package Price", "basePriceBDT", "basePriceUSD")}
                                {pricingField("Plus Package", "mediumPriceBDT", "mediumPriceUSD", "mediumDescription")}
                                {pricingField("Pro Package", "proPriceBDT", "proPriceUSD", "proDescription")}
                            </form>
                        </div>

                    </div>
                </div>
            )}

            {/* Delete Service Confirmation */}
            {deletingService && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-md p-8 rounded-xl animate-fade-in-up border border-red-500/20">
                        <h2 className="text-xl font-bold mb-2">Delete Service?</h2>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={() => setDeletingService(null)} className="btn-outline flex-1">Cancel</button>
                            <button onClick={handleServiceDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex-1">Delete</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
