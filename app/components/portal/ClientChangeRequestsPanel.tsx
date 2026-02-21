"use client";

import { useState, useEffect } from "react";
import { ChangeRequest, CRStatus } from "@prisma/client";

type CRWithUser = ChangeRequest & {
    requestedBy: { name: string; role: string };
};

interface Props {
    viewToken: string;
}

function StatusBadge({ status }: { status: CRStatus }) {
    const styles: Record<CRStatus, string> = {
        PENDING: "border-amber-500/30 text-amber-500 bg-amber-500/10",
        APPROVED: "border-emerald-500/30 text-emerald-500 bg-emerald-500/10",
        REJECTED: "border-rose-500/30 text-rose-500 bg-rose-500/10",
    };
    return (
        <span
            className={`text-[10px] px-2 py-0.5 rounded border font-semibold uppercase tracking-wider ${styles[status]}`}
        >
            {status}
        </span>
    );
}

export default function ClientChangeRequestsPanel({ viewToken }: Props) {
    const [crs, setCRs] = useState<CRWithUser[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchCRs() {
        setLoading(true);
        try {
            const res = await fetch(`/api/portal/project/${viewToken}/change-requests`);
            if (res.ok) {
                setCRs(await res.json());
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCRs();
    }, [viewToken]);

    async function handleDecision(crId: string, status: "APPROVED" | "REJECTED") {
        const label = status === "APPROVED" ? "approve" : "reject";
        if (!confirm(`Are you sure you want to ${label} this change request?`))
            return;
        const res = await fetch(`/api/portal/project/${viewToken}/change-requests`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ crId, status }),
        });
        if (res.ok) await fetchCRs();
    }

    if (loading) {
        return <div className="text-gray-500 text-sm py-4">Loading change requests...</div>;
    }

    if (crs.length === 0) {
        return null; // Don't show anything if there are no CRs
    }

    return (
        <section className="mt-10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                </svg>
                Change Requests
                {crs.filter((c) => c.status === "PENDING").length > 0 && (
                    <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 font-bold">
                        {crs.filter((c) => c.status === "PENDING").length} pending
                    </span>
                )}
            </h3>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
                {crs.map((cr) => (
                    <div
                        key={cr.id}
                        className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-amber-500/30 transition-all"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h4 className="font-bold text-base truncate">{cr.title}</h4>
                                    <StatusBadge status={cr.status} />
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    {cr.description}
                                </p>
                                <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-500 font-medium">
                                    {cr.estimatedTimeImpact > 0 && (
                                        <span className="flex items-center gap-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3 w-3"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            +{cr.estimatedTimeImpact} hours
                                        </span>
                                    )}
                                    {cr.estimatedBudgetImpact > 0 && (
                                        <span className="flex items-center gap-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3 w-3"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            {cr.estimatedBudgetImpact.toLocaleString()}
                                        </span>
                                    )}
                                    <span>
                                        Requested on {new Date(cr.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Approve / Reject Actions - ONLY For Pending State */}
                            {cr.status === "PENDING" && (
                                <div className="flex gap-2 shrink-0 md:mt-0 mt-2">
                                    <button
                                        onClick={() => handleDecision(cr.id, "REJECTED")}
                                        className="text-xs px-4 py-2 rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white transition-colors font-semibold"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleDecision(cr.id, "APPROVED")}
                                        className="text-xs px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors font-semibold shadow-lg shadow-emerald-600/20"
                                    >
                                        Approve
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
