import { Reveal } from "@/components/reveal";

/** the hybrid flow in one line — kept from the original engine section */
export function HowItWorks() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border border-line bg-surface px-6 py-5 text-center font-mono text-[11px] tracking-[0.04em] text-muted sm:gap-x-5">
            <span className="text-ink">you give a task</span>
            <span className="text-dim" aria-hidden="true">→</span>
            <span>local engine clears the routine</span>
            <span className="text-dim" aria-hidden="true">→</span>
            <span>cloud mesh clears the deep</span>
            <span className="text-dim" aria-hidden="true">→</span>
            <span className="text-ink">done</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}