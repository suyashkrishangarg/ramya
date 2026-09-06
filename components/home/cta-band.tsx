import { Reveal } from "@/components/reveal";
import { PrimaryButton } from "@/components/buttons";

/** slim closing CTA — points to the dedicated /signup page */
export function CtaBand() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 text-center sm:py-24">
        <Reveal>
          <p className="eyebrow">
            limited beta access
          </p>
          <h2 className="font-display mt-5 text-3xl font-bold tracking-[-0.025em] text-ink sm:text-4xl">
            be first in line.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            one signup covers aura desktop and ramya flow early access.
          </p>
          <div className="mt-8">
            <PrimaryButton href="/signup">sign up ➔</PrimaryButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}