import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { BadgePill } from "@/components/badge-pill";
import { ListRow } from "@/components/list-row";
import { Reveal } from "@/components/reveal";
import { CursorGlow } from "@/components/cursor-glow";
import { TaskRouter } from "@/components/task-router";
import { JsonLd } from "@/components/json-ld";
import { PrimaryButton, GhostButton } from "@/components/buttons";
import { CtaBand } from "@/components/home/cta-band";
import { getCurrentMember } from "@/lib/member";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ramyaai.tech";

export const metadata: Metadata = {
  title: "products",
  description:
    "aura desktop — the universal hybrid agent platform and free local ai engine. ramya flow — the text-to-video generation platform. one hybrid engine: local first, cloud when it counts.",
  alternates: { canonical: "/products" },
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

const ENGINE_ROWS = [
  {
    index: "e1",
    title: "1-click desktop app",
    body: "clean, zero-code interface for both technical and non-technical users. no cli. no config files. install and go.",
  },
  {
    index: "e2",
    title: "free & private local engine",
    body: "routine sub-tasks execute directly on your device — 100% free, 100% private.",
  },
  {
    index: "e3",
    title: "cost-optimized cloud mesh",
    body: "deep reasoning offloads seamlessly to fine-tuned, high-intelligence cloud models.",
  },
  {
    index: "e4",
    title: "user choice & flexibility",
    body: "local inference is 100% free. pay only for cloud power at up to 80% lower cost — with bring-your-own-key support.",
  },
];

type Cell = { text: string; bad?: boolean; good?: boolean };

const COMPARE_COLS = ["pure cloud ai", "pure local ai", "ramya hybrid"];

const COMPARE_ROWS: { label: string; cells: [Cell, Cell, Cell] }[] = [
  {
    label: "monthly cost",
    cells: [
      { text: "$20–$50+ per user", bad: true },
      { text: "$0 (your hardware)", good: true },
      { text: "$0 local + low-cost cloud", good: true },
    ],
  },
  {
    label: "privacy",
    cells: [
      { text: "files uploaded to remote servers", bad: true },
      { text: "fully on-device", good: true },
      { text: "sensitive files never leave your machine", good: true },
    ],
  },
  {
    label: "setup",
    cells: [
      { text: "instant", good: true },
      { text: "complex and technical", bad: true },
      { text: "1-click desktop app", good: true },
    ],
  },
  {
    label: "deep reasoning",
    cells: [
      { text: "strong", good: true },
      { text: "weak on consumer hardware", bad: true },
      { text: "strong — cost-optimized cloud mesh", good: true },
    ],
  },
  {
    label: "usage limits",
    cells: [
      { text: "strict caps interrupt work", bad: true },
      { text: "none", good: true },
      { text: "none on local work", good: true },
    ],
  },
];

function CompareCell({ cell, strong }: { cell: Cell; strong?: boolean }) {
  const mark = cell.bad ? "—" : cell.good ? "+" : "";
  return (
    <span
      className={`text-[13px] leading-relaxed ${
        strong ? "text-ink" : cell.bad ? "text-dim" : "text-muted"
      }`}
    >
      {mark && <span className="mr-1.5 font-mono">{mark}</span>}
      {cell.text}
    </span>
  );
}

const JUMP_CARDS = [
  {
    href: "#aura",
    name: "aura desktop",
    badge: "beta · waitlist open",
    dot: "bg-white",
    body: "the universal hybrid agent platform. one install — every task runs on the cheapest capable layer.",
  },
  {
    href: "#flow",
    name: "ramya flow",
    badge: "in idea · coming later",
    dot: "bg-dim",
    body: "video & animation, generated from words. cloud-rendered — no timeline, no editing software.",
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

export default async function ProductsPage() {
  const member = await getCurrentMember();

  return (
    <>
      <Nav member={member} />
      <main className="flex-1">
        {/* hero */}
        <section className="mx-auto max-w-6xl px-5 pb-20 pt-32 sm:pt-40">
          <Reveal>
            <p className="eyebrow">products</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="font-display mt-7 text-6xl font-bold leading-[1.02] tracking-[-0.035em] text-ink sm:text-8xl">
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
        {/* jump cards */}
        <section className="border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-5 px-5 py-14 md:grid-cols-2">
            {JUMP_CARDS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <CursorGlow className="card-lift block border border-line bg-surface p-8 sm:p-10">
                  <a href={p.href} className="block">
                    <BadgePill dot={p.dot}>{p.badge}</BadgePill>
                    <h2 className="font-display mt-6 text-3xl font-bold tracking-[-0.02em] text-ink">
                      {p.name}
                    </h2>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
                      {p.body}
                    </p>
                    <p className="mt-8 font-mono text-[11px] tracking-[0.12em] text-dim">
                      learn more ➔
                    </p>
                  </a>
                </CursorGlow>
              </Reveal>
            ))}
          </div>
        </section>

        {/* product 01 · aura desktop */}
        <section id="aura" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:py-28 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <div className="flex items-baseline gap-3">
                  <span className="eyebrow">01</span>
                  <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
                </div>
                <h2 className="font-display mt-4 text-3xl font-semibold tracking-[-0.02em] text-ink">
                  aura desktop
                </h2>
                <BadgePill dot="bg-white" pulse className="mt-5">
                  beta · waitlist open
                </BadgePill>
                <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
                  the universal hybrid agent platform — runs routine work locally for
                  free, escalates deep reasoning to cost-optimized cloud models, and
                  automates workflows across your desktop apps. a cost-aware
                  companion to the agentic tools you already use — claude code,
                  cursor, chatgpt — absorbing the routine 80% of the work locally,
                  for free.
                </p>
                <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 font-mono text-[10px] tracking-[0.08em] text-dim">
                  <span>1-click install</span>
                  <span>·</span>
                  <span>byok</span>
                  <span>·</span>
                  <span>ramya flow access — future</span>
                </div>
                <PrimaryButton href="/signup" className="mt-8">
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

          {/* the hybrid engine */}
          <div className="border-t border-line">
            <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
              <Reveal>
                <p className="eyebrow">
                  the hybrid engine
                </p>
                <h3 className="mt-4 max-w-xl text-2xl font-semibold leading-[1.2] tracking-[-0.02em] text-ink sm:text-3xl">
                  every task routes to the cheapest layer capable of doing it.
                </h3>
              </Reveal>
              <div className="mt-10">
                {ENGINE_ROWS.map((f) => (
                  <ListRow key={f.index} {...f} />
                ))}
              </div>
              <Reveal>
                <div className="mt-10">
                  <TaskRouter />
                </div>
              </Reveal>

              {/* why hybrid — comparison */}
              <Reveal>
                <p className="mt-16 eyebrow">
                  why hybrid
                </p>
                <h3 className="mt-4 max-w-xl text-2xl font-semibold leading-[1.2] tracking-[-0.02em] text-ink sm:text-3xl">
                  two flawed extremes — and the engine between them.
                </h3>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="mt-10 overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-left">
                    <thead>
                      <tr>
                        <th className="w-28 pb-4 pr-4 font-mono text-[10px] font-medium tracking-[0.15em] text-dim">
                          compare
                        </th>
                        {COMPARE_COLS.map((c, i) => (
                          <th
                            key={c}
                            className={`pb-4 pr-4 font-mono text-[10px] font-medium tracking-[0.15em] last:pr-0 ${
                              i === 2 ? "text-ink" : "text-dim"
                            }`}
                          >
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARE_ROWS.map((row) => (
                        <tr
                          key={row.label}
                          className="border-t border-line transition-colors duration-150 hover:bg-surface"
                        >
                          <td className="py-4 pr-4 align-top font-mono text-[11px] tracking-[0.05em] text-muted">
                            {row.label}
                          </td>
                          {row.cells.map((cell, i) => (
                            <td
                              key={i}
                              className={`py-4 pr-4 align-top last:pr-0 ${
                                i === 2 ? "border-x border-line-strong bg-surface/60 px-3" : ""
                              }`}
                            >
                              <CompareCell cell={cell} strong={i === 2} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mt-10 border border-line-strong bg-surface px-6 py-6">
                  <p className="font-mono text-[11px] tracking-[0.15em] text-dim">the gap</p>
                  <p className="mt-3 max-w-lg text-lg font-medium leading-relaxed tracking-[-0.01em] text-ink">
                    no simple desktop app bridges optimized local on-device execution with
                    cost-efficient cloud escalation.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-dim">
                    today&apos;s workaround: juggling multiple paid subscriptions and copying
                    data back and forth. manually.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* product 02 · ramya flow */}
        <section id="flow" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:py-28 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <div className="flex items-baseline gap-3">
                  <span className="eyebrow">02</span>
                  <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
                </div>
                <h2 className="font-display mt-4 text-3xl font-semibold tracking-[-0.02em] text-ink">
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
                <GhostButton href="/signup" className="mt-8">
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

        <CtaBand />
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "aura desktop",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Windows, macOS, Linux",
              description:
                "the universal hybrid agent platform — routine ai work runs locally for free, deep reasoning escalates to cost-optimized cloud models, and workflows automate across desktop apps.",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              publisher: { "@type": "Organization", name: "ramya ai" },
            },
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "ramya flow",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Web",
              description:
                "a web-based video & animation generation platform — describe an idea, get a motion piece. in early idea phase.",
              publisher: { "@type": "Organization", name: "ramya ai" },
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "home", item: siteUrl },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "products",
                  item: `${siteUrl}/products`,
                },
              ],
            },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
