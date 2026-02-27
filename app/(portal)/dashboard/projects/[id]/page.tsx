import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Role } from "@prisma/client";
import { format } from "date-fns";
import {
    ArrowLeft, CheckCircle2, Clock, AlertCircle, Activity,
    Layers, Calendar, GitPullRequest, MessageSquare
} from "lucide-react";
import NextActionPanel from "@/app/components/shared/NextActionPanel";
import ProjectAdminActions from "@/app/components/admin/ProjectAdminActions";
import RevenueSplitsControl from "@/app/components/admin/RevenueSplitsControl";
import EditableMilestones from "@/app/components/project/EditableMilestones";

const healthConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    GREEN: { bg: "bg-emerald-500/10", text: "text-emerald-500", icon: CheckCircle2, label: "On Track" },
    YELLOW: { bg: "bg-amber-500/10", text: "text-amber-500", icon: Clock, label: "Slight Delay" },
    RED: { bg: "bg-rose-500/10", text: "text-rose-500", icon: AlertCircle, label: "Action Needed" },
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) redirect("/login");

    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            milestones: { orderBy: { order: "asc" } },
            members: { include: { user: { select: { id: true, name: true, email: true } } } },
            activityLogs: { orderBy: { createdAt: "desc" }, take: 30, include: { user: { select: { name: true } } } },
            changeRequests: { orderBy: { createdAt: "desc" } },
            booking: true,
            payments: { orderBy: { paidAt: "desc" } },
        },
    });

    if (!project) notFound();

    // Fetch all founders/contractors for split assignments
    const allUsers = await prisma.user.findMany({
        where: { role: { in: [Role.FOUNDER, Role.CO_FOUNDER, Role.CONTRACTOR] } },
        orderBy: { name: "asc" }
    });

    const { user } = session;

    // RBAC: Contractors can only view their own assigned projects
    if (user.role === Role.CONTRACTOR) {
        const isMember = project.members.some((m: any) => m.userId === user.id);
        if (!isMember && project.finderId !== user.id) redirect("/dashboard/projects");
    }

    // RBAC: Clients can only view their own projects based on email
    if (user.role === Role.CLIENT) {
        const clientEmail = project.booking?.clientEmail;
        if (!clientEmail || clientEmail.toLowerCase() !== user.email.toLowerCase()) {
            redirect("/dashboard/projects");
        }
    }

    const pendingCRs = project.changeRequests.filter((c: any) => c.status === "PENDING").length;
    const completedMilestones = project.milestones.filter((m: any) => m.status === "COMPLETED").length;
    const progress = project.milestones.length > 0 ? Math.round((completedMilestones / project.milestones.length) * 100) : 0;
    const health = healthConfig[project.health] ?? healthConfig.GREEN;
    const HealthIcon = health.icon;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors group mb-3">
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> All Projects
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-display font-medium tracking-tight text-white">{project.title}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${health.bg} ${health.text}`}>
                        <HealthIcon className="w-4 h-4" /> {health.label}
                    </div>
                    <div className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-gray-400">
                        {project.status}
                    </div>
                </div>
            </div>

            {/* Next Action */}
            <NextActionPanel project={project} pendingChangeRequests={pendingCRs} userRole={user.role} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Progress & Milestones */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Layers className="w-5 h-5 text-agency-accent" /> Road to Delivery
                            </h3>
                            <span className="text-3xl font-bold text-white">{progress}%</span>
                        </div>
                        {/* Interactive Milestones replaces static ProgressBar and lists */}
                        <EditableMilestones
                            projectId={project.id}
                            initialMilestones={project.milestones}
                            userRole={user.role}
                        />
                    </div>

                    {/* Change Requests */}
                    {user.role !== Role.CLIENT && (
                        <div className="glass-panel p-8 rounded-3xl border border-white/5">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                                <GitPullRequest className="w-5 h-5 text-agency-accent" /> Change Requests
                                {pendingCRs > 0 && <span className="ml-auto px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold">{pendingCRs} Pending</span>}
                            </h3>
                            {project.changeRequests.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-8">No change requests submitted.</p>
                            ) : (
                                <div className="space-y-4">
                                    {project.changeRequests.map((cr: any) => (
                                        <div key={cr.id} className={`p-5 rounded-2xl border ${cr.status === "PENDING" ? "border-amber-500/20 bg-amber-500/5" : cr.status === "APPROVED" ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/5 bg-white/[0.02]"}`}>
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-white mb-1">{cr.title}</p>
                                                    <p className="text-xs text-gray-500">{cr.description}</p>
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest shrink-0 px-3 py-1 rounded-full ${cr.status === "PENDING" ? "bg-amber-500/10 text-amber-500" :
                                                    cr.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-500" :
                                                        "bg-red-500/10 text-red-400"}`}>
                                                    {cr.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Project Meta */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-5">
                        <h3 className="text-sm font-semibold text-white">Details</h3>
                        {project.startDate && (
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Started</span>
                                <span className="text-xs font-medium text-white">{format(new Date(project.startDate), "MMM d, yyyy")}</span>
                            </div>
                        )}
                        {project.endDate && (
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Deadline</span>
                                <span className="text-xs font-medium text-white">{format(new Date(project.endDate), "MMM d, yyyy")}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Milestones</span>
                            <span className="text-xs font-medium text-white">{completedMilestones}/{project.milestones.length} completed</span>
                        </div>
                        {user.role !== Role.CLIENT && (
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Team Members</span>
                                <span className="text-xs font-medium text-white">{project.members.length}</span>
                            </div>
                        )}
                    </div>

                    {/* Admin Actions */}
                    {user.role === Role.FOUNDER && (
                        <>
                            <ProjectAdminActions
                                projectId={project.id}
                                currentStatus={project.status}
                                currentHealth={project.health}
                            />
                            <RevenueSplitsControl
                                projectId={project.id}
                                initialCompanyFundRatio={project.companyFundRatio}
                                initialFinderFeeRatio={project.finderFeeRatio}
                                initialMembers={project.members}
                                allUsers={allUsers}
                            />
                        </>
                    )}

                    {/* Activity Feed */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/5">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-6">
                            <Activity className="w-4 h-4 text-agency-accent" /> Activity
                        </h3>
                        {project.activityLogs.length === 0 ? (
                            <p className="text-xs text-gray-500 text-center py-6">No activity yet.</p>
                        ) : (
                            <div className="space-y-5 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {project.activityLogs.map((log: any) => (
                                    <div key={log.id} className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-agency-accent/10 text-agency-accent flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5 uppercase tracking-tighter">
                                            {log.user?.name ? log.user.name.substring(0, 2) : "SYS"}
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/80 leading-snug">{log.action}</p>
                                            <p className="text-[10px] text-gray-600 mt-1">{format(new Date(log.createdAt), "MMM d, h:mm a")}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

