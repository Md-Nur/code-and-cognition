type Pillar = {
  title: "Digital Platforms" | "Intelligent Automation" | "Growth Systems";
  summary: string;
  outcomes: string[];
};

type ApproachStep = {
  title: "Strategy" | "Build" | "Scale";
  summary: string;
  outcomes: string[];
};

const PILLARS: Pillar[] = [
  {
    title: "Digital Platforms",
    summary:
      "Product-grade web and client portals that unify brand, data, and user experience.",
    outcomes: [
      "Unified digital presence",
      "Conversion-ready experiences",
      "Operational clarity",
    ],
  },
  {
    title: "Intelligent Automation",
    summary:
      "Workflow systems that remove manual overhead and keep delivery consistently on track.",
    outcomes: [
      "Automated handoffs",
      "Realtime visibility",
      "Higher team focus",
    ],
  },
  {
    title: "Growth Systems",
    summary:
      "Measurement and iteration frameworks that turn execution into compounding results.",
    outcomes: [
      "Predictable pipelines",
      "Aligned KPIs",
      "Continuous optimization",
    ],
  },
];

const APPROACH: ApproachStep[] = [
  {
    title: "Strategy",
    summary:
      "Clarify market position, customer journeys, and execution priorities.",
    outcomes: ["Roadmap clarity", "Opportunity mapping", "Success metrics"],
  },
  {
    title: "Build",
    summary:
      "Ship modular platforms and automation with enterprise-grade quality.",
    outcomes: [
      "Scalable architecture",
      "Launch-ready assets",
      "Operational alignment",
    ],
  },
  {
    title: "Scale",
    summary:
      "Optimize performance, expand workflows, and institutionalize growth.",
    outcomes: ["Sustained adoption", "Process durability", "Measurable gains"],
  },
];

export default function ServicesSolutions() {
  return (
    <>
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-32 right-[-10%] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-40 left-[-5%] h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
        </div>
        <div className="section-container relative">
          <span className="section-tag mb-6">Enterprise Services</span>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Structured Digital Execution for Growth-Focused Companies
            </h1>
            <p className="text-gray-400 mt-6 text-lg leading-relaxed">
              We align strategy, build execution-ready platforms, and deploy
              automation so your team can scale with confidence.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="/#contact"
                className="btn-brand px-6 py-3 rounded-full text-sm font-semibold"
              >
                Request Proposal
              </a>
              <a
                href="/services#engagement"
                className="px-6 py-3 rounded-full text-sm font-semibold border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition-colors"
              >
                View Engagement Approach
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/5">
        <div className="section-container">
          <div className="max-w-2xl mb-12">
            <span className="section-tag mb-4">Three Core Pillars</span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Solution Architecture, Not Packages
            </h2>
            <p className="text-gray-400 mt-4">
              Each engagement is assembled around the systems required to reach
              your growth targets.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="glass-panel rounded-2xl p-8 border border-white/10"
              >
                <h3 className="text-xl font-semibold mb-3">{pillar.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {pillar.summary}
                </p>
                <div className="space-y-2">
                  {pillar.outcomes.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-gray-300"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-agency-accent" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="engagement"
        className="py-20 border-t border-white/5 bg-linear-to-b from-white/5 to-transparent"
      >
        <div className="section-container">
          <div className="max-w-2xl mb-12">
            <span className="section-tag mb-4">Engagement Approach</span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Strategy -{">"} Build -{">"} Scale
            </h2>
            <p className="text-gray-400 mt-4">
              A clear, repeatable operating model that keeps scope, delivery,
              and outcomes aligned.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {APPROACH.map((step, index) => (
              <div
                key={step.title}
                className="relative glass-panel rounded-2xl p-8 border border-white/10"
              >
                <div className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">
                  Step {index + 1}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {step.summary}
                </p>
                <div className="space-y-2">
                  {step.outcomes.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-gray-300"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-6 right-6 text-4xl font-display font-bold text-white/5">
                  0{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[-40%] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        </div>
        <div className="section-container relative">
          <div className="glass-panel rounded-3xl p-10 md:p-14 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="section-tag mb-4">Strategic Partnership</span>
              <h2 className="text-3xl md:text-4xl font-bold">
                Schedule Strategic Consultation
              </h2>
              <p className="text-gray-400 mt-4">
                Discuss your growth objectives and we will design a tailored
                execution roadmap with a proposal-backed plan.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/#contact"
                className="btn-brand px-6 py-3 rounded-full text-sm font-semibold"
              >
                Schedule Strategic Consultation
              </a>
              <a
                href="/#contact"
                className="px-6 py-3 rounded-full text-sm font-semibold border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition-colors"
              >
                Request Proposal
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
