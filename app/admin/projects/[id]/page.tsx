"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useParams } from "next/navigation";
import {
  Project,
  User,
  Booking,
  Payment,
  LedgerEntry,
  ProjectMember,
  Milestone,
  MilestoneStatus,
  ActivityLog,
  ChangeRequest,
} from "@prisma/client";
import ChangeRequestsPanel from "@/app/components/admin/ChangeRequestsPanel";
import ProgressBar from "@/app/components/ProgressBar";
import { getNextAction, NextActionKey } from "@/lib/next-action";

type CRWithUser = ChangeRequest & {
  requestedBy: { name: string; role: string };
};

type ProjectDetails = Project & {
  finder: User;
  booking: Booking | null;
  members: (ProjectMember & { user: User })[];
  payments: (Payment & { splits: LedgerEntry[] })[];
  milestones: Milestone[];
  activityLogs: (ActivityLog & { user: { name: string } | null })[];
  nextAction?: { key: NextActionKey };
};

const NEXT_ACTION_CONFIG: Record<
  NextActionKey,
  {
    label: string;
    titleClass: string;
    panelClass: string;
    iconClass: string;
    pillClass: string;
    pillText: string;
    roleCopy: Record<string, string>;
    icon: ReactNode;
  }
> = {
  CHANGE_REQUEST_REVIEW: {
    label: "Change Request Review Needed",
    titleClass: "text-amber-300",
    panelClass:
      "border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent",
    iconClass: "bg-amber-500/15 text-amber-300",
    pillClass: "border-amber-500/30 text-amber-300 bg-amber-500/15",
    pillText: "High priority",
    roleCopy: {
      FOUNDER:
        "A change request is pending your decision before work continues.",
      CONTRACTOR: "A change request is awaiting founder review.",
      CLIENT: "A change request is ready for your approval.",
      DEFAULT: "A change request needs review.",
    },
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
      </svg>
    ),
  },
  PAYMENT_DUE: {
    label: "Payment Due",
    titleClass: "text-rose-300",
    panelClass:
      "border-rose-500/30 bg-gradient-to-br from-rose-500/15 via-rose-500/5 to-transparent",
    iconClass: "bg-rose-500/15 text-rose-300",
    pillClass: "border-rose-500/30 text-rose-300 bg-rose-500/15",
    pillText: "High priority",
    roleCopy: {
      FOUNDER:
        "Payment is due from the client. Follow up before the next phase.",
      CONTRACTOR: "Payment is pending. Hold the next phase until it clears.",
      CLIENT: "Payment is due to keep work moving.",
      DEFAULT: "Payment is due.",
    },
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  WAITING_FOR_CLIENT_APPROVAL: {
    label: "Waiting for Client Approval",
    titleClass: "text-blue-300",
    panelClass:
      "border-blue-500/30 bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-transparent",
    iconClass: "bg-blue-500/15 text-blue-300",
    pillClass: "border-blue-500/30 text-blue-300 bg-blue-500/15",
    pillText: "Pending",
    roleCopy: {
      FOUNDER: "Latest milestone is complete and awaiting client sign-off.",
      CONTRACTOR:
        "Client approval is pending before the next milestone starts.",
      CLIENT: "Please review and approve the latest milestone.",
      DEFAULT: "Waiting for client approval.",
    },
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  NO_ACTION: {
    label: "All Clear",
    titleClass: "text-emerald-300",
    panelClass:
      "border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent",
    iconClass: "bg-emerald-500/15 text-emerald-300",
    pillClass: "border-emerald-500/30 text-emerald-300 bg-emerald-500/15",
    pillText: "Stable",
    roleCopy: {
      FOUNDER: "No immediate action required. Project is moving smoothly.",
      CONTRACTOR: "No immediate action required. Keep execution steady.",
      CLIENT: "No immediate action required. Project is on track.",
      DEFAULT: "No immediate action required.",
    },
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
};

function getNextActionCopy(key: NextActionKey, role: string): string {
  const config = NEXT_ACTION_CONFIG[key];
  return config.roleCopy[role] ?? config.roleCopy.DEFAULT;
}

function getNextActionMeta(
  key: NextActionKey,
  project: ProjectDetails,
  pendingChangeRequests: number,
): string | null {
  if (key === "CHANGE_REQUEST_REVIEW" && pendingChangeRequests > 0) {
    return `${pendingChangeRequests} pending change request${
      pendingChangeRequests === 1 ? "" : "s"
    }.`;
  }

  if (key === "PAYMENT_DUE" && project.booking) {
    const totalPaidBDT = project.payments.reduce(
      (sum, payment) => sum + (payment.amountBDT ?? 0),
      0,
    );
    const totalPaidUSD = project.payments.reduce(
      (sum, payment) => sum + (payment.amountUSD ?? 0),
      0,
    );
    if (project.booking.budgetBDT) {
      const remaining = Math.max(project.booking.budgetBDT - totalPaidBDT, 0);
      return `Remaining: ৳${remaining.toLocaleString()}.`;
    }
    if (project.booking.budgetUSD) {
      const remaining = Math.max(project.booking.budgetUSD - totalPaidUSD, 0);
      return `Remaining: $${remaining.toLocaleString()}.`;
    }
  }

  return null;
}

export default function AdminProjectDetailsPage() {
  const params = useParams();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [changeRequests, setChangeRequests] = useState<CRWithUser[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string>("CONTRACTOR");
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberFormData, setMemberFormData] = useState({
    userId: "",
    share: 0,
  });

  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [milestoneFormData, setMilestoneFormData] = useState({
    title: "",
    description: "",
    order: 0,
  });
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    async function fetchProject() {
      if (!params?.id) return;
      try {
        const res = await fetch(`/api/admin/projects/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProject();

    async function fetchUsers() {
      const res = await fetch("/api/admin/users");
      if (res.ok) setAllUsers(await res.json());
    }
    fetchUsers();

    async function fetchCRs() {
      if (!params?.id) return;
      const res = await fetch(
        `/api/admin/projects/${params.id}/change-requests`,
      );
      if (res.ok) setChangeRequests(await res.json());
    }
    fetchCRs();

    async function fetchSession() {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUserRole(data?.user?.role ?? "CONTRACTOR");
      }
    }
    fetchSession();
  }, [params.id]);

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/projects/${project?.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberFormData),
      });
      if (res.ok) {
        setShowMemberModal(false);
        // Refresh project data
        const updated = await fetch(`/api/admin/projects/${project?.id}`).then(
          (r) => r.json(),
        );
        setProject(updated);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleRemoveMember(userId: string) {
    if (!confirm("Remove this member?")) return;
    try {
      const res = await fetch(
        `/api/admin/projects/${project?.id}/members?userId=${userId}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        const updated = await fetch(`/api/admin/projects/${project?.id}`).then(
          (r) => r.json(),
        );
        setProject(updated);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!confirm(`Change project status to ${newStatus}?`)) return;
    try {
      const res = await fetch(`/api/admin/projects/${project?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await fetch(`/api/admin/projects/${project?.id}`).then(
          (r) => r.json(),
        );
        setProject(updated);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleHealthChange(newHealth: string) {
    try {
      const res = await fetch(`/api/admin/projects/${project?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ health: newHealth }),
      });
      if (res.ok) {
        const updated = await fetch(`/api/admin/projects/${project?.id}`).then(
          (r) => r.json(),
        );
        setProject(updated);
      }
    } catch (e) {
      console.error(e);
    }
  }

  function handleDownloadBrief() {
    window.open(`/api/project/${project?.id}/generate-brief`, "_blank");
  }

  async function handleMilestoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = `/api/admin/projects/${project?.id}/milestones`;
      const method = editingMilestoneId ? "PATCH" : "POST";
      const body = editingMilestoneId
        ? { ...milestoneFormData, id: editingMilestoneId }
        : milestoneFormData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowMilestoneModal(false);
        setEditingMilestoneId(null);
        setMilestoneFormData({
          title: "",
          description: "",
          order: (project?.milestones.length || 0) + 1,
        });
        const updated = await fetch(`/api/admin/projects/${project?.id}`).then(
          (r) => r.json(),
        );
        setProject(updated);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleMilestoneStatusUpdate(
    milestoneId: string,
    status: MilestoneStatus,
  ) {
    try {
      const res = await fetch(`/api/admin/projects/${project?.id}/milestones`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: milestoneId, status }),
      });
      if (res.ok) {
        const updated = await fetch(`/api/admin/projects/${project?.id}`).then(
          (r) => r.json(),
        );
        setProject(updated);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleMilestoneDelete(milestoneId: string) {
    if (!confirm("Delete this milestone?")) return;
    try {
      const res = await fetch(
        `/api/admin/projects/${project?.id}/milestones?id=${milestoneId}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        const updated = await fetch(`/api/admin/projects/${project?.id}`).then(
          (r) => r.json(),
        );
        setProject(updated);
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading project details...
      </div>
    );
  if (!project)
    return (
      <div className="p-8 text-center text-red-500">Project not found.</div>
    );

  const pendingChangeRequests = changeRequests.filter(
    (cr) => cr.status === "PENDING",
  ).length;

  const nextAction = getNextAction({
    status: project.status,
    milestones: project.milestones,
    booking: project.booking,
    payments: project.payments,
    pendingChangeRequests,
  });
  const nextActionConfig = NEXT_ACTION_CONFIG[nextAction.key];
  const nextActionCopy = getNextActionCopy(nextAction.key, currentUserRole);
  const nextActionMeta = getNextActionMeta(
    nextAction.key,
    project,
    pendingChangeRequests,
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {project.title}
            </h1>
            <div className="flex gap-2">
              <span
                className={`text-xs px-2 py-1 rounded border ${
                  project.status === "ACTIVE"
                    ? "border-blue-500/30 text-blue-400 bg-blue-500/10"
                    : project.status === "COMPLETED"
                      ? "border-green-500/30 text-green-400 bg-green-500/10"
                      : "border-gray-500/30 text-gray-400 bg-gray-500/10"
                }`}
              >
                {project.status}
              </span>
              <select
                value={project.health}
                onChange={(e) => handleHealthChange(e.target.value)}
                className={`text-xs px-2 py-0.5 rounded border bg-transparent cursor-pointer font-semibold ${
                  project.health === "GREEN"
                    ? "border-emerald-500/30 text-emerald-400"
                    : project.health === "YELLOW"
                      ? "border-amber-500/30 text-amber-400"
                      : "border-rose-500/30 text-rose-400"
                }`}
              >
                <option value="GREEN" className="bg-gray-900">
                  Health: GREEN
                </option>
                <option value="YELLOW" className="bg-gray-900">
                  Health: YELLOW
                </option>
                <option value="RED" className="bg-gray-900">
                  Health: RED
                </option>
              </select>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Created on {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          {project.status === "ACTIVE" && (
            <button
              onClick={() => handleStatusChange("COMPLETED")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-emerald-600/20"
            >
              Mark Complete
            </button>
          )}
          <button
            onClick={handleDownloadBrief}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Brief
          </button>
          <button className="btn-outline">Edit</button>
        </div>
      </div>

      <div
        className={`glass-panel p-6 rounded-2xl border relative overflow-hidden ${nextActionConfig.panelClass}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div
            className={`h-11 w-11 rounded-xl flex items-center justify-center ${nextActionConfig.iconClass}`}
          >
            {nextActionConfig.icon}
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Next Action Required
            </p>
            <h2 className={`text-xl font-bold ${nextActionConfig.titleClass}`}>
              {nextActionConfig.label}
            </h2>
            <p className="text-sm text-gray-300 mt-1">{nextActionCopy}</p>
            {nextActionMeta && (
              <p className="text-xs text-gray-400 mt-2">{nextActionMeta}</p>
            )}
          </div>
          <div className="sm:ml-auto">
            <span
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${nextActionConfig.pillClass}`}
            >
              {nextActionConfig.pillText}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Team */}
        <div className="space-y-8 lg:col-span-2">
          {/* Project Info */}
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Project Information</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Finder</dt>
                <dd className="font-medium">{project.finder.name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Booking Source</dt>
                <dd className="font-medium">
                  {project.booking ? "Online Booking" : "Direct / Manual"}
                </dd>
              </div>
              {project.booking && (
                <div className="col-span-2 mt-2 pt-2 border-t border-white/5">
                  <dt className="text-gray-500">Initial Request</dt>
                  <dd className="text-gray-400 italic">
                    "{project.booking.message}"
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Project Milestones */}
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Project Milestones</h3>
              <button
                onClick={() => {
                  setEditingMilestoneId(null);
                  setMilestoneFormData({
                    title: "",
                    description: "",
                    order: project.milestones.length + 1,
                  });
                  setShowMilestoneModal(true);
                }}
                className="btn-brand text-xs px-3 py-1.5"
              >
                + Add Milestone
              </button>
            </div>

            <div className="space-y-4">
              {project.milestones.length === 0 ? (
                <p className="text-gray-500 text-sm italic text-center py-4">
                  No milestones defined for this project.
                </p>
              ) : (
                project.milestones.map((m) => (
                  <div
                    key={m.id}
                    className="group p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              m.status === "COMPLETED"
                                ? "bg-emerald-500"
                                : m.status === "IN_PROGRESS"
                                  ? "bg-blue-500 animate-pulse"
                                  : "bg-gray-600"
                            }`}
                          />
                          <h4 className="font-bold text-sm">{m.title}</h4>
                        </div>
                        {m.description && (
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {m.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <select
                          value={m.status}
                          onChange={(e) =>
                            handleMilestoneStatusUpdate(
                              m.id,
                              e.target.value as MilestoneStatus,
                            )
                          }
                          className="text-[10px] bg-gray-800 border border-white/10 rounded px-1.5 py-1 outline-none"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                        <button
                          onClick={() => {
                            setEditingMilestoneId(m.id);
                            setMilestoneFormData({
                              title: m.title,
                              description: m.description || "",
                              order: m.order,
                            });
                            setShowMilestoneModal(true);
                          }}
                          className="p-1 hover:text-blue-400 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleMilestoneDelete(m.id)}
                          className="p-1 hover:text-rose-500 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Change Requests */}
          <ChangeRequestsPanel
            projectId={project.id}
            initialCRs={changeRequests}
            userRole={currentUserRole}
            onChangeRequests={setChangeRequests}
          />

          {/* Team Members */}
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Execution Team</h3>
              <button
                onClick={() => setShowMemberModal(true)}
                className="text-xs text-agency-accent hover:text-white"
              >
                + Add Member
              </button>
            </div>
            <div className="space-y-3">
              {project.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-agency-accent/20 flex items-center justify-center font-bold text-xs">
                      {member.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.user.name}</p>
                      <p className="text-xs text-gray-500">
                        {member.user.role} • {member.share}% Share
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(member.userId)}
                    className="text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              {project.members.length === 0 && (
                <p className="text-gray-500 text-sm italic">
                  No execution members assigned yet.
                </p>
              )}
            </div>
          </div>

          {/* Add Member Modal */}
          {showMemberModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="glass-panel w-full max-w-sm p-6 rounded-xl animate-fade-in-up">
                <h3 className="text-lg font-bold mb-4">Assign Team Member</h3>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <div>
                    <label className="input-label">Select User</label>
                    <select
                      required
                      className="select-field"
                      value={memberFormData.userId}
                      onChange={(e) =>
                        setMemberFormData({
                          ...memberFormData,
                          userId: e.target.value,
                        })
                      }
                    >
                      <option value="">Choose a user...</option>
                      {allUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Profit Share (%)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      className="input-field"
                      value={memberFormData.share}
                      onChange={(e) =>
                        setMemberFormData({
                          ...memberFormData,
                          share: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowMemberModal(false)}
                      className="btn-outline flex-1"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-brand flex-1">
                      Add to Team
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Milestone Modal */}
          {showMilestoneModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="glass-panel w-full max-w-sm p-6 rounded-xl animate-fade-in-up">
                <h3 className="text-lg font-bold mb-4">
                  {editingMilestoneId ? "Edit Milestone" : "Add Milestone"}
                </h3>
                <form onSubmit={handleMilestoneSubmit} className="space-y-4">
                  <div>
                    <label className="input-label">Title</label>
                    <input
                      required
                      className="input-field"
                      placeholder="e.g., UI Design Completion"
                      value={milestoneFormData.title}
                      onChange={(e) =>
                        setMilestoneFormData({
                          ...milestoneFormData,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="input-label">
                      Description (Optional)
                    </label>
                    <textarea
                      className="input-field h-24"
                      placeholder="What will be delivered?"
                      value={milestoneFormData.description}
                      onChange={(e) =>
                        setMilestoneFormData({
                          ...milestoneFormData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="input-label">Display Order</label>
                    <input
                      type="number"
                      required
                      className="input-field"
                      value={milestoneFormData.order}
                      onChange={(e) =>
                        setMilestoneFormData({
                          ...milestoneFormData,
                          order: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowMilestoneModal(false)}
                      className="btn-outline flex-1"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-brand flex-1">
                      {editingMilestoneId ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Financials & Sharing */}
        <div className="space-y-8">
          {/* Project Progress */}
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Project Progress</h3>
            <div className="space-y-2">
              <ProgressBar milestones={project.milestones} />
              {project.milestones.length === 0 && (
                <p className="text-gray-500 text-sm italic">
                  No milestones defined yet.
                </p>
              )}
            </div>
          </div>

          {/* Magic Link Sharing */}
          <div className="glass-panel p-6 rounded-xl border-agency-accent/20 bg-agency-accent/5">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-agency-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Client Portal
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Share this magic link with your client. No password required.
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                className="input-field text-xs bg-black/40"
                value={`${window.location.origin}/portal/project/${project.viewToken}`}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/portal/project/${project.viewToken}`,
                  );
                  alert("Link copied to clipboard!");
                }}
                className="p-2 bg-agency-accent/20 text-agency-accent rounded-lg hover:bg-agency-accent hover:text-white transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Financial Overview</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-xs text-green-400 mb-1">
                  Total Revenue (BDT)
                </p>
                <p className="text-2xl font-bold text-green-400">
                  ৳
                  {project.payments
                    .reduce((sum, p) => sum + (p.amountBDT || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-400 mb-1">
                  Total Revenue (USD)
                </p>
                <p className="text-2xl font-bold text-blue-400">
                  $
                  {project.payments
                    .reduce((sum, p) => sum + (p.amountUSD || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Payment History</h3>
            <div className="space-y-4 max-h-100 overflow-y-auto pr-2">
              {project.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="border-b border-white/5 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium">
                      {payment.amountBDT
                        ? `৳${payment.amountBDT.toLocaleString()}`
                        : `$${payment.amountUSD?.toLocaleString()}`}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(payment.paidAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    {payment.note || "No note"}
                  </p>

                  <div className="space-y-1">
                    {payment.splits.map((split) => (
                      <div
                        key={split.id}
                        className="flex justify-between text-[10px] text-gray-400"
                      >
                        <span>{split.type}</span>
                        <span>
                          {split.amountBDT
                            ? `৳${split.amountBDT}`
                            : `$${split.amountUSD}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {project.payments.length === 0 && (
                <p className="text-gray-500 text-sm">No payments recorded.</p>
              )}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Activity Feed</h3>
            <div className="space-y-4 max-h-100 overflow-y-auto pr-2">
              {project.activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="border-b border-white/5 pb-3 last:border-0 last:pb-0"
                >
                  <p className="text-xs">
                    <span className="font-bold text-agency-accent">
                      {log.user?.name || "System"}
                    </span>{" "}
                    {log.action}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
              {project.activityLogs.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No activity recorded yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
