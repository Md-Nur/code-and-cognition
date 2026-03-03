import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ShieldOff } from "lucide-react";
import SharesView from "./_components/SharesView";

export default async function SharesPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    // RBAC: Founders and Co-Founders only
    const isAuthorized = session.user.role === Role.FOUNDER || session.user.role === Role.CO_FOUNDER;

    if (!isAuthorized) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mb-8">
                    <ShieldOff className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">Access Restricted</h1>
                <p className="text-gray-500 max-w-sm">
                    Equity management is exclusive to Founders and Co-Founders.
                </p>
            </div>
        );
    }

    // Fetch initial data
    const [shares, founders, transitions] = await Promise.all([
        prisma.companyShare.findMany({
            include: { user: { select: { name: true, email: true, role: true } } },
            orderBy: { percentage: "desc" }
        }),
        prisma.user.findMany({
            where: { role: { in: [Role.FOUNDER, Role.CO_FOUNDER] } },
            select: { id: true, name: true, email: true, role: true, createdAt: true }
        }),
        prisma.coFounderProposal.findMany({
            where: { status: { in: ["DRAFT", "SENT"] } },
            include: {
                user: { select: { name: true, email: true, createdAt: true } },
                proposer: { select: { name: true } },
                approvals: { include: { user: { select: { name: true } } } }
            }
        })
    ]);

    return (
        <SharesView
            initialData={{ shares, founders, transitions }}
            currentUserId={session.user.id}
        />
    );
}
