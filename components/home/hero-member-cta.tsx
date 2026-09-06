import { MemberCard } from "@/components/member-card";
import { PrimaryButton, GhostButton } from "@/components/buttons";
import { getCurrentMember } from "@/lib/member";

/**
 * hero CTA — member card for signed-in/up visitors, join buttons otherwise.
 * synchronous on purpose: guests resolve instantly (cookie fast-path), so
 * the real buttons render in the first paint — no skeleton flash.
 */
export async function HeroMemberCta() {
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