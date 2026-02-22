import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import Link from "next/link";
import { FileText } from "lucide-react";
import ProposalPDFLink from "@/app/components/portal/ProposalPDFLink";

const statusConfig: Record<string, { label: string; cls: string }> = {
    DRAFT: { label: "Draft", cls: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
    SENT: { label: "Sent", cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    APPROVED: { label: "Approved", cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    REJECTED: { label: "Rejected", cls: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export default async function ProposalsPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");
    if (session.user.role === Role.CLIENT) redirect("/dashboard");

    const proposals = await prisma.proposal.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            project: { select: { id: true, title: true } },
            engagementModel: { select: { name: true, service: { select: { title: true } } } },
            booking: { include: { service: true } },
        },
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-display font-medium tracking-tight text-white">Proposals</h1>
                <p className="text-gray-500 text-sm mt-1">{proposals.length} proposals across all projects.</p>
            </div>

            {proposals.length === 0 ? (
                <div className="glass-panel p-20 rounded-3xl border border-dashed border-white/10 text-center">
                    <FileText className="w-10 h-10 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">No proposals created yet.</p>
                </div>
            ) : (
                <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left p-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Scope</th>
                                <th className="text-left p-5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden md:table-cell">Project</th>
                                <th className="text-left p-5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden lg:table-cell">Budget</th>
                                <th className="text-left p-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                                <th className="text-right p-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proposals.map(p => {
                                const s = statusConfig[p.status] ?? statusConfig.DRAFT;
                                return (
                                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-5">
                                            <p className="font-medium text-white line-clamp-1">{p.scopeSummary}</p>
                                            {(p.engagementModel || p.booking?.service) && (
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {p.engagementModel?.service.title || p.booking?.service?.title} {p.engagementModel ? `— ${p.engagementModel.name}` : ""}
                                                </p>
                                            )}
                                        </td>
                                        <td className="p-5 hidden md:table-cell">
                                            {p.project ? (
                                                <Link href={`/dashboard/projects/${p.project.id}`} className="text-agency-accent hover:underline text-xs">{p.project.title}</Link>
                                            ) : <span className="text-gray-600 text-xs">Unlinked</span>}
                                        </td>
                                        <td className="p-5 hidden lg:table-cell text-white font-mono text-xs">
                                            {p.budgetBDT ? `৳${p.budgetBDT.toLocaleString()}` : p.budgetUSD ? `$${p.budgetUSD.toLocaleString()}` : "Custom"}
                                        </td>
                                        <td className="p-5">
                                            <span className={`text-[10px] px-3 py-1 rounded-full border font-bold uppercase tracking-widest ${s.cls}`}>{s.label}</span>
                                        </td>
                                        <td className="p-5 text-right">
                                            {p.booking && (
                                                <ProposalPDFLink proposal={p} booking={p.booking} />
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
