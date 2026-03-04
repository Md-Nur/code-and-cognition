"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft, Hash, Monitor, Shield, Trophy, Image, Layers, AtSign, LayoutGrid } from "lucide-react";
import { createCaseStudy, updateCaseStudy } from "@/app/actions/casestudy";
import { MarkdownEditor } from "./MarkdownEditor";
import ImageUpload from "@/app/components/admin/ImageUpload";

const caseStudySchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
    industry: z.string().min(1, "Industry is required"),
    clientName: z.string().optional(),
    summary: z.string().min(1, "Summary is required"),
    challenge: z.string().min(1, "Challenge is required"),
    approach: z.string().min(1, "Approach is required"),
    solution: z.string().min(1, "Solution is required"),
    results: z.string().min(1, "Results is required"),
    highlightMetric: z.string().optional(),
    techStack: z.string().min(1, "Tech stack is required"),
    coverImage: z.string().optional(),
    architectureImage: z.string().optional(),
    projectUrl: z.string().url().optional().or(z.literal("")),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
    publishDate: z.string().optional(),
    isFeatured: z.boolean().default(false),
});

type CaseStudyFormValues = z.infer<typeof caseStudySchema>;

interface CaseStudyFormProps {
    initialData?: any; // any to avoid complex nested Prisma types for now
    isEditing?: boolean;
}

