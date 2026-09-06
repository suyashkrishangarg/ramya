import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { joinWaitlist, toSheetRow } from "@/lib/waitlist";
import { pushRowToSheet } from "@/lib/sheets";

export const dynamic = "force-dynamic";

/**
 * supabase auth callback — exchanges the pkce code for a session, adds the
 * google user to the waitlist, and mirrors the row to google sheets.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/?google=error", origin));
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) throw new Error("google account returned no email");

    const meta = (user.user_metadata ?? {}) as Record<string, string | undefined>;
    const result = await joinWaitlist({
      email: user.email,
      name: meta.full_name ?? meta.name ?? null,
      avatarUrl: meta.avatar_url ?? null,
      source: "google",
      googleId: meta.provider_id ?? user.id,
    });

    if (!result.alreadyRegistered) {
      after(async () => {
        await pushRowToSheet(toSheetRow(result.row));
      });
    }

    return NextResponse.redirect(
      new URL(result.alreadyRegistered ? "/?welcome=back" : "/?welcome=new", origin),
    );
  } catch (err) {
    console.error("[auth] google callback failed:", err);
    return NextResponse.redirect(new URL("/?google=error", origin));
  }
}
