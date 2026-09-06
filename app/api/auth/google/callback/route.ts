import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { exchangeGoogleCode } from "@/lib/google";
import {
  OAUTH_COOKIE,
  createMemberSession,
  setMemberCookie,
  verifyOauthState,
} from "@/lib/session";
import { joinWaitlist, toSheetRow } from "@/lib/waitlist";
import { pushRowToSheet } from "@/lib/sheets";

export const dynamic = "force-dynamic";

/** google oauth callback — creates the member session + waitlist entry */
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = req.cookies.get(OAUTH_COOKIE)?.value;

  const stateValid =
    Boolean(code) && Boolean(state) && Boolean(storedState) && storedState === state;
  if (!stateValid || !(await verifyOauthState(storedState!))) {
    return NextResponse.redirect(new URL("/?google=error", origin));
  }

  try {
    const profile = await exchangeGoogleCode(
      code!,
      new URL("/api/auth/google/callback", origin).toString(),
    );
    const result = await joinWaitlist({
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.picture,
      source: "google",
      googleId: profile.googleId,
    });

    const token = await createMemberSession({
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
    });
    const res = NextResponse.redirect(
      new URL(result.alreadyRegistered ? "/?welcome=back" : "/?welcome=new", origin),
    );
    await setMemberCookie(token);
    res.cookies.delete(OAUTH_COOKIE);

    if (!result.alreadyRegistered) {
      after(async () => {
        await pushRowToSheet(toSheetRow(result.row));
      });
    }
    return res;
  } catch (err) {
    console.error("[auth] google callback failed:", err);
    return NextResponse.redirect(new URL("/?google=error", origin));
  }
}
