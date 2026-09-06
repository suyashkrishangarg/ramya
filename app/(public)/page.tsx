import { Reveal } from "@/components/reveal";
import { redirect } from "next/navigation";
import nextDynamic from "next/dynamic";
import { NavShell } from "@/components/nav-shell";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/marquee";
import { Manifesto } from "@/components/home/manifesto";
import { Principles } from "@/components/home/principles";
import { ProductCards } from "@/components/home/product-cards";
import { HowItWorks } from "@/components/home/how-it-works";
import { FromIndia } from "@/components/home/from-india";
import { CtaBand } from "@/components/home/cta-band";
import type { FaqItem } from "@/components/faq";
import { FaqSkeleton, BlockSkeleton } from "@/components/skeletons";
import { JsonLd } from "@/components/json-ld";

// below-the-fold interactive widgets — split into their own chunks, loaded
// on scroll so they never block first paint. skeletons keep layout stable.
const CostCalculator = nextDynamic(
  () => import("@/components/cost-calculator").then((m) => m.CostCalculator),
  { loading: () => <BlockSkeleton className="mt-16" /> },
);
const Faq = nextDynamic(() => import("@/components/faq").then((m) => m.Faq), {
  loading: () => <FaqSkeleton />,
});

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "when does the aura desktop beta launch?",
    a: "the beta rolls out in waves over the coming months. waitlist members get invites in order — position #001 first.",
  },
  {
    q: "how much will it cost?",
    a: "the local engine is free — forever. the beta is free too. when cloud reasoning opens up, it's optimized to cost a fraction of frontier pricing, and bring-your-own-key means you can plug in your own api keys.",
  },
  {
    q: "what happens to my files?",
    a: "routine work — search, summaries, formatting — never leaves your machine. only tasks you approve get escalated, and sensitive steps pause for your confirmation before executing.",
  },
  {
    q: "do i need a powerful pc?",
    a: "no. modern laptops handle the local engine fine, and anything too heavy routes to the cloud automatically.",
  },
  {
    q: "what is ramya flow?",
    a: "our upcoming video & animation platform — describe an idea, get a motion piece. every aura signup inherits flow early access.",
  },
];

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  // safety net — if supabase's url configuration falls back to the wrong host
  // (site url still defaulting to localhost), send the oauth code to the real
  // callback handler instead of showing a dead `/?code=…` page.
  const oauthCode = params.code;
  if (typeof oauthCode === "string" && oauthCode.length > 0) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (key === "google" || key === "welcome") continue;
      if (Array.isArray(value)) value.forEach((v) => qs.append(key, v));
      else if (value !== undefined) qs.set(key, value);
    }
    redirect(`/auth/callback?${qs.toString()}`);
  }

  // google sign-up notices now live on the signup page
  if (params.google === "unconfigured" || params.google === "error") {
    redirect(`/signup?google=${params.google}`);
  }

  return (
    <>
      <NavShell />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <Manifesto />
        <Principles />
        <ProductCards />
        <HowItWorks />
        <CostCalculator />
        <FromIndia />
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:py-28">
            <Reveal>
              <p className="eyebrow">questions, answered</p>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="mt-10">
                <Faq items={FAQ_ITEMS} />
              </div>
            </Reveal>
          </div>
        </section>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }}
        />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
