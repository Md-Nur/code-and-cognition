"use client";

import { useState } from "react";
import { ChangeRequest, CRStatus } from "@prisma/client";

type CRWithUser = ChangeRequest & {
  requestedBy: { name: string; role: string };
};

interface Props {
  projectId: string;
  initialCRs: CRWithUser[];
  userRole: string;
  onChangeRequests?: (crs: CRWithUser[]) => void;
}

function StatusBadge({ status }: { status: CRStatus }) {
  const styles: Record<CRStatus, string> = {
    PENDING: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    APPROVED: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    REJECTED: "border-rose-500/30 text-rose-400 bg-rose-500/10",
  };
  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded border font-semibold uppercase tracking-wider ${styles[status]}`}
    >
      {status}
    </span>
  );
}

const EMPTY_FORM = {
  title: "",
  description: "",
  estimatedTimeImpact: 0,
  estimatedBudgetImpact: 0,
};

export default function ChangeRequestsPanel({
  projectId,
  initialCRs,
  userRole,
  onChangeRequests,
}: Props) {
  const [crs, setCRs] = useState<CRWithUser[]>(initialCRs);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isFounder = userRole === "FOUNDER";
  const canCreate = userRole === "FOUNDER" || userRole === "CONTRACTOR";

  async function refreshCRs() {
    const res = await fetch(`/api/admin/projects/${projectId}/change-requests`);
    if (res.ok) {
      const data = await res.json();
      setCRs(data);
      onChangeRequests?.(data);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(
        `/api/admin/projects/${projectId}/change-requests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Failed to create change request");
      } else {
        setShowModal(false);
        setForm(EMPTY_FORM);
        await refreshCRs();
      }
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <div className="glass-panel p-6 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-agency-accent"
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
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
              {crs.filter((c) => c.status === "PENDING").length} pending
            </span>
          )}
        </h3>
        {canCreate && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-brand text-xs px-3 py-1.5"
          >
            + Request Change
          </button>
        )}
      </div>

      {/* Table */}
      {crs.length === 0 ? (
        <p className="text-gray-500 text-sm italic text-center py-6">
          No change requests yet.
        </p>
      ) : (
        <div className="space-y-3">
          {crs.map((cr) => (
            <div
              key={cr.id}
              className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm truncate">
                      {cr.title}
                    </h4>
                    <StatusBadge status={cr.status} />
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                    {cr.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-[10px] text-gray-500">
                    <span>
                      By{" "}
                      <span className="text-gray-300">
                        {cr.requestedBy.name}
                      </span>
                    </span>
                    {cr.estimatedTimeImpact > 0 && (
                      <span>⏱ +{cr.estimatedTimeImpact}h</span>
                    )}
                    {cr.estimatedBudgetImpact > 0 && (
                      <span>
                        💰 +{cr.estimatedBudgetImpact.toLocaleString()}
                      </span>
                    )}
                    <span>{new Date(cr.createdAt).toLocaleDateString()}</span>
                    {cr.clientApprovalAt && (
                      <span>
                        Decided:{" "}
                        {new Date(cr.clientApprovalAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create CR Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-xl animate-fade-in-up">
            <h3 className="text-lg font-bold mb-1">Request a Change</h3>
            <p className="text-xs text-gray-500 mb-5">
              Describe the scope change. A Founder will review and approve or
              reject it.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label">Title *</label>
                <input
                  required
                  className="input-field"
                  placeholder="e.g., Add user authentication module"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label className="input-label">Description *</label>
                <textarea
                  required
                  className="input-field h-28"
                  placeholder="Describe the change in detail and why it is needed..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">
                    Estimated Time Impact (hours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    className="input-field"
                    value={form.estimatedTimeImpact}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        estimatedTimeImpact: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="input-label">Estimated Budget Impact</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="input-field"
                    placeholder="0"
                    value={form.estimatedBudgetImpact}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        estimatedBudgetImpact: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                    setForm(EMPTY_FORM);
                  }}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-brand flex-1"
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
