import { GlowCard } from "@/components/glow-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

function Row({ good, text }: { good: boolean; text: string }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-relaxed text-muted">
      {good ? (
        <svg className="mt-0.5 h-4 w-4 shrink-0 text-local" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg className="mt-0.5 h-4 w-4 shrink-0 text-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      )}
      {text}
    </li>
  );
}

/** slide 3 — why hasn't this been solved? the missing bridge */
export function MissingBridge() {
  return (
    <section className="border-t border-line/60 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          kicker="why this problem exists"
          title="the missing bridge"
          sub="users worldwide are forced to choose between two flawed extremes."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <Reveal>
            <GlowCard className="h-full p-7 sm:p-8">
              <p className="font-mono text-[11px] tracking-[0.05em] text-dim">
                extreme 01
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-ink">
                pure cloud ai
              </h3>
              <p className="mt-1 font-mono text-xs tracking-[0.03em] text-dim">
                chatgpt · claude · cursor
              </p>
              <ul className="mt-6 space-y-3.5">
                <Row good text="powerful and easy to use" />
                <Row good={false} text="expensive at frontier rates" />
                <Row good={false} text="strict usage limits interrupt deep work" />
                <Row good={false} text="uploads all data to remote servers" />
              </ul>
            </GlowCard>
          </Reveal>

          <Reveal delay={0.1}>
            <GlowCard className="h-full p-7 sm:p-8">
              <p className="font-mono text-[11px] tracking-[0.05em] text-dim">
                extreme 02
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-ink">
                pure local open-source ai
              </h3>
              <p className="mt-1 font-mono text-xs tracking-[0.03em] text-dim">
                ollama · llama.cpp · manual quantization
              </p>
              <ul className="mt-6 space-y-3.5">
                <Row good text="free and private" />
                <Row good={false} text="complex technical setup" />
                <Row good={false} text="struggles on standard consumer hardware" />
                <Row good={false} text="weak at deep multi-step reasoning" />
              </ul>
            </GlowCard>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="mt-4">
          <GlowCard accent className="px-7 py-8 text-center sm:px-10">
            <p className="font-mono text-[11px] tracking-[0.18em] text-accent">the gap</p>
            <p className="mx-auto mt-3 max-w-2xl text-lg font-medium leading-relaxed tracking-[-0.01em] text-ink">
              no simple desktop app bridges optimized local on-device execution with
              cost-efficient cloud escalation.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-dim">
              today&apos;s workaround: juggling multiple paid subscriptions and copying
              data back and forth. manually.
            </p>
          </GlowCard>
        </Reveal>
      </div>
    </section>
  );
}
