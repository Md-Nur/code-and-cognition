import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Role } from "@prisma/client";
import { format } from "date-fns";
import {
    ArrowLeft, CheckCircle2, Clock, AlertCircle, Activity,
    Layers, Calendar
} from "lucide-react";
import NextActionPanel from "@/app/components/shared/NextActionPanel";
import ProjectAdminActions from "@/app/components/admin/ProjectAdminActions";
import RevenueSplitsControl from "@/app/components/admin/RevenueSplitsControl";
import EditableMilestones from "@/app/components/project/EditableMilestones";
import ChangeRequestsPanel from "@/app/components/admin/ChangeRequestsPanel";
import EditableProjectTitle from "@/app/components/project/EditableProjectTitle";
import LocalTime from "@/app/components/shared/LocalTime";

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
            changeRequests: { orderBy: { createdAt: "desc" }, include: { requestedBy: { select: { name: true, role: true } } } },
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

    // RBAC: Clients should always be redirected to their dedicated portal, not the admin dashboard
    if (user.role === Role.CLIENT) {
        if (project.viewToken) {
            redirect(`/project/${project.viewToken}`);
        } else {
            redirect("/dashboard/projects");
        }
    }

    // RBAC: Contractors can only view their own assigned projects
    if (user.role === Role.CONTRACTOR) {
        const isMember = project.members.some((m: any) => m.userId === user.id);
        if (!isMember && project.finderId !== user.id) redirect("/dashboard/projects");
    }

    const pendingCRs = project.changeRequests.filter((c: any) => c.status === "PENDING").length;
    const completedMilestones = project.milestones.filter((m: any) => m.status === "COMPLETED").length;
    const progress = project.milestones.length > 0 ? Math.round((completedMilestones / project.milestones.length) * 100) : 0;
    const health = healthConfig[project.health] ?? healthConfig.GREEN;
    const HealthIcon = health.icon;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div className="space-y-4">
                    <Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors group">
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> All Projects
                    </Link>
                    <div className="space-y-2">
                        <EditableProjectTitle
                            projectId={project.id}
                            initialTitle={project.title}
                            userRole={user.role}
                        />
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                            {project.startDate && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                                    <Calendar className="w-3.5 h-3.5 text-agency-accent" />
                                    <span>Started <span className="text-white font-medium"><LocalTime date={project.startDate} /></span></span>
                                </div>
                            )}
                            {project.endDate && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                                    <span>Deadline <span className="text-white font-medium"><LocalTime date={project.endDate} /></span></span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                                <Layers className="w-3.5 h-3.5 text-blue-400" />
                                <span><span className="text-white font-medium">{completedMilestones}/{project.milestones.length}</span> Milestones</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${health.bg} ${health.text} border ${health.text.replace('text-', 'border-').replace('500', '500/20')}`}>
                        <HealthIcon className="w-4 h-4" /> {health.label}
                    </div>
                    <div className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-gray-400 uppercase tracking-widest font-semibold">
                        {project.status.replace('_', ' ')}
                    </div>
                </div>
            </div>

            {/* Next Action */}
            <div className="relative">
                <NextActionPanel project={project} pendingChangeRequests={pendingCRs} userRole={user.role} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Progress & Milestones */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                                    <Layers className="w-6 h-6 text-agency-accent" /> Road to Delivery
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Track and manage project milestones</p>
                            </div>
                            <div className="text-right">
                                <span className="text-4xl font-bold text-white tracking-tighter">{progress}%</span>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Complete</div>
                            </div>
                        </div>
                        <EditableMilestones
                            projectId={project.id}
                            initialMilestones={project.milestones}
                            userRole={user.role}
                        />
                    </div>

                    {/* Revenue Splits - Moved here for more space */}
                    {user.role === Role.FOUNDER && (
                        <div className="glass-panel p-8 rounded-3xl border border-white/5">
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                                    <Activity className="w-6 h-6 text-emerald-400" /> Revenue & Resources
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Manage project splits and team assignments</p>
                            </div>
                            <RevenueSplitsControl
                                projectId={project.id}
                                initialCompanyFundRatio={project.companyFundRatio}
                                initialFinderFeeRatio={project.finderFeeRatio}
                                initialMembers={project.members}
                                allUsers={allUsers}
                            />
                        </div>
                    )}

                    {/* Change Requests */}
                    <ChangeRequestsPanel
                        projectId={project.id}
                        initialCRs={project.changeRequests as any}
                        userRole={user.role}
                    />
                </div>

                {/* Right Column - Sidebar */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 lg:self-start">

                    {/* Admin Tools */}
                    {user.role === Role.FOUNDER && (
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 px-2 lg:px-4">Project Controls</h3>
                            <ProjectAdminActions
                                projectId={project.id}
                                currentStatus={project.status}
                                currentHealth={project.health}
                            />
                        </div>
                    )}

                    {/* Activity Feed */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/5">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center justify-between mb-6">
                            Activity Feed
                            <Activity className="w-3.5 h-3.5" />
                        </h3>
                        {project.activityLogs.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl">
                                <Activity className="w-8 h-8 text-white/10 mx-auto mb-3" />
                                <p className="text-xs text-gray-500 italic">No activity yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {project.activityLogs.map((log: any) => (
                                    <div key={log.id} className="group relative pl-7 py-3 border-l-2 border-white/5 hover:border-agency-accent/40 transition-colors rounded-r-lg hover:bg-white/[0.02]">
                                        <div className="absolute left-[-5px] top-[14px] w-2 h-2 rounded-full bg-agency-accent/30 border border-agency-accent/50 group-hover:bg-agency-accent/60 transition-colors shrink-0" />
                                        <div className="space-y-0.5">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-[10px] font-bold text-agency-accent uppercase tracking-tighter">
                                                    {log.user?.name ?? "System"}
                                                </span>
                                                <span className="text-[10px] text-gray-600 tabular-nums">
                                                    <LocalTime date={log.createdAt} showTime />
                                                </span>
                                            </div>
                                            <p className="text-xs text-white/70 leading-relaxed">{log.action}</p>
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

