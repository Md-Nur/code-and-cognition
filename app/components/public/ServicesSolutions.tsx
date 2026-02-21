type Pillar = {
  title:
  | "Digital Platforms"
  | "Intelligent Automation"
  | "Growth Systems";
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
      "Market-ready digital properties that establish brand authority, deepen customer relationships, and generate sustainable revenue growth across all channels.",
    outcomes: [
      "Revenue-generating customer experiences",
      "Competitive market differentiation",
      "Global brand scalability",
    ],
  },
  {
    title: "Intelligent Automation",
    summary:
      "Intelligent systems that eliminate manual dependencies, reduce operational costs, and accelerate team productivity without sacrificing quality or compliance.",
    outcomes: [
      "Reduced operational overhead",
      "Process accountability & control",
      "Faster execution cycles",
    ],
  },
  {
    title: "Growth Systems",
    summary:
      "Enterprise-grade measurement frameworks and optimization strategies that transform execution into predictable revenue growth and sustainable competitive advantage.",
    outcomes: [
      "Predictable revenue acceleration",
      "Strategic enterprise alignment",
      "Continuous market leadership",
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
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium uppercase tracking-widest text-white/50 mb-8">
              <span className="h-1 w-1 rounded-full bg-agency-accent animate-pulse" />
              Enterprise Solutions
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-8">
              Structured Digital Execution for Growth-Focused Companies
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-12">
              We design platform, automation, and growth systems that keep
              execution focused, measurable, and resilient as you scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <a
                href="#contact"
                className="btn-brand px-8 py-4 rounded-full text-sm font-bold shadow-lg shadow-agency-accent/10"
              >
                Request Proposal
              </a>
              <a
                href="#engagement"
                className="px-8 py-4 rounded-full text-sm font-bold border border-white/10 text-white/80 hover:text-white hover:bg-white/5 hover:border-white/30 transition-all"
              >
                Engagement Approach
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5 relative bg-agency-black">
        <div className="section-container">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-agency-accent mb-4 block">
              Core Pillars
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Solution Architecture <br className="hidden md:block" /> Aligned to Outcomes
            </h2>
            <p className="text-gray-400 text-lg">
              Each engagement is configured around the systems required to
              achieve your growth objectives.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="group relative rounded-3xl p-10 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <div className="w-24 h-24 rounded-full border-2 border-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-agency-accent transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  {pillar.summary}
                </p>
                <div className="space-y-3">
                  {pillar.outcomes.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 text-sm text-gray-300"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-agency-accent/50" />
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
        className="py-24 border-t border-white/5 relative"
      >
        <div className="section-container">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 mb-4 block">
              Engagement Approach
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Strategy &rarr; Build &rarr; Scale
            </h2>
            <p className="text-gray-400 text-lg">
              A repeatable operating model that keeps scope, delivery, and
              outcomes aligned across every phase.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {APPROACH.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-3xl p-10 border border-white/10 bg-white/[0.02] overflow-hidden"
              >
                <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/20 mb-6">
                  Phase 0{index + 1}
                </div>
                <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  {step.summary}
                </p>
                <div className="space-y-3">
                  {step.outcomes.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 text-sm text-gray-300"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute -bottom-6 -right-6 text-[120px] font-display font-black text-white/[0.02]">
                  0{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-agency-accent/5 blur-[120px]" />
        </div>
        <div className="section-container relative">
          <div className="rounded-[40px] p-12 md:p-20 border border-white/10 bg-white/[0.02] flex flex-col items-center text-center">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-agency-accent mb-6 block">
                Start the Conversion
              </span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                Schedule Strategic Consultation
              </h2>
              <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed">
                Share your growth objectives and receive a tailored roadmap
                aligned to measurable execution outcomes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#contact"
                  className="btn-brand px-10 py-5 rounded-full text-base font-bold shadow-xl shadow-agency-accent/20"
                >
                  Schedule Strategic Consultation
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
