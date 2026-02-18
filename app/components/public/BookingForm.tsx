"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
    serviceId: z.string().min(1, "Please select a service"),
    budget: z.number().min(100, "Budget must be at least 100"),
    clientName: z.string().min(2, "Name is required"),
    clientEmail: z.string().email("Invalid email address"),
    message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function BookingForm() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                console.error("Booking failed");
            }
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
                        <div
                            className="h-full bg-agency-accent transition-all duration-500"
                            style={{ width: `${(step / 2) * 100}%` }}
                        />
                    </div>

                    <div className="space-y-6">
                        {step === 1 && (
                            <div className="animate-fade-in-up space-y-6">
                                <div>
                                    <label className="input-label">Select Service</label>
                                    <select {...register("serviceId")} className="input-field">
                                        <option value="">Select a service...</option>
                                        <option value="1">Web Application Development</option>
                                        <option value="2">UI/UX Design</option>
                                        <option value="3">Mobile App Development</option>
                                        <option value="4">API Integration</option>
                                    </select>
                                    {errors.serviceId && <span className="text-red-500 text-sm mt-1">{errors.serviceId.message}</span>}
                                </div>

                                <div>
                                    <label className="input-label">Estimated Budget (USD)</label>
                                    <input
                                        type="number"
                                        {...register("budget", { valueAsNumber: true })}
                                        className="input-field"
                                        placeholder="e.g. 5000"
                                    />
                                    {errors.budget && <span className="text-red-500 text-sm mt-1">{errors.budget.message}</span>}
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="btn-brand"
                                    >
                                        Next Step
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
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
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-brand"
                                    >
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
