import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

/**
 * admin console session — signed HS256 jwt httpOnly cookie via jose.
 * (google member sessions live with supabase auth — see lib/supabase.ts)
 */

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "ramya-dev-secret-change-me-in-production",
);

export const ADMIN_COOKIE = "ramya_admin";

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
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (payload.role !== "admin") return null;
    return { email: String(payload.sub ?? "") };
  } catch {
    return null;
  }
}

export async function setAdminCookie(token: string) {
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
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
