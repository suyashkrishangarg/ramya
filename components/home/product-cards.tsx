import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { BadgePill } from "@/components/badge-pill";

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
          <p className="font-mono text-[11px] tracking-[0.2em] text-dim">
            the products
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <Link
                href={p.href}
                className="card-lift block border border-line bg-surface p-8 sm:p-10"
              >
                <BadgePill dot={p.dot}>{p.badge}</BadgePill>
                <h3 className="mt-6 text-3xl font-bold tracking-[-0.02em] text-ink">
                  {p.name}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
                  {p.body}
                </p>
                <p className="link-draw mt-8 inline-block font-mono text-[11px] tracking-[0.12em] text-dim transition-colors duration-150 group-hover:text-ink">
                  learn more ➔
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}