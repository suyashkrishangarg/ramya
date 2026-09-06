import type { DashboardMember } from "./dashboard";

/** stats derived client-side from the serialized member list */
export function computeStatsFromMembers(members: DashboardMember[]) {
  const now = Date.now();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

  let today = 0;
  let week = 0;
  let google = 0;
  for (const m of members) {
    const t = new Date(m.createdAt).getTime();
    if (t >= startOfDay.getTime()) today++;
    if (t >= weekAgo) week++;
    if (m.source === "google") google++;
  }
  return { total: members.length, today, week, google, email: members.length - google };
}
