"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Coins, AlertTriangle, ShieldCheck } from "lucide-react";

export default function RevenueSplitSettings({ projectId, currentCompanyRatio, currentFinderRatio }: { projectId: string; currentCompanyRatio: number; currentFinderRatio: number }) {
    const [companyRatio, setCompanyRatio] = useState((currentCompanyRatio * 100).toString());
    const [finderRatio, setFinderRatio] = useState((currentFinderRatio * 100).toString());
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    const exePool = 100 - (parseFloat(companyRatio) || 0) - (parseFloat(finderRatio) || 0);

    const handleSave = async () => {
        setError("");
        setSuccessMessage("");
        const cr = parseFloat(companyRatio) / 100;
        const fr = parseFloat(finderRatio) / 100;

        if (isNaN(cr) || isNaN(fr) || cr < 0 || fr < 0 || (cr + fr) > 1) {
            setError("Ratios must sum to less than or equal to 100%.");
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch(`/api/project/${projectId}/splits`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ companyFundRatio: cr, finderFeeRatio: fr }),
            });

            if (res.ok) {
                setSuccessMessage("Split ratios successfully updated.");
                setTimeout(() => setSuccessMessage(""), 4000);
            } else {
                const data = await res.json();
                setError(data.error || "Failed to update splits.");
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="glass-panel p-8 rounded-3xl border border-agency-accent/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck className="w-48 h-48" />
            </div>

            <h3 className="text-lg font-semibold text-agency-accent flex items-center gap-2 mb-2 relative z-10">
                <Coins className="w-5 h-5" /> Executive Controls: Revenue Splits
            </h3>
            <p className="text-sm text-amber-500/80 mb-8 max-w-lg relative z-10 flex gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                Changing these values will affect all future payment distributions for this project. Only founders can view or edit this.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 relative z-10">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Company Fund (%)</label>
                    <input
                        type="number"
                        min="0" max="100" step="1"
                        value={companyRatio}
                        onChange={(e) => setCompanyRatio(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-agency-accent/50 focus:ring-1 focus:ring-agency-accent font-medium text-lg"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Finder Fee (%)</label>
                    <input
                        type="number"
                        min="0" max="100" step="1"
                        value={finderRatio}
                        onChange={(e) => setFinderRatio(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-agency-accent/50 focus:ring-1 focus:ring-agency-accent font-medium text-lg"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-agency-accent uppercase tracking-widest">Execution Pool</label>
                    <div className={`w-full bg-agency-accent/5 border ${exePool < 0 ? 'border-red-500/50 text-red-400' : 'border-agency-accent/20 text-agency-accent'} rounded-xl px-4 py-3 font-medium text-lg flex items-center`}>
                        {exePool.toFixed(1)}%
                    </div>
                </div>
            </div>

            {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
            {successMessage && <p className="text-sm text-emerald-400 mb-4">{successMessage}</p>}

            <button
                onClick={handleSave}
                disabled={isSaving || exePool < 0}
                className="px-6 py-3 bg-agency-accent hover:bg-agency-accent/90 focus:ring-2 focus:ring-agency-accent focus:ring-offset-2 focus:ring-offset-black text-agency-dark font-semibold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(230,255,0,0.1)] relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSaving ? "Saving Configuration..." : "Apply Financial Configuration"}
            </button>
        </div>
    );
}
