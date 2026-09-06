import { Nav } from "./nav";
import { getCurrentMember } from "@/lib/member";

/**
 * member-aware nav. no Suspense/skeleton on purpose: guests resolve with
 * zero network calls (cookie fast-path), so the real nav renders in the
 * first paint. members pay one quick lookup — still no visible flash.
 */
export async function NavShell() {
  const member = await getCurrentMember();
  return (
    <Nav member={member ? { name: member.name, position: member.position } : null} />
  );
}
