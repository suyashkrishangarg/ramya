import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

/**
 * consolidated session layer — admin console + google member sessions.
 * signed HS256 jwt cookies via jose (edge + node compatible).
 */

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "ramya-dev-secret-change-me-in-production",
);

export const ADMIN_COOKIE = "ramya_admin";
export const MEMBER_COOKIE = "ramya_member";
export const OAUTH_COOKIE = "ramya_oauth_state";

const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

/* ── generic jwt helpers ─────────────────────────────────────────────────── */

async function sign(payload: Record<string, unknown>, maxAgeSeconds: number) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + maxAgeSeconds)
    .sign(SECRET);
}

async function verify(token: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

/* ── admin console ────────────────────────────────────────────────────────── */

export type AdminSession = { email: string };

export async function createAdminSession(email: string): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email.trim().toLowerCase())
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7)
    .sign(SECRET);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const payload = await verify(token);
  if (!payload || payload.role !== "admin") return null;
  return { email: String(payload.sub ?? "") };
}

export async function setAdminCookie(token: string) {
  (await cookies()).set(ADMIN_COOKIE, token, { ...COOKIE_BASE, maxAge: 60 * 60 * 24 * 7 });
}

export async function clearAdminCookie() {
  (await cookies()).delete(ADMIN_COOKIE);
}

/** timing-safe credential check against env vars (never hardcoded) */
export function adminCredentialsOk(email: unknown, password: unknown): boolean {
  const envEmail = process.env.ADMIN_EMAIL;
  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envEmail || !envPassword) return false;
  if (typeof email !== "string" || typeof password !== "string") return false;
  const hash = (v: string) => createHash("sha256").update(v).digest();
  return (
    timingSafeEqual(hash(email.trim().toLowerCase()), hash(envEmail.trim().toLowerCase())) &&
    timingSafeEqual(hash(password), hash(envPassword))
  );
}

/* ── member (google sign-up) session ─────────────────────────────────────── */

export type MemberSession = { email: string; name?: string | null; picture?: string | null };

export async function createMemberSession(member: MemberSession): Promise<string> {
  return sign({ role: "member", ...member }, 60 * 60 * 24 * 30); // 30 days
}

export async function getMemberSession(): Promise<MemberSession | null> {
  const token = (await cookies()).get(MEMBER_COOKIE)?.value;
  if (!token) return null;
  const payload = await verify(token);
  if (!payload || payload.role !== "member") return null;
  return {
    email: String(payload.email ?? ""),
    name: (payload.name as string) ?? null,
    picture: (payload.picture as string) ?? null,
  };
}

export async function setMemberCookie(token: string) {
  (await cookies()).set(MEMBER_COOKIE, token, { ...COOKIE_BASE, maxAge: 60 * 60 * 24 * 30 });
}

export async function clearMemberCookie() {
  (await cookies()).delete(MEMBER_COOKIE);
}

/* ── oauth csrf state ────────────────────────────────────────────────────── */

export async function createOauthState(): Promise<string> {
  return sign({ p: "oauth-state" }, 600); // 10 minutes
}

export async function verifyOauthState(token: string): Promise<boolean> {
  const payload = await verify(token);
  return payload?.p === "oauth-state";
}
