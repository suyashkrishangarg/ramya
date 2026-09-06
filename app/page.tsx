import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/home/hero";
import { CostComparison } from "@/components/home/cost-comparison";
import { TokenBurn } from "@/components/home/token-burn";
import { MissingBridge } from "@/components/home/missing-bridge";
import { Architecture } from "@/components/home/architecture";
import { Market } from "@/components/home/market";
import { Vision } from "@/components/home/vision";
import { FinalCta } from "@/components/home/final-cta";
import { getMemberSession } from "@/lib/session";
import { getMemberByEmail } from "@/lib/waitlist";
import { googleConfigured } from "@/lib/google";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const googleNotice =
    params.google === "unconfigured"
      ? "unconfigured"
      : params.google === "error"
        ? "error"
        : null;

  // returning google member → personalized hero state
  let welcome: { name: string | null; position: number } | null = null;
  const member = await getMemberSession();
  if (member) {
    try {
      const row = await getMemberByEmail(member.email);
      if (row) {
        welcome = { name: member.name ?? row.name, position: row.position ?? 0 };
      }
    } catch {
      /* db unavailable — degrade to the standard capsule */
    }
  }

  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero
          welcome={welcome}
          googleNotice={googleNotice}
          googleConfigured={googleConfigured()}
        />
        <CostComparison />
        <TokenBurn />
        <MissingBridge />
        <Architecture />
        <Market />
        <Vision />
        <FinalCta googleConfigured={googleConfigured()} />
      </main>
      <Footer />
    </>
  );
}
