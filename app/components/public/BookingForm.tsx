"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
    subCategoryId: z.string().min(1, "Please select a service package"),
    budget: z.number().min(100, "Budget must be at least 100"),
    clientName: z.string().min(2, "Name is required"),
    clientEmail: z.string().email("Invalid email address"),
    message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type SubCategory = {
    id: string;
    title: string;
    basePriceBDT: number;
    mediumPriceBDT: number;
    proPriceBDT: number;
};

type Service = {
    id: string;
    title: string;
    subCategories: SubCategory[];
};

export default function BookingForm() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedServiceId, setSelectedServiceId] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        fetch("/api/services")
            .then(r => r.json())
            .then(data => setServices(Array.isArray(data) ? data : []));
    }, []);

    const selectedService = services.find(s => s.id === selectedServiceId);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    serviceId: selectedServiceId,
                }),
            });
            if (res.ok) setIsSuccess(true);
            else console.error("Booking failed");
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-md mx-auto text-center p-8 glass-panel rounded-2xl animate-fade-in-up">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Request Received!</h3>
                <p className="text-gray-400">
                    Thank you for reaching out. Our team will review your project and get back to you within 24 hours.
                </p>
            </div>
        );
    }

    return (
        <section id="contact" className="section-container py-20">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <span className="section-tag mb-4">Start a Project</span>
                    <h2 className="text-4xl font-bold tracking-tight">Let's Build Something Amazing</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-8 md:p-12 rounded-2xl relative overflow-hidden">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                        <div className="h-full bg-agency-accent transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
                    </div>

                    <div className="space-y-6">
                        {/* Step 1: Select Main Service */}
                        {step === 1 && (
                            <div className="animate-fade-in-up space-y-6">
                                <div>
                                    <label className="input-label">Select Service Category</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                        {services.map(srv => (
                                            <button
                                                type="button"
                                                key={srv.id}
                                                onClick={() => { setSelectedServiceId(srv.id); }}
                                                className={`text-left p-4 rounded-xl border transition-all ${selectedServiceId === srv.id
                                                    ? "border-agency-accent bg-agency-accent/10 text-white"
                                                    : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20"
                                                    }`}
                                            >
                                                <div className="font-semibold text-sm">{srv.title}</div>
                                                <div className="text-[11px] text-gray-500 mt-1">{srv.subCategories.length} packages</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="button"
                                        disabled={!selectedServiceId}
                                        onClick={() => setStep(2)}
                                        className="btn-brand disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Next Step →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Select Sub-service Package */}
                        {step === 2 && selectedService && (
                            <div className="animate-fade-in-up space-y-6">
                                <div>
                                    <label className="input-label">{selectedService.title} — Select Package</label>
                                    <div className="space-y-3 mt-2">
                                        {selectedService.subCategories.map(sub => (
                                            <label key={sub.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 cursor-pointer has-[:checked]:border-agency-accent has-[:checked]:bg-agency-accent/10 transition-all">
                                                <input
                                                    type="radio"
                                                    value={sub.id}
                                                    {...register("subCategoryId")}
                                                    className="accent-agency-accent"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-semibold text-sm">{sub.title}</div>
                                                    <div className="text-[11px] text-gray-500 mt-0.5">
                                                        Basic ৳{sub.basePriceBDT.toLocaleString()} / Plus ৳{sub.mediumPriceBDT.toLocaleString()} / Pro ৳{sub.proPriceBDT.toLocaleString()}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.subCategoryId && <span className="text-red-500 text-sm mt-1">{errors.subCategoryId.message}</span>}
                                </div>

                                <div>
                                    <label className="input-label">Estimated Budget (BDT)</label>
                                    <input
                                        type="number"
                                        {...register("budget", { valueAsNumber: true })}
                                        className="input-field"
                                        placeholder="e.g. 50000"
                                    />
                                    {errors.budget && <span className="text-red-500 text-sm mt-1">{errors.budget.message}</span>}
                                </div>

                                <div className="pt-4 flex justify-between items-center">
                                    <button type="button" onClick={() => setStep(1)} className="text-gray-400 hover:text-white transition-colors">← Back</button>
                                    <button type="button" onClick={() => setStep(3)} className="btn-brand">Next Step →</button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Contact Info */}
                        {step === 3 && (
                            <div className="animate-fade-in-up space-y-6">
                                <div>
                                    <label className="input-label">Your Name</label>
                                    <input {...register("clientName")} className="input-field" placeholder="John Doe" />
                                    {errors.clientName && <span className="text-red-500 text-sm mt-1">{errors.clientName.message}</span>}
                                </div>

                                <div>
                                    <label className="input-label">Email Address</label>
                                    <input {...register("clientEmail")} className="input-field" placeholder="john@example.com" />
                                    {errors.clientEmail && <span className="text-red-500 text-sm mt-1">{errors.clientEmail.message}</span>}
                                </div>

                                <div>
                                    <label className="input-label">Project Details (Optional)</label>
                                    <textarea
                                        {...register("message")}
                                        className="input-field min-h-[120px]"
                                        placeholder="Tell us more about your vision..."
                                    />
                                </div>

                                <div className="pt-4 flex justify-between items-center">
                                    <button type="button" onClick={() => setStep(2)} className="text-gray-400 hover:text-white transition-colors">← Back</button>
                                    <button type="submit" disabled={isSubmitting} className="btn-brand">
                                        {isSubmitting ? "Submitting..." : "Submit Request"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </section>
    );
}
