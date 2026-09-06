import { Section, SectionHeader } from "@/components/section";
import { Reveal } from "@/components/reveal";

const TIERS = [
  {
    label: "som",
    note: "immediate target — ai power users & freelancers",
    value: "$1.8M",
    unit: "arr",
    formula: "10,000 power users × $180/yr",
  },
  {
    label: "sam",
    note: "knowledge workers & professionals worldwide",
    value: "$360M",
    unit: "arr",
    formula: "2,000,000 daily ai professionals × $180/yr",
  },
  {
    label: "tam",
    note: "global digital workforce & active desktop ai users",
    value: "$18B+",
    unit: "total market",
    formula: "100,000,000 active users × $180/yr",
  },
];

export function Market() {
  return (
    <Section id="market">
      <SectionHeader
        index="04"
        title="bottom-up market sizing"
        sub="transparent math — every tier is built from real subscriber economics, not hand-waving."
      />

      <div className="md:col-span-8">
        {TIERS.map((tier, i) => (
          <Reveal key={tier.label} delay={i * 0.05}>
            <div className="grid gap-3 border-t border-line py-7 transition-colors duration-150 hover:bg-surface sm:grid-cols-[7rem_1fr] sm:items-baseline sm:gap-8">
              <div>
                <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-ink">
                  {tier.label}
                </p>
                <p className="mt-1 font-mono text-[10px] leading-relaxed text-dim">
                  {tier.note}
                </p>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                <p className="font-mono text-4xl font-bold tracking-[-0.03em] text-ink sm:text-5xl">
                  {tier.value}
                  <span className="ml-2 text-sm font-medium tracking-normal text-dim">
                    {tier.unit}
                  </span>
                </p>
                <p className="font-mono text-[11px] tracking-[0.04em] text-muted">
                  {tier.formula}
                </p>
              </div>
            </div>
          </Reveal>
        ))}

        <Reveal>
          <div className="flex flex-wrap gap-x-8 gap-y-2 border-t border-line py-7 font-mono text-[11px] tracking-[0.05em] text-muted">
            <span>
              <span className="text-ink">80%</span> average cost reduction
            </span>
            <span>
              <span className="text-ink">$0</span> local inference
            </span>
            <span>
              <span className="text-ink">70%+</span> saved by power users who switch
            </span>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
