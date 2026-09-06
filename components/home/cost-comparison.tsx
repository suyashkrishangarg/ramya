import { GlowCard } from "@/components/glow-card";
import { BadgePill } from "@/components/badge-pill";
import { Reveal } from "@/components/reveal";

const OLD_WAY = [
  "frontier model rates for trivial everyday tasks",
  "credits exhausted mid-task by usage limits",
  "every sensitive file uploaded to remote servers",
];

const RAMYA_WAY = [
  { text: "routine sub-tasks run free, on-device", dot: "bg-local" },
  { text: "no rate limits on local work — ever", dot: "bg-local" },
  { text: "sensitive files never leave your machine", dot: "bg-local" },
  { text: "complex reasoning → cost-optimized cloud mesh", dot: "bg-cloud" },
];

/** slide 1 visual — traditional cloud ai vs ramya hybrid engine */
export function CostComparison() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-28">
      <div className="grid gap-4 md:grid-cols-2">
        <Reveal>
          <GlowCard className="h-full p-7 sm:p-8" radius="rounded-3xl">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[11px] tracking-[0.05em] text-dim">
                traditional cloud ai
              </p>
              <BadgePill dot="bg-red-400">the old way</BadgePill>
            </div>
            <p className="mt-6 font-mono text-2xl font-bold tracking-[-0.02em] text-muted sm:text-3xl">
              $30+/mo{" "}
              <span className="text-sm font-medium tracking-normal text-dim">
                + usage limits
              </span>
            </p>
            <ul className="mt-7 space-y-4">
              {OLD_WAY.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </GlowCard>
        </Reveal>

        <Reveal delay={0.1}>
          <GlowCard accent className="h-full p-7 sm:p-8" radius="rounded-3xl">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[11px] tracking-[0.05em] text-accent">
                ramya hybrid engine
              </p>
              <BadgePill dot="bg-accent" pulse>
                the ramya way
              </BadgePill>
            </div>
            <p className="mt-6 font-mono text-2xl font-bold tracking-[-0.02em] text-ink sm:text-3xl">
              $0 local{" "}
              <span className="text-sm font-medium tracking-normal text-dim">
                + low-cost cloud power
              </span>
            </p>
            <ul className="mt-7 space-y-4">
              {RAMYA_WAY.map((row) => (
                <li key={row.text} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${row.dot}`} />
                  {row.text}
                </li>
              ))}
            </ul>
          </GlowCard>
        </Reveal>
      </div>
    </section>
  );
}
