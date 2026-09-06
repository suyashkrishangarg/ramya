import { Reveal } from "@/components/reveal";

/** the differentiator — built in india, for the world */
export function FromIndia() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:py-28">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.2em] text-dim">
            from india, for the world
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-6 text-xl font-medium leading-[1.45] tracking-[-0.01em] text-ink sm:text-2xl">
            the next wave of ai users comes from here — and they deserve ai
            that doesn&apos;t cost a month&apos;s budget. that&apos;s who we build
            for.
          </p>
        </Reveal>
      </div>
    </section>
  );
}