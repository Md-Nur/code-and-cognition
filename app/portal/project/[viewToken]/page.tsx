import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
    CheckCircle2,
    Clock,
    Activity,
    AlertCircle,
    CircleDashed,
    Calendar,
    Layers,
    Rocket
} from "lucide-react";
import { format } from "date-fns";

export default async function ClientPortalPage(props: { params: Promise<{ viewToken: string }> }) {
    const params = await props.params;

    const project = await prisma.project.findUnique({
        where: { viewToken: params.viewToken },
        include: {
            milestones: {
                orderBy: { order: "asc" },
            },
            activityLogs: {
                orderBy: { createdAt: "desc" },
                take: 20,
                include: {
                    user: { select: { name: true } }
                }
            },
            booking: true,
        }
    });

    if (!project) return notFound();

    // Health color mapping
    const healthColors: Record<string, { bg: string, text: string, icon: React.ReactNode, label: string }> = {
        GREEN: { bg: "bg-emerald-500/10", text: "text-emerald-500", icon: <CheckCircle2 className="w-5 h-5" />, label: "On Track" },
        YELLOW: { bg: "bg-amber-500/10", text: "text-amber-500", icon: <Clock className="w-5 h-5" />, label: "Slight Delay" },
        RED: { bg: "bg-rose-500/10", text: "text-rose-500", icon: <AlertCircle className="w-5 h-5" />, label: "Action Needed" },
    };

    const currentHealth = healthColors[project.health] || healthColors.GREEN;

    // Milestone Progress
    const totalMilestones = project.milestones.length;
    const completedMilestones = project.milestones.filter(m => m.status === "COMPLETED").length;
    const progressPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
            {/* Header */}
            <header className="fixed w-full top-0 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md z-50">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Client Portal</p>
                            <h1 className="text-lg font-bold">Code & Cognition</h1>
                        </div>
                    </div>

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm ${currentHealth.bg} ${currentHealth.text}`}>
                        {currentHealth.icon}
                        <span>{currentHealth.label}</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left Column: Overview & Milestones */}
                <div className="lg:col-span-8 space-y-10">

                    {/* Project Title Card */}
                    <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Layers className="w-32 h-32" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                                    {project.status.replace("_", " ")}
                                </span>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Started {format(new Date(project.createdAt), "MMM d, yyyy")}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold mb-6 tracking-tight">{project.title}</h2>

                            {/* Progress Bar */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Project Completion</span>
                                    <span>{progressPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3">
                                    <div
                                        className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                                        style={{ width: `${progressPercentage}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 w-full h-full -skew-x-12 translate-x-12" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Milestones Timeline */}
                    <section>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-blue-600" />
                            Project Milestones
                        </h3>

                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-800">
                            {project.milestones.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p>No milestones have been defined yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 dark:before:via-gray-700 before:to-transparent">
                                    {project.milestones.map((milestone, index) => {
                                        const isCompleted = milestone.status === "COMPLETED";
                                        const isInProgress = milestone.status === "IN_PROGRESS";
                                        const isPending = milestone.status === "PENDING";

                                        return (
                                            <div key={milestone.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-gray-900 ${isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10`}>
                                                    {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white" /> :
                                                        isInProgress ? <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> :
                                                            <CircleDashed className="w-4 h-4 text-gray-500" />}
                                                </div>

                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 md:group-odd:text-right hover:border-blue-500/30 transition-colors">
                                                    <div className="flex flex-col md:group-odd:items-end">
                                                        <span className={`text-[10px] uppercase font-bold tracking-widest ${isCompleted ? 'text-emerald-500' : isInProgress ? 'text-blue-500' : 'text-gray-400'}`}>
                                                            {milestone.status.replace("_", " ")}
                                                        </span>
                                                        <h4 className="text-base font-bold mt-1 mb-2">{milestone.title}</h4>
                                                        {milestone.description && (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{milestone.description}</p>
                                                        )}
                                                        {milestone.completedAt && (
                                                            <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-3 font-medium flex items-center gap-1 md:group-odd:justify-end">
                                                                <CheckCircle2 className="w-3 h-3" />
                                                                Completed {format(new Date(milestone.completedAt), "MMM d, yyyy")}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Activity Feed */}
                <div className="lg:col-span-4">
                    <div className="sticky top-28 space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-600" />
                            Activity Feed
                        </h3>

                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                            {project.activityLogs.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    <Activity className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                    <p>No activity recorded yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {project.activityLogs.map((log) => (
                                        <div key={log.id} className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                                                <span className="text-xs font-bold">
                                                    {log.user?.name ? log.user.name.charAt(0).toUpperCase() : "S"}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium leading-snug">
                                                    {log.user?.name ? <span className="font-semibold">{log.user.name}</span> : <span className="font-semibold">System</span>}
                                                    {" "}{log.action}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {format(new Date(log.createdAt), "MMM d, h:mm a")}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-6 border border-blue-100 dark:border-blue-800/30 text-center">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                Have questions about the progress?
                                <br />
                                <a href="#" className="font-bold border-b border-blue-800 dark:border-blue-300 mt-2 inline-block hover:text-blue-600 transition-colors">Contact your Project Manager</a>
                            </p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
