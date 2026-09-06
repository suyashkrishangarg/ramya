import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { HeroLines } from "@/components/hero-lines";
import { Glow } from "@/components/glow";
import { Reveal } from "@/components/reveal";
import { LiveCounter } from "@/components/live-counter";

import { WaitlistCapsule } from "@/components/waitlist-capsule";
import { GoogleButton } from "@/components/google-button";
import { getCurrentMember } from "@/lib/member";
import { supabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "sign up",
  description:
    "sign up for the ramya ai waitlist — lock your position for the aura desktop beta, the affordable hybrid agent platform. one signup covers ramya flow early access too.",
  alternates: { canonical: "/signup" },
};

type SignupProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/** dedicated signup page — the one place to join the waitlist */
export default async function SignupPage({ searchParams }: SignupProps) {
  // already a member? straight to their profile
  const member = await getCurrentMember();
  if (member) redirect("/profile");

  const params = await searchParams;
  const googleNotice =
    params.google === "unconfigured"
      ? "unconfigured"
      : params.google === "error"
        ? "error"
        : null;
  const googleConfigured = supabaseConfigured();

  return (
    <>
      <Nav member={null} />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <Glow className="left-1/2 top-[-18%] h-[36rem] w-[36rem] -translate-x-1/2" />
          <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 pb-28 pt-36 text-center sm:pt-44">
            <Reveal>
              <p className="eyebrow">
                aura desktop beta
              </p>
            </Reveal>

            <HeroLines
              className="font-display mt-8 text-[12vw] font-bold leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl"
              lines={["get early access."]}
              delay={0.1}
            />

            <Reveal delay={0.35}>
              <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted">
                lock your position — it takes 10 seconds, and one signup covers
                ramya flow early access too.
              </p>
            </Reveal>

            <Reveal delay={0.45}>
              <div className="mt-12 flex w-full flex-col items-center gap-5">
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
                    <GoogleButton label="sign up with google" />
                  </>
                )}
                {googleNotice === "unconfigured" && (
                  <p className="font-mono text-[11px] tracking-[0.03em] text-dim">
                    google sign-up activates once supabase is connected — use the
                    email form above.
                  </p>
                )}
                {googleNotice === "error" && (
                  <p className="font-mono text-[11px] tracking-[0.03em] text-muted">
                    google sign-up hit a snag — use the email form above.
                  </p>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.55}>
              <LiveCounter className="font-mono text-[11px] tracking-[0.05em] text-dim" />
              <p className="mt-3 font-mono text-[11px] tracking-[0.05em] text-dim">
                no spam · free during beta · your position is locked instantly
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}