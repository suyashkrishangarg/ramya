import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { GhostButton } from "@/components/buttons";
import { getCurrentMember } from "@/lib/member";
import { hasChatAccess } from "@/lib/chat-access";
import { ChatClient } from "@/components/chat/chat-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ramya · chat beta",
  robots: { index: false, follow: false },
};

/** invite-only chat beta — server-side gate, never client-only */
export default async function ChatPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/signup?next=/chat");

  const allowed = await hasChatAccess(member.email);
  if (!allowed) {
    return (
      <>
        <Nav member={member} />
        <main className="flex-1">
          <section className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:pt-40">
            <p className="eyebrow">chat beta</p>
            <h1 className="font-display mt-7 text-5xl font-bold leading-[1.02] tracking-[-0.035em] text-ink sm:text-7xl">
              invite-only, for now.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              you&apos;re in ramya, but not on the chat beta list yet. we&apos;re
              letting a few people in at a time while we tune the agent.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <GhostButton href="/contact">request access</GhostButton>
              <GhostButton href="/profile">back to profile</GhostButton>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav member={member} />
      <main className="flex-1">
        <ChatClient email={member.email} name={member.name ?? null} />
      </main>
      <Footer />
    </>
  );
}
