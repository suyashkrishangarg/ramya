import { Section, SectionHeader } from "@/components/section";
import { Reveal } from "@/components/reveal";

const CAPABILITIES = [
  "transformer architectures",
  "reinforcement learning",
  "local quantization",
  "token-efficient tool-calling",
];

export function Vision() {
  return (
    <Section id="vision">
      <SectionHeader index="05" title="the vision" />

      <div className="md:col-span-8">
        <Reveal>
          <p className="max-w-2xl text-2xl font-medium leading-[1.35] tracking-[-0.015em] text-ink sm:text-3xl">
            powerful autonomous ai agents on every computer — at a fraction of the
            cost. routine work stays on your hardware; only deep reasoning touches
            the cloud.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted">
            we help computer users and professionals across all industries run
            powerful ai agents at a fraction of the cost — executing routine tasks
            locally and offloading complex reasoning to optimized cloud models.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] tracking-[0.08em] text-dim">
            {CAPABILITIES.map((c) => (
              <span key={c}>
                {c}
                <span className="ml-3 text-line-strong" aria-hidden="true">
                  /
                </span>
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
