import { Reveal } from "@/components/reveal";
import { WaitlistCapsule } from "@/components/waitlist-capsule";
import { GoogleButton } from "@/components/google-button";
import { MemberCard } from "@/components/member-card";

type FinalCtaProps = {
  googleConfigured: boolean;
  member?: { name: string | null; position: number } | null;
  googleNotice?: "unconfigured" | "error" | null;
};

export function FinalCta({ googleConfigured, member, googleNotice }: FinalCtaProps) {
  return (
    <section id="waitlist" className="scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.2em] text-dim">
            06 / limited beta access
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 text-5xl font-bold leading-[1.02] tracking-[-0.035em] text-ink sm:text-7xl">
            be first
            <br />
            in line.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted sm:text-base">
            aura desktop is rolling out in waves. lock your position — it takes 10
            seconds, and one signup covers ramya flow early access too.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-col items-start gap-5">
            {member ? (
              <MemberCard name={member.name} position={member.position} />
            ) : (
              <>
                <WaitlistCapsule />
                {googleConfigured && <GoogleButton label="sign up with google" />}
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
