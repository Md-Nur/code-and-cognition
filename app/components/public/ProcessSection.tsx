export default function ProcessSection() {
    const steps = [
        {
            number: "01",
            icon: "💬",
            title: "Discovery Call",
            description:
                "We start with a free 30-minute call to understand your goals, timeline, and budget. No fluff — just clarity.",
        },
        {
            number: "02",
            icon: "📋",
            title: "Proposal & Scope",
            description:
                "We send a detailed proposal with deliverables, timeline, and transparent pricing in BDT or USD.",
        },
        {
            number: "03",
            icon: "🎨",
            title: "Design & Build",
            description:
                "Our team gets to work. You get regular updates, milestone reviews, and direct access to your project lead.",
        },
        {
            number: "04",
            icon: "🚀",
            title: "Launch & Support",
            description:
                "We launch your project and provide post-launch support to ensure everything runs smoothly.",
        },
    ];

    return (
        <section id="process" style={{ padding: "100px 0", background: "var(--color-bg-card)" }}>
            <div className="section-container">
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "64px" }}>
                    <span className="section-tag" style={{ marginBottom: "16px", display: "inline-flex" }}>
                        ✦ How We Work
                    </span>
                    <h2
                        className="font-display"
                        style={{
                            fontSize: "clamp(2rem, 4vw, 3rem)",
                            fontWeight: 800,
                            marginBottom: "16px",
                        }}
                    >
                        A Process Built for{" "}
                        <span className="gradient-text">Results</span>
                    </h2>
                    <p style={{ color: "var(--color-text-muted)", maxWidth: "480px", margin: "0 auto" }}>
                        We follow a proven 4-step process that keeps projects on time, on budget, and above expectations.
                    </p>
                </div>

                {/* Steps */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "24px",
                    }}
                >
                    {steps.map((step, i) => (
                        <div
                            key={step.number}
                            className="glass-card"
                            style={{ padding: "32px", position: "relative", overflow: "hidden" }}
                        >
                            {/* Step Number Background */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: "-10px",
                                    right: "16px",
                                    fontSize: "5rem",
                                    fontWeight: 900,
                                    color: "rgba(108,99,255,0.06)",
                                    fontFamily: "var(--font-display)",
                                    lineHeight: 1,
                                    userSelect: "none",
                                }}
                            >
                                {step.number}
                            </div>

                            {/* Icon */}
                            <div
                                style={{
                                    fontSize: "2rem",
                                    marginBottom: "16px",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "56px",
                                    height: "56px",
                                    background: "rgba(108,99,255,0.1)",
                                    borderRadius: "14px",
                                    border: "1px solid rgba(108,99,255,0.15)",
                                }}
                            >
                                {step.icon}
                            </div>

                            {/* Connector line (not on last) */}
                            {i < steps.length - 1 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "52px",
                                        right: "-12px",
                                        width: "24px",
                                        height: "2px",
                                        background: "var(--gradient-brand)",
                                        opacity: 0.4,
                                        display: "none",
                                    }}
                                    className="step-connector"
                                />
                            )}

                            <h3
                                className="font-display"
                                style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "10px" }}
                            >
                                {step.title}
                            </h3>
                            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
