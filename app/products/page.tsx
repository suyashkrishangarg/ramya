import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { GlowCard } from "@/components/glow-card";
import { BadgePill } from "@/components/badge-pill";
import { Reveal } from "@/components/reveal";
import { PrimaryButton, GhostButton } from "@/components/buttons";
import { FinalCta } from "@/components/home/final-cta";
import { googleConfigured } from "@/lib/google";

export const metadata: Metadata = {
  title: "products",
  description:
    "aura desktop — the universal hybrid agent platform. ramya flow — autonomous workflow automation. one hybrid engine: local first, cloud when it counts.",
};

const AURA_FEATURES = [
  {
    title: "1-click desktop app",
    body: "clean, zero-code interface for technical and non-technical users. no cli. no config files. install and go.",
    dot: "bg-accent",
  },
  {
    title: "free & private local engine",
    body: "file searches, text summaries, data formatting and routine sub-tasks execute directly on your device — 100% free, 100% private.",
    dot: "bg-local",
  },
  {
    title: "cost-optimized cloud mesh",
    body: "complex multi-step reasoning offloads seamlessly to fine-tuned, high-intelligence cloud models.",
    dot: "bg-cloud",
  },
  {
    title: "byok & flexibility",
    body: "bring your own keys and pay providers directly — or let ramya route for you at up to 80% lower cost.",
    dot: "bg-accent",
  },
];

const FLOW_FEATURES = [
  {
    title: "scheduled agents",
    body: "agents that wake up on a schedule, do the work, and report back.",
  },
  {
    title: "multi-app pipelines",
    body: "chain steps across your desktop tools into one repeatable flow.",
  },
  {
    title: "human-in-the-loop approvals",
    body: "sensitive steps pause for your confirmation before executing.",
  },
  {
    title: "shared team library",
    body: "publish flows your whole team can run — knowledge that compounds.",
  },
];

const AUDIENCES = [
  "developers",
  "researchers",
  "lawyers",
  "accountants",
  "students",
  "power users",
];

export default function ProductsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* hero */}
        <section className="relative overflow-hidden pb-16 pt-36 sm:pt-44">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_30%,black_30%,transparent_75%)]" />
            <div className="absolute left-1/2 top-[-160px] h-[380px] w-[640px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
          </div>
          <div className="mx-auto max-w-3xl px-5 text-center">
            <Reveal>
              <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-accent">
                products
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-[-0.035em] text-ink sm:text-6xl">
                two products.
                <br />
                <span className="text-gradient">one hybrid engine.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                local first, cloud only when it counts. every ramya product is built on
                the same cost-saving hybrid architecture.
              </p>
            </Reveal>
          </div>
        </section>
        {/* product 01 · aura desktop */}
        <section className="mx-auto max-w-6xl px-5 pb-20">
          <Reveal>
            <GlowCard accent className="p-7 sm:p-10" radius="rounded-3xl">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-accent/40 bg-accent/10 font-mono text-xl font-bold text-accent">
                    a
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
                        aura desktop
                      </h2>
                      <BadgePill dot="bg-local" pulse>
                        beta · waitlist open
                      </BadgePill>
                    </div>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                      the universal hybrid agent platform — your flagship desktop app
                      that runs routine work locally for free and escalates deep
                      reasoning to cost-optimized cloud models.
                    </p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-xs tracking-[0.1em] text-dim">
                  product 01
                </span>
              </div>

              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                {AURA_FEATURES.map((f, i) => (
                  <Reveal key={f.title} delay={i * 0.06} className="h-full">
                    <GlowCard className="h-full p-6">
                      <h3 className="flex items-center gap-2 text-[15px] font-medium tracking-[-0.01em] text-ink">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${f.dot}`} />
                        {f.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
                    </GlowCard>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={0.1}>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-line bg-elevated px-6 py-4 text-center font-mono text-[12px] tracking-[0.02em] text-muted sm:gap-3">
                  <span className="text-ink">01 give aura a task</span>
                  <span className="text-dim">→</span>
                  <span className="text-local">02 local engine clears the routine</span>
                  <span className="text-dim">→</span>
                  <span className="text-cloud">03 cloud mesh clears the deep</span>
                  <span className="text-dim">→</span>
                  <span className="text-ink">done</span>
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="mt-8 flex flex-col items-start justify-between gap-5 border-t border-line pt-7 sm:flex-row sm:items-center">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-1 font-mono text-[11px] tracking-[0.05em] text-dim">
                      built for →
                    </span>
                    {AUDIENCES.map((a) => (
                      <span
                        key={a}
                        className="rounded-full border border-line bg-elevated px-2.5 py-1 font-mono text-[11px] tracking-[0.02em] text-muted"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                  <PrimaryButton href="/#waitlist" className="shrink-0">
                    join the aura beta ➔
                  </PrimaryButton>
                </div>
              </Reveal>
            </GlowCard>
          </Reveal>
        </section>
        {/* product 02 · ramya flow */}
        <section className="mx-auto max-w-6xl px-5 pb-24">
          <Reveal>
            <GlowCard
              className="border-cloud/40 p-7 shadow-[0_0_40px_-18px_var(--cloud)] sm:p-10"
              radius="rounded-3xl"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cloud/40 bg-cloud/10 font-mono text-xl font-bold text-cloud">
                    f
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
                        ramya flow
                      </h2>
                      <BadgePill dot="bg-dim">in design · coming soon</BadgePill>
                    </div>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                      autonomous workflow automation on top of the ramya engine —
                      scheduled agents and multi-app pipelines that run where your work
                      actually lives: your desktop.
                    </p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-xs tracking-[0.1em] text-dim">
                  product 02
                </span>
              </div>

              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                {FLOW_FEATURES.map((f, i) => (
                  <Reveal key={f.title} delay={i * 0.06} className="h-full">
                    <GlowCard className="h-full p-6">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-[15px] font-medium tracking-[-0.01em] text-ink">
                          {f.title}
                        </h3>
                        <span className="shrink-0 font-mono text-[10px] tracking-[0.08em] text-dim">
                          planned
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
                    </GlowCard>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.12}>
                <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-line pt-7 sm:flex-row sm:items-center">
                  <p className="max-w-md text-sm leading-relaxed text-dim">
                    flow inherits every aura desktop waitlist signup — join once, get
                    early access to both.
                  </p>
                  <GhostButton href="/#waitlist" className="shrink-0">
                    join waitlist for early access
                  </GhostButton>
                </div>
              </Reveal>
            </GlowCard>
          </Reveal>
        </section>

        <FinalCta googleConfigured={googleConfigured()} />
      </main>
      <Footer />
    </>
  );
}
