/**
 * minimal google oauth client (no third-party auth library needed).
 * flow: /api/auth/google → consent → /api/auth/google/callback → member session.
 */

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const USERINFO_ENDPOINT = "https://openidconnect.googleapis.com/v1/userinfo";

export function googleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function buildGoogleAuthUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  return `${AUTH_ENDPOINT}?${params.toString()}`;
}

export type GoogleProfile = {
  googleId: string;
  email: string;
  name: string | null;
  picture: string | null;
};

export async function exchangeGoogleCode(
  code: string,
  redirectUri: string,
): Promise<GoogleProfile> {
  const tokenRes = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!tokenRes.ok) throw new Error(`google token exchange failed (${tokenRes.status})`);
  const tokens = (await tokenRes.json()) as { access_token?: string };

  const infoRes = await fetch(USERINFO_ENDPOINT, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
    signal: AbortSignal.timeout(10_000),
  });
  if (!infoRes.ok) throw new Error(`google userinfo failed (${infoRes.status})`);
  const info = (await infoRes.json()) as {
    sub: string;
    email?: string;
    name?: string;
    picture?: string;
  };
  if (!info.email) throw new Error("google account has no email");

  return {
    googleId: info.sub,
    email: info.email.toLowerCase(),
    name: info.name ?? null,
    picture: info.picture ?? null,
  };
}
