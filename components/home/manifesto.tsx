import { Reveal } from "@/components/reveal";

/** the manifesto — one large centered statement, no header, no decorations */
export function Manifesto() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-4xl px-5 py-24 sm:py-32">
        <Reveal>
          <p className="text-center text-2xl font-medium leading-[1.4] tracking-[-0.015em] text-ink sm:text-[2rem]">
            today, using ai well means choosing between two bad options: pay
            $20–50 every month for cloud models, or fight with local tools that
            can&apos;t reason.{" "}
            <span className="text-muted">
              80% of what people ask ai is routine — and they pay frontier
              prices for it.
            </span>{" "}
            we think that&apos;s broken.
          </p>
        </Reveal>
      </div>
    </section>
  );
}