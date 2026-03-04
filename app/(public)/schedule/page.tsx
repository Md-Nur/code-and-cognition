"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBookingAction } from "@/app/actions/bookings";
import { getUserCountry } from "@/app/actions/geo";
import { trackLead } from "@/lib/analytics";
import CalendlyEmbed from "./_components/CalendlyEmbed";
import { ArrowRight, Building2, CheckCircle2, ChevronRight, Mail, Phone, Target, User } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
    clientName: z.string().min(1, "Name is required"),
    clientEmail: z.string().email("Invalid email address"),
    clientPhone: z.string()
        .min(1, "Phone number is required")
        .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-s./0-9]*$/, "Invalid phone number format"),
    discovery: z.object({
        companyName: z.string().min(1, "Company name is required"),
        industry: z.string().min(1, "Industry is required"),
        revenueRange: z.string().optional(),
        budgetRange: z.string().min(1, "Budget range is required"),
        problemStatement: z.string().min(10, "Please briefly describe the core challenge (min 10 characters)"),
        timeline: z.string().min(1, "Timeline is required"),
        additionalNotes: z.string().optional(),
    }),
});

type FormValues = z.infer<typeof formSchema>;

const REVENUE_RANGES_USD = [
    "Pre-revenue / Seed",
    "$0 - $500k",
    "$500k - $2M",
    "$2M - $5M",
    "$5M - $20M",
    "$20M+",
];

const REVENUE_RANGES_BDT = [
    "Pre-revenue / Seed",
    "৳0 - ৳5L",
    "৳5L - ৳20L",
    "৳20L - ৳50L",
    "৳50L - ৳2Cr",
    "৳2Cr+",
];

const BUDGET_RANGES_USD = [
    "Under $5k",
    "$5k - $15k",
    "$15k - $50k",
    "$50k - $100k",
    "$100k+",
    "To be determined",
];

const BUDGET_RANGES_BDT = [
    "Under ৳50k",
    "৳50k - ৳1.5L",
    "৳1.5L - ৳5L",
    "৳5L - ৳10L",
    "৳10L+",
    "To be determined",
];

const TIMELINES = [
    "Immediately",
    "Within 1 month",
    "1-3 months",
    "3-6 months",
    "Just exploring",
];

