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
import { createSupabaseServerClient, supabaseConfigured } from "@/lib/supabase";
import { getMemberByEmail } from "@/lib/waitlist";

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

  // returning google member (supabase session) → personalized hero state
  let welcome: { name: string | null; position: number } | null = null;
  if (supabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        const row = await getMemberByEmail(user.email);
        if (row) {
          const meta = (user.user_metadata ?? {}) as Record<string, string | undefined>;
          welcome = { name: meta.full_name ?? row.name, position: row.position ?? 0 };
        }
      }
    } catch {
      /* db or session unavailable — degrade to the standard capsule */
    }
  }

  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero
          welcome={welcome}
          googleNotice={googleNotice}
          googleConfigured={supabaseConfigured()}
        />
        <Marquee />
        <Problem />
        <Gap />
        <Engine />
        <Market />
        <Vision />
        <FinalCta googleConfigured={supabaseConfigured()} />
      </main>
      <Footer />
    </>
  );
}
