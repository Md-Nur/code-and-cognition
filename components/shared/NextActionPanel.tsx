import React, { ReactNode } from "react";
import { getNextAction, NextActionKey } from "@/lib/next-action";

type MilestoneStatusKey = "PENDING" | "IN_PROGRESS" | "COMPLETED";
type ProjectStatusKey = "ACTIVE" | "DELIVERED" | "COMPLETED" | "CANCELLED";

type NextActionInput = {
    status: ProjectStatusKey;
    health: "GREEN" | "YELLOW" | "RED";
    milestones: { status: MilestoneStatusKey }[];
    booking?: { budgetBDT?: number | null; budgetUSD?: number | null } | null;
    payments: { amountBDT?: number | null; amountUSD?: number | null }[];
    pendingChangeRequests?: number;
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
        titleClass: "text-emerald-300",
        panelClass:
            "border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent",
        iconClass: "bg-emerald-500/15 text-emerald-300",
        pillClass: "border-emerald-500/30 text-emerald-300 bg-emerald-500/15",
        pillText: "Feedback Needed",
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
    HEALTH_ISSUE: {
        label: "Attention Required",
        titleClass: "text-amber-300",
        panelClass:
            "border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent",
        iconClass: "bg-amber-500/15 text-amber-300",
        pillClass: "border-amber-500/30 text-amber-300 bg-amber-500/15",
        pillText: "Warning",
        roleCopy: {
            FOUNDER:
                "Project health is currently non-green. Internal review may be needed.",
            CONTRACTOR:
                "Project health alert. Check with founder for updated priorities.",
            CLIENT:
                "We've flagged some minor blockers. Project health is currently yellow/red.",
            DEFAULT: "Project health needs attention.",
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
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
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
    projectInput: NextActionInput,
    pendingChangeRequests: number,
): string | null {
    if (key === "CHANGE_REQUEST_REVIEW" && pendingChangeRequests > 0) {
        return `${pendingChangeRequests} pending change request${pendingChangeRequests === 1 ? "" : "s"
            }.`;
    }

    if (key === "PAYMENT_DUE" && projectInput.booking) {
        const totalPaidBDT = projectInput.payments.reduce(
            (sum, payment) => sum + (payment.amountBDT ?? 0),
            0,
        );
        const totalPaidUSD = projectInput.payments.reduce(
            (sum, payment) => sum + (payment.amountUSD ?? 0),
            0,
        );
        if (projectInput.booking.budgetBDT) {
            const remaining = Math.max(projectInput.booking.budgetBDT - totalPaidBDT, 0);
            return `Remaining: ৳${remaining.toLocaleString()}.`;
        }
        if (projectInput.booking.budgetUSD) {
            const remaining = Math.max(projectInput.booking.budgetUSD - totalPaidUSD, 0);
            return `Remaining: $${remaining.toLocaleString()}.`;
        }
    }

    return null;
}

interface NextActionPanelProps {
    project: NextActionInput;
    pendingChangeRequests: number;
    userRole: string;
}

export default function NextActionPanel({
    project,
    pendingChangeRequests,
    userRole,
}: NextActionPanelProps) {
    const nextAction = getNextAction({
        status: project.status,
        health: project.health,
        milestones: project.milestones,
        booking: project.booking,
        payments: project.payments,
        pendingChangeRequests,
    });

    const nextActionConfig = NEXT_ACTION_CONFIG[nextAction.key];
    const nextActionCopy = getNextActionCopy(nextAction.key, userRole);
    const nextActionMeta = getNextActionMeta(
        nextAction.key,
        project,
        pendingChangeRequests,
    );

    // Dynamic config overrides for HEALTH_ISSUE based on RED/YELLOW
    let activeConfig = { ...nextActionConfig };
    if (nextAction.key === "HEALTH_ISSUE") {
        if (project.health === "RED") {
            activeConfig.titleClass = "text-rose-300";
            activeConfig.panelClass = "border-rose-500/30 bg-gradient-to-br from-rose-500/15 via-rose-500/5 to-transparent";
            activeConfig.iconClass = "bg-rose-500/15 text-rose-300";
            activeConfig.pillClass = "border-rose-500/30 text-rose-300 bg-rose-500/15";
            activeConfig.pillText = "Critical";
            activeConfig.label = "Critical Status";
        } else {
            // YELLOW - use default amber from config
            activeConfig.pillText = "Warning";
            activeConfig.label = "Risk Detected";
        }
    }

    return (
        <div
            className={`glass-panel p-6 rounded-2xl border relative overflow-hidden ${activeConfig.panelClass}`}
        >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div
                    className={`h-11 w-11 rounded-xl flex items-center justify-center ${activeConfig.iconClass}`}
                >
                    {activeConfig.icon}
                </div>
                <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                        Next Action Required
                    </p>
                    <h2 className={`text-xl font-bold ${activeConfig.titleClass}`}>
                        {activeConfig.label}
                    </h2>
                    <p className="text-sm text-gray-300 mt-1">{nextActionCopy}</p>
                    {nextActionMeta && (
                        <p className="text-xs text-gray-400 mt-2">{nextActionMeta}</p>
                    )}
                </div>
                <div className="sm:ml-auto">
                    <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${activeConfig.pillClass}`}
                    >
                        {activeConfig.pillText}
                    </span>
                </div>
            </div>
        </div>
    );
}
