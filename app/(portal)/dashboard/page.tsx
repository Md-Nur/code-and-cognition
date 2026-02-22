import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import OverviewDispatcher from "@/app/components/portal/OverviewDispatcher";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-medium tracking-tight text-white mb-1">
                        Systems Overview
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Welcome back, <span className="text-white font-medium">{session.user.name}</span>.
                        Tracking your <span className="text-agency-accent font-medium">{session.user.role.toLowerCase()}</span> metrics.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-400 font-medium">
                        {new Date().toLocaleDateString(undefined, {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                        })}
                    </div>
                </div>
            </div>

            <OverviewDispatcher user={session.user} />
        </div>
    );
}
