import { Suspense } from "react";
import { HeroCtaSkeleton } from "@/components/skeletons";
import { MemberCard } from "@/components/member-card";
import { PrimaryButton, GhostButton } from "@/components/buttons";
import { getCurrentMember } from "@/lib/member";

/**
 * hero CTA streaming boundary — the hero headline and copy flush to the
 * browser immediately; only this small area (join buttons or member card)
 * waits for the member lookup, showing a skeleton meanwhile.
 */
export function HeroMemberCta() {
  return (
    <Suspense fallback={<HeroCtaSkeleton />}>
      <ResolveCta />
    </Suspense>
  );
}

async function ResolveCta() {
  const member = await getCurrentMember();
  if (member) {
    return (
      <div className="mt-10 flex flex-col items-center gap-6">
        <MemberCard name={member.name} position={member.position} />
        <GhostButton href="/products">see the products →</GhostButton>
      </div>
    );
  }
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
      <PrimaryButton href="/signup">join the beta ➔</PrimaryButton>
      <GhostButton href="/products">see the products →</GhostButton>
    </div>
  );
}