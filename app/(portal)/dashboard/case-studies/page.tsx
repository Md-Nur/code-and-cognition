// Force re-compilation to pick up Prisma schema changes
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Plus, Pencil, Eye } from "lucide-react";
import { DeleteCaseStudyButton } from "./_components/DeleteCaseStudyButton";

export default async function CaseStudiesPage() {
    const caseStudies = await prisma.caseStudy.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-medium tracking-tight text-white mb-1">
                        Case Studies
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage and publish your client success stories for the <span className="text-white font-medium">public portfolio</span>.
                    </p>
                </div>
                <Link
                    href="/dashboard/case-studies/create"
                    className="btn-brand"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Case Study
                </Link>
            </div>

            <div className="premium-card overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-white/40">
                                <th className="px-8 py-5 font-bold">Title</th>
                                <th className="px-8 py-5 font-bold">Industry</th>
                                <th className="px-8 py-5 font-bold">Status</th>
                                <th className="px-8 py-5 font-bold">Published Date</th>
                                <th className="px-8 py-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {caseStudies.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-gray-500 font-medium">
                                        No case studies found. Create your first one to get started.
                                    </td>
                                </tr>
                            ) : (
                                caseStudies.map((study) => (
                                    <tr key={study.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-white group-hover:text-agency-accent transition-colors">
                                                    {study.title}
                                                </span>
                                                {study.isFeatured && (
                                                    <span className="mt-1 w-fit text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-agency-accent/10 text-agency-accent border border-agency-accent/20">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm text-gray-500">{study.industry}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${study.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                study.status === 'DRAFT' ? 'bg-white/5 text-gray-400 border-white/10' :
                                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                {study.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm text-gray-500">
                                                {study.publishDate ? format(study.publishDate, "MMM d, yyyy") : "-"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/case-studies/${study.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                                    title="Preview"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/dashboard/case-studies/${study.id}/edit`}
                                                    className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <DeleteCaseStudyButton id={study.id} />
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
