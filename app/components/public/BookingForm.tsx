"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  role: z.string().min(2, "Role is required"),
  goals: z.string().min(10, "Please describe your goals"),
  timeline: z.string().min(2, "Timeline is required"),
  budgetRange: z.string().optional(),
  currentStack: z.string().optional(),
  successMetrics: z.string().optional(),
  additionalNotes: z.string().optional(),
  clientName: z.string().min(2, "Name is required"),
  clientEmail: z.string().email("Invalid email address"),
  clientPhone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type SubCategory = {
  id: string;
  title: string;
};

type Service = {
  id: string;
  title: string;
  subCategories: SubCategory[];
};

interface BookingFormProps {
  defaultServiceId?: string;
}

export default function BookingForm({ defaultServiceId }: BookingFormProps) {
  const [step, setStep] = useState(defaultServiceId ? 2 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState(
    defaultServiceId || "",
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        const servicesData = Array.isArray(data) ? data : [];
        setServices(servicesData);
      });
  }, []);

  const selectedService = services.find((s) => s.id === selectedServiceId);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedServiceId,
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          clientPhone: data.clientPhone,
          discovery: {
            companyName: data.companyName,
            role: data.role,
            goals: data.goals,
            timeline: data.timeline,
            budgetRange: data.budgetRange,
            currentStack: data.currentStack,
            successMetrics: data.successMetrics,
            additionalNotes: data.additionalNotes,
          },
        }),
      });
      if (res.ok) setIsSuccess(true);
      else console.error("Booking failed");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto text-center p-8 glass-panel rounded-2xl animate-fade-in-up">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold mb-2">Request Received!</h3>
        <p className="text-gray-400">
          Thank you for reaching out. Our team will review your project and get
          back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <section id="contact" className="section-container py-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-tag mb-4">Start a Project</span>
          <h2 className="text-4xl font-bold tracking-tight">
            Let's Build Something Amazing
          </h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="glass-panel p-6 md:p-12 rounded-2xl relative overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
            <div
              className="h-full bg-agency-accent transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="space-y-6">
            {/* Step 1: Select Main Service */}
            {step === 1 && (
              <div className="animate-fade-in-up space-y-6">
                <div>
                  <label className="input-label">Select Service Category</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {services.map((srv) => (
                      <button
                        type="button"
                        key={srv.id}
                        onClick={() => {
                          setSelectedServiceId(srv.id);
                        }}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          selectedServiceId === srv.id
                            ? "border-agency-accent bg-agency-accent/10 text-white"
                            : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20"
                        }`}
                      >
                        <div className="font-semibold text-sm">{srv.title}</div>
                        <div className="text-[11px] text-gray-500 mt-1">
                          {srv.subCategories.length} solutions
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={!selectedServiceId}
                    onClick={() => setStep(2)}
                    className="btn-brand disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next Step →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Discovery Form */}
            {step === 2 && selectedService && (
              <div className="animate-fade-in-up space-y-6">
                <div>
                  <label className="input-label">
                    {selectedService.title} — Discovery Brief
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Help us understand the outcomes, constraints, and context so
                    we can design a tailored proposal.
                  </p>
                </div>

                <div>
                  <label className="input-label">Company Name</label>
                  <input
                    {...register("companyName")}
                    className="input-field"
                    placeholder="Acme Holdings"
                  />
                  {errors.companyName && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.companyName.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="input-label">Your Role</label>
                  <input
                    {...register("role")}
                    className="input-field"
                    placeholder="Founder, COO, VP Growth"
                  />
                  {errors.role && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.role.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="input-label">Primary Goals</label>
                  <textarea
                    {...register("goals")}
                    className="input-field min-h-[120px]"
                    placeholder="What outcomes are you aiming for in the next 90-180 days?"
                  />
                  {errors.goals && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.goals.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="input-label">Target Timeline</label>
                  <input
                    {...register("timeline")}
                    className="input-field"
                    placeholder="Q2 launch, 6-8 weeks, ASAP"
                  />
                  {errors.timeline && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.timeline.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="input-label">Budget Range (Optional)</label>
                  <input
                    {...register("budgetRange")}
                    className="input-field"
                    placeholder="$25k-$50k, flexible, TBD"
                  />
                </div>

                <div>
                  <label className="input-label">
                    Current Stack (Optional)
                  </label>
                  <input
                    {...register("currentStack")}
                    className="input-field"
                    placeholder="Webflow, HubSpot, Airtable, Custom"
                  />
                </div>

                <div>
                  <label className="input-label">
                    Success Metrics (Optional)
                  </label>
                  <input
                    {...register("successMetrics")}
                    className="input-field"
                    placeholder="Revenue uplift, conversion rate, cycle time"
                  />
                </div>

                <div>
                  <label className="input-label">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    {...register("additionalNotes")}
                    className="input-field min-h-[120px]"
                    placeholder="Constraints, stakeholders, or must-haves"
                  />
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn-brand"
                  >
                    Next Step →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Contact Info */}
            {step === 3 && (
              <div className="animate-fade-in-up space-y-6">
                <div>
                  <label className="input-label">Your Name</label>
                  <input
                    {...register("clientName")}
                    className="input-field"
                    placeholder="John Doe"
                  />
                  {errors.clientName && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.clientName.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="input-label">Email Address</label>
                  <input
                    {...register("clientEmail")}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                  {errors.clientEmail && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.clientEmail.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="input-label">Phone (Optional)</label>
                  <input
                    {...register("clientPhone")}
                    className="input-field"
                    placeholder="+1 555 123 4567"
                  />
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-brand"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
