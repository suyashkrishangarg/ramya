import { GlowCard } from "@/components/glow-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

const STEPS = [
  {
    n: "01",
    title: "1-click desktop app",
    body: "clean, zero-code interface designed for both technical and non-technical users.",
    dot: "bg-accent",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="14" rx="2" />
        <path d="m9 10 2 2-2 2m4 0h4" />
        <path d="M8 22h8" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "free & private local engine",
    body: "file searches, text summaries, data formatting and routine sub-tasks execute directly on your device.",
    dot: "bg-local",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M9 4v4M4 9h4M9 9h2v2H9zM15 4v4M20 9h-4M15 9h2v2h-2zM9 20v-4M4 15h4M9 15h2v2H9z" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "cost-optimized cloud mesh",
    body: "complex multi-step reasoning offloads seamlessly to fine-tuned, high-intelligence cloud models.",
    dot: "bg-cloud",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19a4.5 4.5 0 1 0-1.13-8.86A7 7 0 1 0 6 17.7" />
        <path d="M8 19h9.5" />
      </svg>
    ),
  },
  {
    n: "04",
    title: "user choice & flexibility",
    body: "local inference is 100% free. pay only for cloud power at up to 80% lower cost — with byok support.",
    dot: "bg-accent",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 2 13 10" />
        <path d="m21 2-5.5 17-2.9-6.6L6 9.5z" />
      </svg>
    ),
  },
];

/** slide 4 — the ramya hybrid architecture */
export function Architecture() {
  return (
    <section id="architecture" className="border-t border-line/60 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          kicker="the solution"
          title="the ramya hybrid architecture"
          sub="a universal, zero-friction desktop ai engine. install once — it just works."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08} className="h-full">
              <GlowCard className="h-full p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-elevated text-accent">
                    {step.icon}
                  </span>
                  <span className="font-mono text-xs font-bold tracking-[0.05em] text-dim">
                    {step.n}
                  </span>
                </div>
                <h3 className="mt-5 flex items-center gap-2 text-[15px] font-medium tracking-[-0.01em] text-ink">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${step.dot}`} />
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{step.body}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15} className="mt-6">
          <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-line bg-surface px-6 py-4 font-mono text-[12px] tracking-[0.02em] text-muted sm:gap-4">
            <span className="text-ink">you give a task</span>
            <span className="text-dim">→</span>
            <span className="text-local">local engine clears the routine</span>
            <span className="text-dim">→</span>
            <span className="text-cloud">cloud mesh clears the deep</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
