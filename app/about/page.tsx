import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { HeroLines } from "@/components/hero-lines";
import { Glow } from "@/components/glow";
import { Reveal } from "@/components/reveal";
import { ListRow } from "@/components/list-row";
import { PrimaryButton } from "@/components/buttons";
import { getCurrentMember } from "@/lib/member";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "about",
  description:
    "why ramya exists — making ai affordable without sacrifices. local first, cloud when it counts, built in india for the world.",
};

const PRINCIPLES = [
  {
    index: "01",
    title: "affordability without sacrifice",
    body: "the local engine is free. the cloud layer is optimized for cost, not margin.",
  },
  {
    index: "02",
    title: "privacy by design",
    body: "sensitive files never leave your machine.",
  },
  {
    index: "03",
    title: "no lock-in",
    body: "bring your own keys. leave anytime. your data stays yours.",
  },
  {
    index: "04",
    title: "from india, for the world",
    body: "built where ai's next billion users live.",
  },
];

export default async function AboutPage() {
  const member = await getCurrentMember();

  return (
    <>
      <Nav member={member} />
      <main className="flex-1">
        {/* hero */}
        <section className="relative overflow-hidden">
          <Glow className="left-1/2 top-[-30%] h-[32rem] w-[32rem] -translate-x-1/2" />
          <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-36 sm:pt-44">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.2em] text-dim">about</p>
            </Reveal>
            <HeroLines
              className="mt-8 text-[13vw] font-bold leading-[1.02] tracking-[-0.04em] text-ink sm:text-7xl lg:text-[5.2rem]"
              lines={["why ramya exists."]}
              delay={0.1}
            />
          </div>
        </section>

        {/* the story */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:py-28">
            <Reveal>
              <p className="text-xl font-medium leading-[1.5] tracking-[-0.01em] text-ink sm:text-2xl">
                agentic ai arrived transformational — and priced like it. students
                lose access mid-assignment. freelancers burn through credits
                before the client work is done. professionals in india and
                everywhere else get rate-limited at the worst possible moment.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-8 text-base leading-relaxed text-muted">
                the insight is simple: most of what people ask ai is routine.
                your own laptop can do that part for free. only the genuinely
                hard 20% ever needs the cloud.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-6 text-base leading-relaxed text-muted">
                ramya is our answer — a hybrid engine that routes every task to
                the cheapest layer capable of doing it. local first. cloud when
                it counts. that&apos;s how ai becomes affordable without becoming
                weaker.
              </p>
            </Reveal>
          </div>
        </section>

        {/* principles */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.2em] text-dim">
                what we believe
              </p>
            </Reveal>
            <div className="mt-10 md:col-span-12">
              {PRINCIPLES.map((p, i) => (
                <Reveal key={p.index} delay={i * 0.06}>
                  <ListRow index={p.index} title={p.title} body={p.body} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* vision quote */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:py-28">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.2em] text-dim">
                the vision
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-6 text-2xl font-medium leading-[1.4] tracking-[-0.015em] text-ink sm:text-3xl">
                powerful autonomous ai agents on every computer — at a fraction
                of the cost. routine work stays on your hardware; only deep
                reasoning touches the cloud.
              </p>
            </Reveal>
          </div>
        </section>

        {/* cta */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-20 text-center sm:py-24">
            <Reveal>
              <p className="text-lg font-medium tracking-[-0.01em] text-ink">
                sound like the future you want?
              </p>
              <div className="mt-8">
                <PrimaryButton href="/#waitlist">join the beta ➔</PrimaryButton>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}