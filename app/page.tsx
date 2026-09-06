import { redirect } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/marquee";
import { Problem } from "@/components/home/problem";
import { Gap } from "@/components/home/gap";
import { Engine } from "@/components/home/engine";
import { Market } from "@/components/home/market";
import { Vision } from "@/components/home/vision";
import { FinalCta } from "@/components/home/final-cta";
import { supabaseConfigured } from "@/lib/supabase";
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

  const googleNotice =
    params.google === "unconfigured"
      ? "unconfigured"
      : params.google === "error"
        ? "error"
        : null;

  // signed-in google member or signed-up email member → personalized state
  const member = await getCurrentMember();

  return (
    <>
      <Nav member={member} />
      <main className="flex-1">
        <Hero
          welcome={member ? { name: member.name, position: member.position } : null}
          googleNotice={googleNotice}
          googleConfigured={supabaseConfigured()}
        />
        <Marquee />
        <Problem />
        <Gap />
        <Engine />
        <Market />
        <Vision />
        <FinalCta googleConfigured={supabaseConfigured()} member={member} />
      </main>
      <Footer />
    </>
  );
}
