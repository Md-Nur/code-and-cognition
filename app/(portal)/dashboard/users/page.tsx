import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, ShieldOff } from "lucide-react";

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // RBAC: Founders only
  if (session.user.role !== Role.FOUNDER) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mb-8">
          <ShieldOff className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Access Restricted</h1>
        <p className="text-gray-500 max-w-sm">
          User management is exclusive to Founders. You don't have permission to view this section.
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

  const roleColors: Record<string, string> = {
    FOUNDER: "bg-agency-accent/10 text-agency-accent border-agency-accent/20",
    CONTRACTOR: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    CLIENT: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-medium tracking-tight text-white">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} registered users across all roles.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-agency-accent/10 border border-agency-accent/20 text-agency-accent text-xs font-bold">
          <Users className="w-4 h-4" /> Founder Access
        </div>
      </div>

      <div className="glass-panel overflow-hidden rounded-3xl border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left p-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">User</th>
              <th className="text-left p-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Role</th>
              <th className="text-left p-5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden md:table-cell">Projects</th>
              <th className="text-left p-5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden lg:table-cell">Balance</th>
              <th className="text-right p-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-agency-accent/10 border border-white/10 flex items-center justify-center text-xs font-bold text-agency-accent shrink-0">
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className={`text-[10px] px-3 py-1 rounded-full border font-bold uppercase tracking-widest ${roleColors[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-5 hidden md:table-cell text-gray-400">{user._count.memberProjects} projects</td>
                <td className="p-5 hidden lg:table-cell">
                  {user.ledgerBalance ? (
                    <div>
                      <div className="text-white font-mono text-xs">৳{user.ledgerBalance.totalBDT.toLocaleString()}</div>
                      <div className="text-gray-500 font-mono text-xs">${user.ledgerBalance.totalUSD.toLocaleString()}</div>
                    </div>
                  ) : (
                    <span className="text-gray-600 text-xs">No balance</span>
                  )}
                </td>
                <td className="p-5 text-right text-gray-500 text-xs">
                  {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
