import { Reveal } from "@/components/reveal";
import { WaitlistCapsule } from "@/components/waitlist-capsule";
import { GoogleButton } from "@/components/google-button";
import { GlowCard } from "@/components/glow-card";

export function FinalCta({ googleConfigured }: { googleConfigured: boolean }) {
  return (
    <section id="waitlist" className="scroll-mt-24 border-t border-line/60 py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-5">
        <Reveal>
          <GlowCard accent className="px-7 py-12 text-center sm:px-12" radius="rounded-3xl">
            <p className="font-mono text-[11px] tracking-[0.18em] text-accent">
              ✦ limited beta access
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] text-ink sm:text-4xl">
              be first in line.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              aura desktop is rolling out in waves. lock your position — it takes 10
              seconds.
            </p>
            <div className="mt-9 flex flex-col items-center gap-4">
              <WaitlistCapsule />
              <GoogleButton configured={googleConfigured} label="sign up with google" />
            </div>
          </GlowCard>
        </Reveal>
      </div>
    </section>
  );
}
