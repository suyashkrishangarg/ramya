import { BadgePill } from "@/components/badge-pill";
import { Reveal } from "@/components/reveal";
import { WaitlistCapsule } from "@/components/waitlist-capsule";
import { GoogleButton } from "@/components/google-button";

type HeroProps = {
  welcome: { name: string | null; position: number } | null;
  googleNotice: "unconfigured" | "error" | null;
  googleConfigured: boolean;
};

export function Hero({ welcome, googleNotice, googleConfigured }: HeroProps) {
  return (
    <section className="relative overflow-hidden pb-20 pt-36 sm:pb-28 sm:pt-44">
      {/* ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,black_30%,transparent_75%)]" />
        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute right-[10%] top-[240px] h-[240px] w-[240px] rounded-full bg-cloud/10 blur-[100px]" />
        <div className="absolute left-[8%] top-[340px] h-[200px] w-[200px] rounded-full bg-local/[0.07] blur-[100px]" />
      </div>

      <div className="mx-auto max-w-4xl px-5 text-center">
        <Reveal>
          <BadgePill dot="bg-accent" pulse>
            ✦ closed beta now live
          </BadgePill>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-7 text-[2.6rem] font-bold leading-[1.1] tracking-[-0.035em] text-ink sm:text-6xl md:text-7xl">
            the universal hybrid
            <br />
            agent platform.
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-3 text-[2rem] font-bold leading-[1.1] tracking-[-0.035em] sm:text-5xl md:text-6xl">
            <span className="text-gradient">slashes ai costs by 80%.</span>
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            run routine tasks locally for free. offload complex reasoning to optimized
            cloud models. one desktop app for developers, researchers, lawyers,
            accountants, students — and every power user.
          </p>
        </Reveal>

        <Reveal delay={0.32} className="mt-10 flex flex-col items-center gap-4">
          {welcome ? (
            <WelcomeCard name={welcome.name} position={welcome.position} />
          ) : (
            <>
              <WaitlistCapsule />
              <div className="flex items-center gap-3" aria-hidden="true">
                <span className="h-px w-12 bg-line" />
                <span className="font-mono text-[10px] tracking-[0.15em] text-dim">or</span>
                <span className="h-px w-12 bg-line" />
              </div>
              <GoogleButton configured={googleConfigured} />
              {googleNotice === "unconfigured" && (
                <p className="font-mono text-[11px] tracking-[0.03em] text-dim">
                  google sign-up activates once oauth keys are added — the email form
                  above already works.
                </p>
              )}
              {googleNotice === "error" && (
                <p className="font-mono text-[11px] tracking-[0.03em] text-red-500">
                  google sign-up hit a snag — try the email form above.
                </p>
              )}
            </>
          )}
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.05em] text-muted">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-local" />
              free local execution
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              up to 80% lower cost
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cloud" />
              byok supported
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function WelcomeCard({ name, position }: { name: string | null; position: number }) {
  return (
    <div className="w-full max-w-xl">
      <div className="flex items-center gap-4 rounded-2xl border border-local/40 bg-surface px-5 py-4 text-left">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-local/15 text-local">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">
            {name ? `welcome back, ${name}.` : "welcome back."}
          </p>
          <p className="mt-0.5 font-mono text-xs text-muted">
            you&apos;re #<span className="font-bold text-local">{String(position).padStart(5, "0")}</span>{" "}
            on the waitlist · we&apos;ll email you when the beta opens.
          </p>
        </div>
      </div>
    </div>
  );
}
