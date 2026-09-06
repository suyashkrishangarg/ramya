import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { BadgePill } from "@/components/badge-pill";

const CAPABILITIES = [
  "transformer architectures",
  "reinforcement learning",
  "local quantization",
  "token-efficient tool-calling",
];

const VALIDATION = [
  { label: "github · built 'jarvis' — functional open-source ai agent", dot: "bg-ink" },
  { label: "hugging face · fine-tuned lightweight models for tool-calling", dot: "bg-cloud" },
  { label: "focus · eliminating hardware + financial barriers of ai agents", dot: "bg-local" },
];

/** vision + team credibility (slide 7) */
export function Vision() {
  return (
    <section id="vision" className="border-t border-line/60 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading kicker="the vision" title="powerful ai on every computer." />

        <Reveal className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-muted sm:text-xl">
            &quot;we help computer users and professionals across all industries run
            powerful autonomous ai agents at a fraction of the cost — by executing
            routine tasks locally on their hardware and offloading complex reasoning to
            optimized cloud models.&quot;
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {CAPABILITIES.map((c) => (
              <BadgePill key={c} dot={null}>
                {c}
              </BadgePill>
            ))}
          </div>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
          {VALIDATION.map((v, i) => (
            <Reveal key={v.label} delay={i * 0.08} className="h-full">
              <div className="h-full rounded-2xl border border-line bg-surface px-5 py-5 transition-colors duration-150 hover:border-accent/30">
                <span className={`mb-3 block h-1.5 w-1.5 rounded-full ${v.dot}`} />
                <p className="text-[13px] leading-relaxed text-muted">{v.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
