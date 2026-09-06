import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { BadgePill } from "@/components/badge-pill";
import { CursorGlow } from "@/components/cursor-glow";

const PRODUCTS = [
  {
    href: "/products",
    name: "aura desktop",
    badge: "beta waitlist open",
    dot: "bg-white",
    body: "the universal hybrid agent platform. one install — every task runs on the cheapest capable layer.",
  },
  {
    href: "/products",
    name: "ramya flow",
    badge: "in idea · coming later",
    dot: "bg-dim",
    body: "video & animation, generated from words. cloud-rendered — no timeline, no editing software.",
  },
];

/** two product cards — click through to /products */
export function ProductCards() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <Reveal>
          <p className="eyebrow">
            the products
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <CursorGlow className="card-lift block border border-line bg-surface p-8 sm:p-10">
                <Link href={p.href} className="block">
                  <BadgePill dot={p.dot}>{p.badge}</BadgePill>
                  <h3 className="font-display mt-6 text-3xl font-bold tracking-[-0.02em] text-ink">
                    {p.name}
                  </h3>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
                    {p.body}
                  </p>
                  <p className="link-draw mt-8 inline-block font-mono text-[11px] tracking-[0.12em] text-dim transition-colors duration-150 group-hover:text-ink">
                    learn more ➔
                  </p>
                </Link>
              </CursorGlow>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}