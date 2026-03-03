import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Plus, Pencil, Eye } from "lucide-react";
import { DeleteArticleButton } from "@/components/dashboard/DeleteArticleButton";

export default async function InsightsDashboardPage() {
    const articles = await prisma.article.findMany({
        orderBy: { publishedAt: "desc" },
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-medium tracking-tight text-white mb-1">
                        Insights
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage your thought leadership pieces and technical articles for the <span className="text-white font-medium">public insights section</span>.
                    </p>
                </div>
                <Link
                    href="/dashboard/insights/create"
                    className="btn-brand"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Insight
                </Link>
            </div>

            <div className="premium-card overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-white/40">
                                <th className="px-8 py-5 font-bold">Title</th>
                                <th className="px-8 py-5 font-bold">Category</th>
                                <th className="px-8 py-5 font-bold">Featured</th>
                                <th className="px-8 py-5 font-bold">Published Date</th>
                                <th className="px-8 py-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {articles.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-gray-500 font-medium">
                                        No insights found. Create your first one to get started.
                                    </td>
                                </tr>
                            ) : (
                                articles.map((article) => (
                                    <tr key={article.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-medium text-white group-hover:text-agency-accent transition-colors">
                                                {article.title}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm text-gray-500">{article.category}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            {article.isFeatured ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-agency-accent/10 text-agency-accent border-agency-accent/20">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-500">No</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm text-gray-500">
                                                {format(article.publishedAt, "MMM d, yyyy")}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/insights/${article.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                                    title="Preview"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/dashboard/insights/${article.id}/edit`}
                                                    className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <DeleteArticleButton id={article.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
