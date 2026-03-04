"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft, Hash, Monitor, Image, Layers, LayoutGrid } from "lucide-react";
import { createArticle, updateArticle } from "@/app/actions/articles";
import { MarkdownEditor } from "./MarkdownEditor";
import ImageUpload from "@/app/components/admin/ImageUpload";

const articleSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
    category: z.string().min(1, "Category is required"),
    excerpt: z.string().optional(),
    content: z.string().min(1, "Content is required"),
    thumbnailUrl: z.string().optional(),
    isFeatured: z.boolean().default(false),
    publishedAt: z.string().optional(),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

interface ArticleFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export function ArticleForm({ initialData, isEditing }: ArticleFormProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<ArticleFormValues>({
        resolver: zodResolver(articleSchema) as any,
        defaultValues: {
            title: initialData?.title || "",
            slug: initialData?.slug || "",
            category: initialData?.category || "",
            excerpt: initialData?.excerpt || "",
            content: initialData?.content || "",
            thumbnailUrl: initialData?.thumbnailUrl || "",
            isFeatured: initialData?.isFeatured || false,
            publishedAt: initialData?.publishedAt ? new Date(initialData.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
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

    async function onSubmit(data: ArticleFormValues) {
        setError(null);
        try {
            const payload = {
                ...data,
                publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
            };

            if (isEditing && initialData?.id) {
                const res = await updateArticle(initialData.id, payload);
                if (!res.success) throw new Error(res.error);
            } else {
                const res = await createArticle(payload);
                if (!res.success) throw new Error(res.error);
            }
            router.push("/dashboard/insights");
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
                                Article Title
                            </label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-agency-accent transition-colors">
                                    <Monitor className="w-4 h-4" />
                                </div>
                                <input
                                    {...form.register("title")}
                                    onBlur={generateSlug}
                                    placeholder="e.g. The Future of AI in Enterprise"
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
                                    placeholder="future-of-ai-in-enterprise"
                                    className="input-field pl-14 font-mono text-xs opacity-80"
                                />
                                {form.formState.errors.slug && (
                                    <p className="text-xs text-red-400 mt-2 ml-4">{form.formState.errors.slug.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-4">
                                Category
                            </label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-agency-accent transition-colors">
                                    <Layers className="w-4 h-4" />
                                </div>
                                <input
                                    {...form.register("category")}
                                    placeholder="e.g. AI & Automation, Product Strategy"
                                    className="input-field pl-14"
                                />
                                {form.formState.errors.category && (
                                    <p className="text-xs text-red-400 mt-2 ml-4">{form.formState.errors.category.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 col-span-1 md:col-span-2 mt-4">
                            <ImageUpload
                                value={form.watch("thumbnailUrl") || ""}
                                onChange={(url) => form.setValue("thumbnailUrl", url, { shouldValidate: true })}
                                label="Thumbnail Image Requirements"
                                description="Upload a high-quality cover image for the insight. Recommended aspect ratio is 16:9."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-4">
                                Published Date
                            </label>
                            <div className="relative group">
                                <input
                                    type="date"
                                    {...form.register("publishedAt")}
                                    className="input-field px-4"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Content */}
                <div className="space-y-8 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <LayoutGrid className="w-4 h-4 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white tracking-tight">Article Content</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-4">
                                Excerpt (Short Summary)
                            </label>
                            <textarea
                                {...form.register("excerpt")}
                                placeholder="A brief hook for the article card..."
                                rows={2}
                                className="input-field py-4 resize-none min-h-[80px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <MarkdownEditor
                                value={form.watch("content")}
                                onChange={(val) => form.setValue("content", val, { shouldValidate: true })}
                                placeholder="Write your article content here..."
                                label="Full Article Content (Markdown)"
                                rows={15}
                                error={form.formState.errors.content?.message}
                            />
                        </div>

                        <div className="flex items-center h-full pt-4">
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
                                        Featured Article
                                    </span>
                                    <span className="text-[10px] text-gray-500 mt-1">
                                        Display prominently on the home page
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
                    Discard
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
                                {isEditing ? "Update Article" : "Publish Article"}
                                <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </div>
                </button>
            </div>
        </form>
    );
}
