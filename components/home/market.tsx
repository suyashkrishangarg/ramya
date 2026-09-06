import { GlowCard } from "@/components/glow-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { StatCounter } from "@/components/stat-counter";

const TIERS = [
  {
    label: "som",
    note: "immediate target",
    value: "$1.8M",
    unit: "arr",
    formula: "10,000 power users × $180/yr",
    dot: "bg-local",
    ring: "border-local/40",
    valueClass: "text-local",
  },
  {
    label: "sam",
    note: "knowledge workers worldwide",
    value: "$360M",
    unit: "arr",
    formula: "2,000,000 daily ai professionals × $180/yr",
    dot: "bg-cloud",
    ring: "border-cloud/40",
    valueClass: "text-cloud",
  },
  {
    label: "tam",
    note: "global digital workforce",
    value: "$18B+",
    unit: "total market",
    formula: "100,000,000 active desktop ai users × $180/yr",
    dot: "bg-accent",
    ring: "border-accent/40",
    valueClass: "text-accent",
  },
];

/** slide 6 — bottom-up market sizing */
export function Market() {
  return (
    <section id="market" className="border-t border-line/60 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          kicker="market opportunity"
          title="bottom-up sizing"
          sub="transparent math — no hand-waving. every tier is built from real subscriber economics."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.label} delay={i * 0.08} className="h-full">
              <GlowCard className={`h-full border-dashed p-7 ${tier.ring}`}>
                <div className="flex items-center gap-2.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${tier.dot}`} />
                  <span className="font-mono text-xs font-bold tracking-[0.1em] text-ink">
                    {tier.label}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.03em] text-dim">
                    · {tier.note}
                  </span>
                </div>
                <p className="mt-6 font-mono text-4xl font-bold tracking-[-0.02em] sm:text-5xl">
                  <span className={tier.valueClass}>{tier.value}</span>{" "}
                  <span className="text-sm font-medium tracking-normal text-dim">
                    {tier.unit}
                  </span>
                </p>
                <p className="mt-6 border-t border-line pt-4 font-mono text-[11px] leading-relaxed tracking-[0.02em] text-muted">
                  {tier.formula}
                </p>
              </GlowCard>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            { value: <StatCounter to={80} suffix="%" />, label: "average ai cost reduction" },
            { value: <StatCounter to={0} prefix="$" />, label: "cost for local inference" },
            { value: <StatCounter to={70} suffix="%+" />, label: "saved by power users who switch" },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="rounded-2xl border border-line bg-surface px-6 py-7 text-center transition-colors duration-150 hover:border-accent/30">
                <p className="font-mono text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 font-mono text-[11px] tracking-[0.05em] text-dim">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
