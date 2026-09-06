import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { GhostButton } from "@/components/buttons";
import { getCurrentMember } from "@/lib/member";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "profile",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const member = await getCurrentMember();
  if (!member) redirect("/");

  // greet by first name, never by an id
  const first = (member.name ?? "").trim().split(/\s+/)[0];

  return (
    <>
      <Nav member={member} />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:pt-40">
          <p className="font-mono text-[11px] tracking-[0.2em] text-dim">your spot</p>
          <h1 className="font-display mt-7 text-5xl font-bold leading-[1.02] tracking-[-0.035em] text-ink sm:text-7xl">
            hey {first || "there"}.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted sm:text-base">
            your spot in the aura desktop beta is locked. we&apos;ll email you the
            moment it opens — one signup covers ramya flow early access too.
          </p>

          <div className="mt-10 w-full max-w-md border border-line-strong bg-surface px-5 py-5">
            <p className="font-mono text-[11px] tracking-[0.12em] text-muted">
              position in line
            </p>
            <p className="mt-1 font-mono text-4xl font-bold tracking-[-0.02em] text-ink">
              #{String(member.position).padStart(5, "0")}
            </p>
            <dl className="mt-5 space-y-2.5 border-t border-line pt-4 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="font-mono text-[10px] tracking-[0.15em] text-dim">email</dt>
                <dd className="truncate text-muted">{member.email}</dd>
              </div>
              {member.name && (
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="font-mono text-[10px] tracking-[0.15em] text-dim">name</dt>
                  <dd className="truncate text-muted">{member.name}</dd>
                </div>
              )}
              <div className="flex items-baseline justify-between gap-4">
                <dt className="font-mono text-[10px] tracking-[0.15em] text-dim">
                  signed up via
                </dt>
                <dd className="text-muted">{member.source === "google" ? "google" : "email"}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <GhostButton href="/">← back home</GhostButton>
            <GhostButton href="/auth/signout">sign out</GhostButton>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}