import { cookies } from "next/headers";
import { createSupabaseServerClient, supabaseConfigured } from "./supabase";
import { getMemberByEmail } from "./waitlist";

/**
 * member identity — google signups live in the supabase auth session,
 * email signups get a lightweight `ramya_member` cookie on join.
 * both resolve to the same waitlist row, so the ui treats them identically.
 */

export const MEMBER_COOKIE = "ramya_member";

export type Member = {
  email: string;
  name: string | null;
  position: number;
  source: string; // 'email' | 'google'
};

/** cookie options for the email-signup member cookie (server-readable only) */
export function memberCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // one year — long-lived waitlist membership
  };
}

/**
 * resolve the current member: supabase google session first, then the
 * email-signup cookie. returns null when nobody is signed in / signed up.
 * every failure path degrades to null — pages just show the join state.
 */
export async function getCurrentMember(): Promise<Member | null> {
  let email: string | null = null;
  let name: string | null = null;

  if (supabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        email = user.email;
        const meta = (user.user_metadata ?? {}) as Record<string, string | undefined>;
        name = meta.full_name ?? meta.name ?? null;
      }
    } catch {
      /* session unavailable — fall through to the cookie */
    }
  }

  if (!email) {
    try {
      email = (await cookies()).get(MEMBER_COOKIE)?.value || null;
    } catch {
      return null;
    }
    if (!email) return null;
  }

  try {
    const row = await getMemberByEmail(email);
    if (!row) return null;
    return { email, name: name ?? row.name, position: row.position ?? 0, source: row.source };
  } catch {
    /* db unavailable — degrade to the join state */
    return null;
  }
}