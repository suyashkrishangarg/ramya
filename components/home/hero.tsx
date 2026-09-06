import { Reveal } from "@/components/reveal";
import { WaitlistCapsule } from "@/components/waitlist-capsule";
import { GoogleButton } from "@/components/google-button";
import { MemberCard } from "@/components/member-card";

type HeroProps = {
  welcome: { name: string | null; position: number } | null;
  googleNotice: "unconfigured" | "error" | null;
  googleConfigured: boolean;
};

export function Hero({ welcome, googleNotice, googleConfigured }: HeroProps) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 pt-32 sm:pb-28 sm:pt-40">
      <Reveal>
        <p className="font-mono text-[11px] tracking-[0.2em] text-dim">
          waitlist open — aura desktop beta
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <h1 className="mt-7 text-[13.5vw] font-bold leading-[0.98] tracking-[-0.04em] text-ink sm:text-7xl lg:text-[5.4rem]">
          the universal
          <br />
          hybrid agent
          <br />
          platform.
        </h1>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="outline-text mt-1 text-[13.5vw] font-bold leading-[1.05] tracking-[-0.04em] sm:text-7xl lg:text-[5.4rem]">
          80% off ai.
        </p>
      </Reveal>

      <div className="mt-14 grid items-end gap-12 md:grid-cols-12">
        <Reveal delay={0.18} className="md:col-span-5">
          <p className="max-w-sm text-base leading-relaxed text-muted">
            routine tasks run free on your hardware. deep reasoning escalates to
            optimized cloud models. one desktop app for developers, researchers,
            lawyers, accountants, students — every power user.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.08em] text-dim">
            <span>$0 local inference</span>
            <span>·</span>
            <span>byok supported</span>
            <span>·</span>
            <span>private by design</span>
          </div>
        </Reveal>

        <Reveal delay={0.24} className="md:col-span-7">
          <div className="flex flex-col items-start gap-5">
            {welcome ? (
              <MemberCard name={welcome.name} position={welcome.position} />
            ) : (
              <>
                <WaitlistCapsule />
                {googleConfigured && (
                  <>
                    <div className="flex items-center gap-3" aria-hidden="true">
                      <span className="h-px w-10 bg-line-strong" />
                      <span className="font-mono text-[10px] tracking-[0.15em] text-dim">
                        or
                      </span>
                      <span className="h-px w-10 bg-line-strong" />
                    </div>
                    <GoogleButton />
                  </>
                )}
                {googleNotice === "unconfigured" && (
                  <p className="font-mono text-[11px] tracking-[0.03em] text-dim">
                    google sign-up activates once supabase is connected — see readme.
                  </p>
                )}
                {googleNotice === "error" && (
                  <p className="font-mono text-[11px] tracking-[0.03em] text-muted">
                    google sign-up hit a snag — use the email form above.
                  </p>
                )}
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
