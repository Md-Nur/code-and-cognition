"use client";

import { useState } from "react";
import { Booking, Service } from "@prisma/client";
import { Plus, Trash2, ChevronRight, ChevronLeft, FileText, CheckCircle2 } from "lucide-react";
import { createProposalForBooking, sendProposal } from "@/app/actions/proposals";
import { useRouter } from "next/navigation";

interface ProposalFormProps {
    lead: Booking & { service: Service | null };
}

export default function ProposalForm({ lead }: ProposalFormProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        scopeSummary: lead.message || "",
        deliverables: ["Initial consultation", "Project roadmap"],
        milestones: ["Project Kickoff", "Final Delivery"],
        budgetBDT: lead.budgetBDT || 0,
        budgetUSD: lead.budgetUSD || 0,
        currency: (lead.budgetUSD ? "USD" : "BDT") as "USD" | "BDT",
        estimatedDays: 30,
        paymentTerms: "50% upfront, 50% on completion",
        contractText: `This agreement is made between Code & Cognition and ${lead.clientName}.`,
        notes: "",
    });

    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [ignoreWarning, setIgnoreWarning] = useState(false);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const addDeliverable = () => setFormData({ ...formData, deliverables: [...formData.deliverables, ""] });
    const removeDeliverable = (index: number) => setFormData({
        ...formData,
        deliverables: formData.deliverables.filter((_, i) => i !== index)
    });
    const updateDeliverable = (index: number, value: string) => {
        const newDeliverables = [...formData.deliverables];
        newDeliverables[index] = value;
        setFormData({ ...formData, deliverables: newDeliverables });
    };

    const addMilestone = () => setFormData({ ...formData, milestones: [...formData.milestones, ""] });
    const removeMilestone = (index: number) => setFormData({
        ...formData,
        milestones: formData.milestones.filter((_, i) => i !== index)
    });
    const updateMilestone = (index: number, value: string) => {
        const newMilestones = [...formData.milestones];
        newMilestones[index] = value;
        setFormData({ ...formData, milestones: newMilestones });
    };

    const handleSubmit = async () => {
        const currentBudget = formData.currency === "USD" ? formData.budgetUSD : formData.budgetBDT;
        if ((currentBudget === 0 || currentBudget < 5) && !ignoreWarning) {
            showToast("Warning: Budget is zero or under 5. Press submit again to confirm.");
            setIgnoreWarning(true);
            return;
        }

        setLoading(true);
        let proposalId: string | null = null;
        try {
            const res = await createProposalForBooking({
                bookingId: lead.id,
                scopeSummary: formData.scopeSummary,
                deliverables: formData.deliverables.filter(d => d.trim() !== ""),
                milestones: formData.milestones.filter(m => m.trim() !== ""),
                budgetBDT: formData.currency === "BDT" ? formData.budgetBDT : null,
                budgetUSD: formData.currency === "USD" ? formData.budgetUSD : null,
                currency: formData.currency,
                estimatedDays: formData.estimatedDays,
                paymentTerms: formData.paymentTerms,
                contractText: formData.contractText,
                notes: formData.notes,
            });

            if (res.ok && res.proposal) {
                proposalId = res.proposal.id;
            } else {
                showToast("Failed to create proposal");
                setLoading(false);
                return;
            }
        } catch (error) {
            console.error("Error creating proposal:", error);
            showToast("An error occurred while creating the proposal");
            setLoading(false);
            return;
        }

        // Send the proposal email — don't block the redirect on send failure
        try {
            const sendRes = await sendProposal({ proposalId: proposalId! });
            if (!sendRes.ok) {
                console.error("Failed to send proposal email", sendRes.error);
            }
        } catch (error) {
            console.error("Error sending proposal email:", error);
        }

        // Always redirect after successful proposal creation
        router.push("/dashboard/proposals");
        router.refresh();
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-12 relative px-4">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0" />
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= i ? "bg-agency-accent border-agency-accent text-black scale-110" : "bg-black border-white/10 text-gray-500"
                            }`}
                    >
                        {step > i ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold">{i}</span>}
                    </div>
                ))}
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/10 min-h-[500px] flex flex-col">
                {step === 1 && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <h2 className="text-xl font-bold mb-2">Project Scope</h2>
                            <p className="text-gray-400 text-sm mb-4">Define the high-level objectives and summary of the work.</p>
                            <textarea
                                className="input-field min-h-[200px] text-lg leading-relaxed"
                                placeholder="Describe the project scope in detail..."
                                value={formData.scopeSummary}
                                onChange={(e) => setFormData({ ...formData, scopeSummary: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-bold">Deliverables</h2>
                                    <p className="text-gray-400 text-sm">Concrete outputs the client will receive.</p>
                                </div>
                                <button onClick={addDeliverable} className="btn-outline py-2 px-4 text-xs flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Deliverable
                                </button>
                            </div>
                            <div className="space-y-3">
                                {formData.deliverables.map((d, i) => (
                                    <div key={i} className="flex gap-3">
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={d}
                                            onChange={(e) => updateDeliverable(i, e.target.value)}
                                            placeholder={`Deliverable #${i + 1}`}
                                        />
                                        <button onClick={() => removeDeliverable(i)} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-bold">Phases & Milestones</h2>
                                    <p className="text-gray-400 text-sm">Key progress points throughout the timeline.</p>
                                </div>
                                <button onClick={addMilestone} className="btn-outline py-2 px-4 text-xs flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Milestone
                                </button>
                            </div>
                            <div className="space-y-3">
                                {formData.milestones.map((m, i) => (
                                    <div key={i} className="flex gap-3">
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={m}
                                            onChange={(e) => updateMilestone(i, e.target.value)}
                                            placeholder={`Milestone #${i + 1}`}
                                        />
                                        <button onClick={() => removeMilestone(i)} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-xl font-bold mb-2">Investment</h2>
                                <p className="text-gray-400 text-sm mb-4">Set the pricing and currency for this proposal.</p>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setFormData({ ...formData, currency: "USD" })}
                                            className={`flex-1 py-3 rounded-xl border font-bold transition-all ${formData.currency === "USD" ? "bg-agency-accent border-agency-accent text-black" : "border-white/10 hover:border-white/20"}`}
                                        >
                                            USD
                                        </button>
                                        <button
                                            onClick={() => setFormData({ ...formData, currency: "BDT" })}
                                            className={`flex-1 py-3 rounded-xl border font-bold transition-all ${formData.currency === "BDT" ? "bg-agency-accent border-agency-accent text-black" : "border-white/10 hover:border-white/20"}`}
                                        >
                                            BDT
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                                            {formData.currency === "USD" ? "$" : "৳"}
                                        </span>
                                        <input
                                            type="number"
                                            className="input-field pl-10 text-xl font-mono"
                                            value={formData.currency === "USD" ? formData.budgetUSD : formData.budgetBDT}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                [formData.currency === "USD" ? "budgetUSD" : "budgetBDT"]: parseFloat(e.target.value) || 0
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-2">Timeline</h2>
                                <p className="text-gray-400 text-sm mb-4">Estimated duration to complete the project.</p>
                                <div className="relative">
                                    <input
                                        type="number"
                                        className="input-field pr-16 text-xl font-mono"
                                        value={formData.estimatedDays}
                                        onChange={(e) => setFormData({ ...formData, estimatedDays: parseInt(e.target.value) || 0 })}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                        Days
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-2">Payment Terms</h2>
                            <p className="text-gray-400 text-sm mb-4">Define how and when payments should be made.</p>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.paymentTerms}
                                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                                placeholder="Splits, percentages, or conditions..."
                            />
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6 animate-fade-in flex-grow flex flex-col">
                        <div>
                            <h2 className="text-xl font-bold mb-2">Contract & Legal</h2>
                            <p className="text-gray-400 text-sm mb-4">Review or customize the agreement text for the PDF.</p>
                            <textarea
                                className="input-field min-h-[300px] font-mono text-sm leading-relaxed"
                                value={formData.contractText}
                                onChange={(e) => setFormData({ ...formData, contractText: e.target.value })}
                            />
                        </div>
                        <div className="mt-4 p-4 bg-agency-accent/10 rounded-2xl border border-agency-accent/20 flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-full bg-agency-accent/20 flex items-center justify-center text-agency-accent">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm font-bold">PDF Ready</p>
                                <p className="text-xs text-gray-500 text-balance">The proposal PDF will be automatically generated with these terms.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center mt-auto pt-8 border-t border-white/5">
                    <button
                        onClick={() => setStep(step - 1)}
                        disabled={step === 1}
                        className="btn-outline py-3 px-6 flex items-center gap-2 disabled:opacity-30"
                    >
                        <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    {step < 4 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="btn-brand py-3 px-8 flex items-center gap-2"
                        >
                            Next Step <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="btn-brand py-3 px-12 font-bold"
                        >
                            {loading ? "Generating..." : "Create & Send Proposal"}
                        </button>
                    )}
                </div>
            </div>

            {/* Toast rendering */}
            {toastMsg && (
                <div className="fixed bottom-4 right-4 bg-black/80 text-white px-6 py-3 rounded-xl border border-white/10 shadow-2xl z-50 animate-fade-in flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">{toastMsg}</span>
                </div>
            )}
        </div>
    );
}