export function CaseStudyForm({ initialData, isEditing }: CaseStudyFormProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<CaseStudyFormValues>({
        resolver: zodResolver(caseStudySchema) as any,
        defaultValues: {
            title: initialData?.title || "",
            slug: initialData?.slug || "",
            industry: initialData?.industry || "",
            clientName: initialData?.clientName || "",
            summary: initialData?.summary || "",
            challenge: initialData?.challenge || "",
            approach: initialData?.approach || "",
            solution: initialData?.solution || "",
            results: initialData?.results || "",
            highlightMetric: initialData?.highlightMetric || "",
            techStack: initialData?.techStack?.join(", ") || "",
            coverImage: initialData?.coverImage || "",
            architectureImage: initialData?.architectureImage || "",
            projectUrl: initialData?.projectUrl || "",
            status: initialData?.status || "DRAFT",
            publishDate: initialData?.publishDate ? new Date(initialData.publishDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            isFeatured: initialData?.isFeatured || false,
        },
    });

    const { formState: { isSubmitting } } = form;

    const generateSlug = () => {
        const title = form.getValues("title");
        if (title) {
            const slug = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
            form.setValue("slug", slug, { shouldValidate: true });
        }
    };

    async function onSubmit(data: CaseStudyFormValues) {
        setError(null);
        try {
            // Transform techStack string to array for the server
            // Transform publishDate string to Date object
            const payload: any = {
                ...data,
                techStack: data.techStack.split(",").map(s => s.trim()).filter(Boolean),
            };

            if (data.publishDate) {
                payload.publishDate = new Date(data.publishDate);
            } else {
                payload.publishDate = null;
            }

            if (isEditing && initialData?.id) {
                const res = await updateCaseStudy(initialData.id, payload);
                if (!res.success) throw new Error(res.error);
            } else {
                const res = await createCaseStudy(payload);
                if (!res.success) throw new Error(res.error);
            }
            router.push("/dashboard/case-studies");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "An error occurred");
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            {error && (
                <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-sm border border-red-500/20 animate-in fade-in slide-in-from-top-1">
                    {error}
                </div>
            )}

            <div className="space-y-12">
                {/* Section: Core Information */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-agency-accent/10 flex items-center justify-center border border-agency-accent/20">
                            <Monitor className="w-4 h-4 text-agency-accent" />
                        </div>
                        <h3 className="text-lg font-medium text-white tracking-tight">Core Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-4">
                                Case Study Title
                            </label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-agency-accent transition-colors">
                                    <Monitor className="w-4 h-4" />
                                </div>
                                <input
                                    {...form.register("title")}
                                    onBlur={generateSlug}
                                    placeholder="e.g. Revolutionizing Fintech with AI"
                                    className="input-field pl-14"
                                />
                                {form.formState.errors.title && (
                                    <p className="text-xs text-red-400 mt-2 ml-4">{form.formState.errors.title.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-4">
                                URL Slug
                            </label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-agency-accent transition-colors">
                                    <Hash className="w-4 h-4" />
                                </div>
                                <input
                                    {...form.register("slug")}
                                    placeholder="revolutionizing-fintech-with-ai"
                                    className="input-field pl-14 font-mono text-xs opacity-80"
                                />
                                {form.formState.errors.slug && (
                                    <p className="text-xs text-red-400 mt-2 ml-4">{form.formState.errors.slug.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-4">
                                Industry
                            </label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-agency-accent transition-colors">
                                    <Layers className="w-4 h-4" />
                                </div>
                                <input
                                    {...form.register("industry")}
                                    placeholder="e.g. Healthcare, Fintech"
                                    className="input-field pl-14"
                                />
                                {form.formState.errors.industry && (
                                    <p className="text-xs text-red-400 mt-2 ml-4">{form.formState.errors.industry.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-4">
                                Client Name
                            </label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-agency-accent transition-colors">
                                    <AtSign className="w-4 h-4" />
                                </div>
                                <input
                                    {...form.register("clientName")}
                                    placeholder="e.g. Global Tech Solutions"
                                    className="input-field pl-14"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-4">
                                Project URL
                            </label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-agency-accent transition-colors">
                                    <Monitor className="w-4 h-4" />
                                </div>
                                <input
                                    {...form.register("projectUrl")}
                                    placeholder="e.g. https://project-demo.com"
                                    className="input-field pl-14"
                                />
                                {form.formState.errors.projectUrl && (
                                    <p className="text-xs text-red-400 mt-2 ml-4">{form.formState.errors.projectUrl.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Narrative Content */}
                <div className="space-y-8 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <LayoutGrid className="w-4 h-4 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white tracking-tight">Success Narrative</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <MarkdownEditor
                            value={form.watch("summary")}
                            onChange={(val) => form.setValue("summary", val, { shouldValidate: true })}
                            placeholder="A concise overview of the case study and its impact..."
                            label="Executive Summary"
                            rows={4}
                            error={form.formState.errors.summary?.message}
                        />

                        <div className="space-y-2">
                            <MarkdownEditor
                                value={form.watch("challenge")}
                                onChange={(val) => form.setValue("challenge", val, { shouldValidate: true })}
                                placeholder="What problem were we solving?"
                                label="The Challenge"
                                rows={6}
                                error={form.formState.errors.challenge?.message}
                            />
                        </div>
                        <div className="space-y-2">
                            <MarkdownEditor
                                value={form.watch("approach")}
                                onChange={(val) => form.setValue("approach", val, { shouldValidate: true })}
                                placeholder="How did we tackle the problem?"
                                label="Our Approach"
                                rows={6}
                                error={form.formState.errors.approach?.message}
                            />
                        </div>
                        <div className="space-y-2">
                            <MarkdownEditor
                                value={form.watch("solution")}
                                onChange={(val) => form.setValue("solution", val, { shouldValidate: true })}
                                placeholder="What did we build?"
                                label="The Solution"
                                rows={6}
                                error={form.formState.errors.solution?.message}
                            />
                        </div>
                        <div className="space-y-2">
                            <MarkdownEditor
                                value={form.watch("results")}
                                onChange={(val) => form.setValue("results", val, { shouldValidate: true })}
                                placeholder="What was the final impact?"
                                label="The Results"
                                rows={6}
                                error={form.formState.errors.results?.message}
                            />
                        </div>
                    </div>
                </div>

                {/* Section: Technical & Media */}
                <div className="space-y-8 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                            <Trophy className="w-4 h-4 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white tracking-tight">Technical & Meta</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-4">
                                Highlight Metric
                            </label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-agency-accent transition-colors">
                                    <Trophy className="w-4 h-4" />
                                </div>
                                <input
                                    {...form.register("highlightMetric")}
                                    placeholder="e.g. 500% ROI or 40% Growth"
                                    className="input-field pl-14"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-4">
                                Tech Stack
                            </label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-agency-accent transition-colors">
                                    <Layers className="w-4 h-4" />
                                </div>
                                <input
                                    {...form.register("techStack")}
                                    placeholder="Next.js, Tailwind, Prisma, PostgreSQL"
                                    className="input-field pl-14"
                                />
                                {form.formState.errors.techStack && (
                                    <p className="text-xs text-red-400 mt-2 ml-4">{form.formState.errors.techStack.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <ImageUpload
                                label="Cover Image"
                                description="Upload a high-resolution cover image for the case study."
                                value={form.watch("coverImage") || ""}
                                onChange={(url) => form.setValue("coverImage", url, { shouldValidate: true })}
                            />
                        </div>

                        <div className="space-y-2">
                            <ImageUpload
                                label="Architecture Image"
                                description="Upload a technical diagram or architecture overview."
                                value={form.watch("architectureImage") || ""}
                                onChange={(url) => form.setValue("architectureImage", url, { shouldValidate: true })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-4">
                                Publication Status
                            </label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-agency-accent transition-colors pointer-events-none z-10">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <select
                                    {...form.register("status")}
                                    className="select-field pl-14"
                                >
                                    <option value="DRAFT">Draft — Internal Only</option>
                                    <option value="PUBLISHED">Published — Public View</option>
                                    <option value="ARCHIVED">Archived — Hidden</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-4">
                                Published Date
                            </label>
                            <div className="relative group">
                                <input
                                    type="date"
                                    {...form.register("publishDate")}
                                    className="input-field px-4"
                                />
                            </div>
                        </div>

                        <div className="flex items-center h-full pt-6">
                            <label className="flex items-center gap-4 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        {...form.register("isFeatured")}
                                        className="sr-only peer"
                                    />
                                    <div className="w-12 h-6 bg-white/5 rounded-full peer peer-checked:bg-agency-accent transition-all duration-300 border border-white/10 group-hover:border-white/20"></div>
                                    <div className="absolute top-1 left-1 w-4 h-4 bg-gray-400 rounded-full peer-checked:translate-x-6 peer-checked:bg-white transition-all duration-300 shadow-lg"></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-white uppercase tracking-widest leading-none">
                                        Feature Story
                                    </span>
                                    <span className="text-[10px] text-gray-500 mt-1">
                                        Display prominently on home page
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-6 pt-12 border-t border-white/5">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn-outline w-full sm:w-auto px-10"
                >
                    Discard Changes
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-brand w-full sm:w-auto px-10 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                    <div className="relative z-10 flex items-center justify-center">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                {isEditing ? "Update Success Story" : "Release Case Study"}
                                <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </div>
                </button>
            </div>
        </form>
    );
}
