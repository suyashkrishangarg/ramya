import { NextRequest, NextResponse } from "next/server";
import { buildGoogleAuthUrl, googleConfigured } from "@/lib/google";
import { OAUTH_COOKIE, createOauthState } from "@/lib/session";

export const dynamic = "force-dynamic";

/** kicks off the google sign-up flow */
export async function GET(req: NextRequest) {
  if (!googleConfigured()) {
    return NextResponse.redirect(new URL("/?google=unconfigured", req.url));
  }
  const state = await createOauthState();
  const redirectUri = new URL("/api/auth/google/callback", req.nextUrl.origin).toString();
  const res = NextResponse.redirect(buildGoogleAuthUrl(redirectUri, state));
  res.cookies.set(OAUTH_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
