import { Reveal } from "@/components/reveal";

const PRINCIPLES = [
  {
    index: "01",
    title: "local first",
    body: "routine tasks run on your hardware. free, private, instant.",
  },
  {
    index: "02",
    title: "cloud when it counts",
    body: "deep reasoning escalates to cost-optimized cloud models. up to 80% cheaper.",
  },
  {
    index: "03",
    title: "no sacrifices",
    body: "one desktop app. no cli, no config, no lock-in. install and go.",
  },
];

/** three numbered principles — staggered reveal, hairline columns */
export function Principles() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.2em] text-dim">
            what we believe
          </p>
        </Reveal>
        <div className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.index} delay={i * 0.08}>
              <div className="border-t border-line pt-6">
                <p className="font-mono text-[11px] tracking-[0.15em] text-dim">
                  {p.index}
                </p>
                <h3 className="mt-4 text-lg font-semibold tracking-[-0.01em] text-ink">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}