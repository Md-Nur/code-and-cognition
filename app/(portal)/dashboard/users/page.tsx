import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ShieldOff } from "lucide-react";
import UserManagementView from "./_components/UserManagementView";

export default async function UsersPage() {
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
          User management is exclusive to Founders and Co-Founders. You don't have permission to view this section.
        </p>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { memberProjects: true, activityLogs: true } },
      ledgerBalance: true,
    },
  });

  return (
    <UserManagementView initialUsers={users as any} />
  );
}
