import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { BadgePill } from "@/components/badge-pill";
import { ListRow } from "@/components/list-row";
import { Reveal } from "@/components/reveal";
import { PrimaryButton, GhostButton } from "@/components/buttons";
import { FinalCta } from "@/components/home/final-cta";
import { supabaseConfigured } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "products",
  description:
    "aura desktop — the universal hybrid agent platform. ramya flow — the video & animation generation platform. one hybrid engine: local first, cloud when it counts.",
};

const AURA_FEATURES = [
  {
    index: "01",
    title: "free & private local engine",
    body: "file searches, text summaries, data formatting and routine sub-tasks execute directly on your device — 100% free, 100% private.",
  },
  {
    index: "02",
    title: "cost-optimized cloud mesh",
    body: "complex multi-step reasoning offloads seamlessly to fine-tuned, high-intelligence cloud models.",
  },
  {
    index: "03",
    title: "scheduled agents",
    body: "agents that wake up on a schedule, do the work, and report back.",
  },
  {
    index: "04",
    title: "multi-app pipelines",
    body: "chain steps across your desktop tools into one repeatable flow.",
  },
  {
    index: "05",
    title: "human-in-the-loop approvals",
    body: "sensitive steps pause for your confirmation before executing.",
  },
  {
    index: "06",
    title: "shared team library",
    body: "publish flows your whole team can run — knowledge that compounds.",
  },
];

const FLOW_FEATURES = [
  {
    index: "01",
    title: "text-to-video generation",
    body: "describe a scene in words — get a video back. no timeline, no editing software.",
  },
  {
    index: "02",
    title: "character & style consistency",
    body: "keep characters, motion and visual style coherent across every shot.",
  },
  {
    index: "03",
    title: "cloud-rendered platform",
    body: "runs fully online — no install, no heavy gpu required.",
  },
  {
    index: "04",
    title: "desktop bridge",
    body: "aura desktop will connect to ramya flow features from the desktop app in the future.",
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
        <section className="mx-auto max-w-6xl px-5 pb-20 pt-32 sm:pt-40">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.2em] text-dim">products</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-7 text-6xl font-bold leading-[1.02] tracking-[-0.035em] text-ink sm:text-8xl">
              two products.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="outline-text text-6xl font-bold leading-[1.05] tracking-[-0.035em] sm:text-8xl">
              one engine.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted">
              local first, cloud only when it counts. every ramya product is built on
              the same cost-saving hybrid architecture.
            </p>
          </Reveal>
        </section>
        {/* product 01 · aura desktop */}
        <section className="border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:py-28 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-dim">01</span>
                  <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-ink">
                  aura desktop
                </h2>
                <BadgePill dot="bg-white" pulse className="mt-5">
                  beta · waitlist open
                </BadgePill>
                <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
                  the universal hybrid agent platform — runs routine work locally for
                  free, escalates deep reasoning to cost-optimized cloud models, and
                  automates workflows across your desktop apps.
                </p>
                <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 font-mono text-[10px] tracking-[0.08em] text-dim">
                  <span>1-click install</span>
                  <span>·</span>
                  <span>byok</span>
                  <span>·</span>
                  <span>ramya flow access — future</span>
                </div>
                <PrimaryButton href="/#waitlist" className="mt-8">
                  join the aura beta ➔
                </PrimaryButton>
              </Reveal>
            </div>

            <div className="md:col-span-8">
              <div>
                {AURA_FEATURES.map((f) => (
                  <ListRow key={f.index} {...f} />
                ))}
              </div>
              <Reveal>
                <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] tracking-[0.08em] text-dim">
                  <span className="text-muted">built for →</span>
                  {AUDIENCES.map((a) => (
                    <span key={a}>{a}</span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* product 02 · ramya flow */}
        <section className="border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:py-28 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-dim">02</span>
                  <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-ink">
                  ramya flow
                </h2>
                <BadgePill dot="bg-dim" className="mt-5">
                  in idea · coming later
                </BadgePill>
                <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
                  a web-based video & animation generation platform. describe an idea —
                  get a motion piece. still in early idea phase; aura desktop will
                  connect to its features in the future.
                </p>
                <GhostButton href="/#waitlist" className="mt-8">
                  join waitlist for early access
                </GhostButton>
              </Reveal>
            </div>

            <div className="md:col-span-8">
              <div>
                {FLOW_FEATURES.map((f) => (
                  <ListRow
                    key={f.index}
                    {...f}
                    right={
                      <span className="font-mono text-[10px] tracking-[0.12em] text-dim">
                        in idea
                      </span>
                    }
                  />
                ))}
              </div>
              <Reveal>
                <p className="mt-8 font-mono text-[11px] leading-relaxed tracking-[0.04em] text-dim">
                  flow inherits every aura desktop waitlist signup — join once, get
                  early access to both.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <FinalCta googleConfigured={supabaseConfigured()} />
      </main>
      <Footer />
    </>
  );
}
