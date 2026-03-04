import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { getSubscribers } from "@/app/actions/subscribers";
import SubscriberList from "./SubscriberList";

export default async function SubscribersPage() {
    const session = await auth();

    if (!session?.user || (session.user.role !== Role.FOUNDER && session.user.role !== Role.CO_FOUNDER)) {
        redirect("/dashboard");
    }

    const { subscribers, error } = await getSubscribers();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Newsletter Subscribers</h1>
                    <p className="text-gray-500">Manage your mailing list and track reader engagement.</p>
                </div>
            </div>

            {error ? (
                <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 text-center">
                    <p className="text-red-500">{error}</p>
                </div>
            ) : (
                <SubscriberList initialSubscribers={subscribers || []} />
            )}
        </div>
    );
}