export default function SchedulePage() {
    const [isSuccess, setIsSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [currency, setCurrency] = useState<'USD' | 'BDT'>('USD');

    useEffect(() => {
        const detectCountry = async () => {
            try {
                const country = await getUserCountry();
                if (country === 'BD') {
                    setCurrency('BDT');
                }
            } catch (error) {
                alert("Failed to detect country");
            }
        };
        detectCountry();
    }, []);

    const revenueRanges = currency === 'BDT' ? REVENUE_RANGES_BDT : REVENUE_RANGES_USD;
    const budgetRanges = currency === 'BDT' ? BUDGET_RANGES_BDT : BUDGET_RANGES_USD;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormValues) => {
        setServerError(null);
        try {
            const result = await createBookingAction(data);
            if (result.ok) {
                trackLead();
                setIsSuccess(true);
            } else {
                setServerError("Failed to submit request. Please try again.");
            }
        } catch (error) {
            setServerError("An unexpected error occurred.");
        }
    };

    useEffect(() => {
        if (isSuccess) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [isSuccess]);

    if (isSuccess) {
        return (
            <main className="min-h-screen pt-32 pb-24 bg-agency-black">
                <div className="container mx-auto px-1 md:px-6 max-w-4xl">
                    <div className="premium-card p-2 md:p-12 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-4">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight px-4">
                            Request Received
                        </h1>
                        <p className="text-lg text-base-content/70 max-w-2xl mx-auto px-4">
                            Thank you for providing your details. Please select a time below to schedule our strategic consultation call.
                        </p>

                        <div className="mt-8 rounded-2xl overflow-hidden">
                            <CalendlyEmbed url="https://calendly.com/codencognition-bd/cosultation-of-code-cognition" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-24 lg:pt-32 pb-24 bg-agency-black selection:bg-agency-accent/30">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-24 items-start">

                    {/* Left Column: Context & Value Prop */}
                    <div className="space-y-8 lg:sticky lg:top-32">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                                <Target className="w-4 h-4" />
                                <span>By Application Only</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                                Schedule a Strategic Consultation
                            </h1>
                            <p className="text-lg">
                                We partner with ambitious companies to build intelligent, scalable digital platforms. This application helps us understand your current challenges and ensures we provide maximum value during our call.
                            </p>
                        </div>

                        <hr className="border-base-300" />

                        <div className="space-y-6">
                            <h3 className="font-semibold text-lg">What to expect:</h3>
                            <ul className="space-y-4">
                                {[
                                    "Deep-dive into your current technological bottlenecks",
                                    "Assessment of potential ROI for digital transformation",
                                    "Initial mapping of strategic solutions and automation paths",
                                    "Clear understanding of our engagement model and process",
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 items-start">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                            <ChevronRight className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="text-gray-400">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="premium-card p-8 md:p-12">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                            {serverError && (
                                <div className="p-4 rounded-xl bg-error/10 text-error text-sm font-medium">
                                    {serverError}
                                </div>
                            )}

                            {/* Personal Details */}
                            <div className="space-y-8">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    Your Details
                                </h3>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-gray-400">Full Name *</label>
                                        <input
                                            {...register("clientName")}
                                            className="input-field"
                                            placeholder="John Doe"
                                        />
                                        {errors.clientName && <p className="text-error text-xs">{errors.clientName.message}</p>}
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-gray-400">Work Email *</label>
                                        <input
                                            {...register("clientEmail")}
                                            type="email"
                                            className="input-field"
                                            placeholder="john@company.com"
                                        />
                                        {errors.clientEmail && <p className="text-error text-xs">{errors.clientEmail.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-3 max-w-md">
                                    <label className="text-sm font-medium text-gray-400">Phone Number</label>
                                    <input
                                        {...register("clientPhone")}
                                        type="tel"
                                        className="input-field"
                                        placeholder={currency === 'BDT' ? "+880 1XXX-XXXXXX" : "+1 (555) 000-0000"}
                                        onKeyPress={(e) => {
                                            if (!/[0-9+\-() ]/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    {errors.clientPhone && <p className="text-error text-xs">{errors.clientPhone.message}</p>}
                                </div>
                            </div>

                            <hr className="border-base-300" />

                            {/* Company Details */}
                            <div className="space-y-8">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-primary" />
                                    Company Overview
                                </h3>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-gray-400">Company Name *</label>
                                        <input
                                            {...register("discovery.companyName")}
                                            className="input-field"
                                            placeholder="Acme Corp"
                                        />
                                        {errors.discovery?.companyName && <p className="text-error text-xs">{errors.discovery.companyName.message}</p>}
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-gray-400">Industry *</label>
                                        <input
                                            {...register("discovery.industry")}
                                            className="input-field"
                                            placeholder="e.g. Fintech, Healthcare"
                                        />
                                        {errors.discovery?.industry && <p className="text-error text-xs">{errors.discovery.industry.message}</p>}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-gray-400">Annual Revenue (Optional)</label>
                                        <select
                                            {...register("discovery.revenueRange")}
                                            className="input-field appearance-none"
                                            defaultValue=""
                                        >
                                            <option value="" disabled className="bg-agency-black">Select range</option>
                                            {revenueRanges.map(r => <option key={r} value={r} className="bg-agency-black">{r}</option>)}
                                        </select>
                                        {errors.discovery?.revenueRange && <p className="text-error text-xs">{errors.discovery.revenueRange.message}</p>}
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-gray-400">Estimated Budget *</label>
                                        <select
                                            {...register("discovery.budgetRange")}
                                            className="input-field appearance-none"
                                            defaultValue=""
                                        >
                                            <option value="" disabled className="bg-agency-black">Select budget</option>
                                            {budgetRanges.map(r => <option key={r} value={r} className="bg-agency-black">{r}</option>)}
                                        </select>
                                        {errors.discovery?.budgetRange && <p className="text-error text-xs">{errors.discovery.budgetRange.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-400">What is the primary technical or business problem you are trying to solve? *</label>
                                    <textarea
                                        {...register("discovery.problemStatement")}
                                        className="input-field min-h-[120px] resize-y"
                                        placeholder="Describe your current bottlenecks, challenges, or goals..."
                                    />
                                    {errors.discovery?.problemStatement && <p className="text-error text-xs">{errors.discovery.problemStatement.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-400">Desired Timeline *</label>
                                    <select
                                        {...register("discovery.timeline")}
                                        className="input-field appearance-none"
                                        defaultValue=""
                                    >
                                        <option value="" disabled className="bg-agency-black">Select timeline</option>
                                        {TIMELINES.map(r => <option key={r} value={r} className="bg-agency-black">{r}</option>)}
                                    </select>
                                    {errors.discovery?.timeline && <p className="text-error text-xs">{errors.discovery.timeline.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-400">Anything else we should know? (Optional)</label>
                                    <textarea
                                        {...register("discovery.additionalNotes")}
                                        className="input-field min-h-[100px] resize-y"
                                        placeholder="Specific technologies in mind, constraints, etc."
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-brand w-full h-14 text-lg group relative overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {isSubmitting ? "Submitting..." : "Apply for Consultation"}
                                        {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                    </span>
                                </button>
                                <p className="text-xs text-center text-base-content/50 mt-4">
                                    Upon submission, you will be directed to our calendar to pick a time slot.
                                </p>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </main>
    );
}
