import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { HeroLines } from "@/components/hero-lines";
import { Glow } from "@/components/glow";
import { Reveal } from "@/components/reveal";
import { CursorGlow } from "@/components/cursor-glow";
import { getCurrentMember } from "@/lib/member";
import { KNOWN_LINKS, getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "contact",
  description:
    "talk to the ramya ai team — feedback, partnerships, press, or beta questions.",
};

export default async function ContactPage() {
  const member = await getCurrentMember();

  // socials are admin-managed — same settings that drive the footer
  let links: { label: string; url: string }[] = [];
  try {
    const settings = await getSettings();
    links = KNOWN_LINKS.filter((l) => settings[l.key]).map((l) => ({
      label: l.label,
      url: settings[l.key],
    }));
  } catch {
    /* db unavailable — page still renders with email only */
  }

  return (
    <>
      <Nav member={member} />
      <main className="flex-1">
        {/* hero */}
        <section className="relative overflow-hidden">
          <Glow className="left-1/2 top-[-30%] h-[32rem] w-[32rem] -translate-x-1/2" />
          <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-36 sm:pt-44">
            <Reveal>
              <p className="eyebrow">
                contact
              </p>
            </Reveal>
            <HeroLines
              className="font-display mt-8 text-[13vw] font-bold leading-[1.02] tracking-[-0.04em] text-ink sm:text-7xl lg:text-[5.2rem]"
              lines={["talk to us."]}
              delay={0.1}
            />
          </div>
        </section>

        {/* two columns — intro left, channels right */}
        <section className="border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:py-28 md:grid-cols-2">
            <Reveal>
              <p className="max-w-md text-lg font-medium leading-[1.5] tracking-[-0.01em] text-ink">
                we&apos;re a small team building in public. feedback,
                partnerships, press, beta questions — we read everything, and
                we reply.
              </p>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">
                for beta updates, the fastest path is still the{" "}
                <a
                  href="/signup"
                  className="link-draw text-ink transition-colors duration-150"
                >
                  sign-up page
                </a>{" "}
                — every member gets an email the moment the aura desktop beta
                opens.
              </p>
            </Reveal>

            <div className="flex flex-col gap-5">
              <Reveal delay={0.08}>
                <CursorGlow className="card-lift block border border-line bg-surface p-6">
                  <a href="mailto:ramya.ai.official@gmail.com" className="block">
                    <p className="font-mono text-[10px] tracking-[0.15em] text-dim">
                      email
                    </p>
                    <p className="mt-3 font-mono text-sm text-ink">
                      ramya.ai.official@gmail.com
                    </p>
                    <p className="mt-2 font-mono text-[11px] tracking-[0.05em] text-dim">
                      replies usually within a day ↗
                    </p>
                  </a>
                </CursorGlow>
              </Reveal>

              {links.map((l, i) => (
                <Reveal key={l.label} delay={0.12 + i * 0.05}>
                  <CursorGlow className="card-lift block border border-line bg-surface p-6">
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <p className="font-mono text-[10px] tracking-[0.15em] text-dim">
                        social
                      </p>
                      <p className="mt-3 font-mono text-sm text-ink">
                        {l.label} ↗
                      </p>
                    </a>
                  </CursorGlow>
                </Reveal>
              ))}

              <Reveal delay={0.2}>
                <CursorGlow className="block border border-line bg-surface p-6">
                  <p className="font-mono text-[10px] tracking-[0.15em] text-dim">
                    location
                  </p>
                  <p className="mt-3 font-mono text-sm text-ink">india · remote</p>
                </CursorGlow>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}