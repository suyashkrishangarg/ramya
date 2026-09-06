import { GlowCard } from "@/components/glow-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { StatCounter } from "@/components/stat-counter";

const CARDS = [
  {
    title: "who faces this",
    body: "anyone using ai daily — developers, researchers, lawyers, accountants, students and power users.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "what happens",
    body: "users pay frontier cloud rates for trivial everyday actions, rapidly exhausting their monthly credits.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: "the pain",
    body: "$20–$50+ per user every month, disruptive rate limits mid-task, and privacy concerns over uploaded files.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z" />
        <path d="M12 9v4m0 4h.01" />
      </svg>
    ),
  },
];

/** slide 2 — the universal token burn */
export function TokenBurn() {
  return (
    <section id="why" className="border-t border-line/60 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          kicker="the problem"
          title="the universal token burn"
          sub="agentic ai is transformational — and structured so that the most common actions cost the most."
        />

        <Reveal className="mx-auto mt-14 max-w-3xl text-center">
          <p className="font-mono text-6xl font-bold tracking-[-0.02em] sm:text-7xl">
            <span className="text-gradient">
              <StatCounter to={80} suffix="%" />
            </span>
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            of agentic ai queries are routine sub-tasks — file search, text formatting,
            summarization. work your own hardware could do for free.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.08} className="h-full">
              <GlowCard className="h-full p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-elevated text-accent">
                  {card.icon}
                </span>
                <h3 className="mt-5 text-base font-medium tracking-[-0.01em] text-ink">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{card.body}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-8">
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-surface px-6 py-4 sm:flex-row sm:gap-4">
            <span className="font-mono text-[11px] tracking-[0.05em] text-accent">
              frequency →
            </span>
            <p className="text-center font-mono text-[13px] tracking-[0.02em] text-muted sm:text-left">
              experienced continuously, multiple times every single day.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
