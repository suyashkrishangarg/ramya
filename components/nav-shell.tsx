import { Suspense } from "react";
import { Nav } from "./nav";
import { NavSkeleton } from "./skeletons";
import { getCurrentMember } from "@/lib/member";

/**
 * streaming nav boundary — the page shell renders instantly; the member
 * lookup (cookies → maybe supabase → maybe db) happens here, behind a
 * skeleton, instead of blocking first paint.
 */
export function NavShell() {
  return (
    <Suspense fallback={<NavSkeleton />}>
      <NavMember />
    </Suspense>
  );
}

async function NavMember() {
  const member = await getCurrentMember();
  return (
    <Nav member={member ? { name: member.name, position: member.position } : null} />
  );
}