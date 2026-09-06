import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient, supabaseConfigured } from "@/lib/supabase";
import { MEMBER_COOKIE } from "@/lib/member";

export const dynamic = "force-dynamic";

/**
 * sign out — clears the supabase google session (if any) and the email-member
 * cookie, then returns to the home page.
 */
export async function GET(request: Request) {
  const { origin } = new URL(request.url);

  if (supabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      await supabase.auth.signOut();
    } catch {
      /* session already gone — nothing to do */
    }
  }

  try {
    (await cookies()).delete(MEMBER_COOKIE);
  } catch {
    /* server component context — the redirect response below clears it */
  }

  const res = NextResponse.redirect(new URL("/", origin));
  res.cookies.delete(MEMBER_COOKIE);
  return res;
}