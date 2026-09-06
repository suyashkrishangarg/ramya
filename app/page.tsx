import { redirect } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/marquee";
import { Manifesto } from "@/components/home/manifesto";
import { Principles } from "@/components/home/principles";
import { ProductCards } from "@/components/home/product-cards";
import { HowItWorks } from "@/components/home/how-it-works";
import { FromIndia } from "@/components/home/from-india";
import { CtaBand } from "@/components/home/cta-band";
import { getCurrentMember } from "@/lib/member";

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

  // signed-in google member or signed-up email member → personalized state
  const member = await getCurrentMember();

  return (
    <>
      <Nav member={member} />
      <main className="flex-1">
        <Hero member={member ? { name: member.name, position: member.position } : null} />
        <Marquee />
        <Manifesto />
        <Principles />
        <ProductCards />
        <HowItWorks />
        <FromIndia />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
