import { desc, eq, sql } from "drizzle-orm";
import { db } from "./db";
import { waitlist, type WaitlistRow } from "./schema";
import { ensureSchema } from "./bootstrap";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type JoinInput = {
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  source?: "email" | "google";
  googleId?: string | null;
};

export type JoinResult = {
  position: number;
  alreadyRegistered: boolean;
  row: WaitlistRow;
};

/** add an email to the waitlist — race-safe position assignment + dedupe */
export async function joinWaitlist(input: JoinInput): Promise<JoinResult> {
  await ensureSchema();
  const email = input.email.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) throw new Error("invalid email");

  const inserted = await db
    .insert(waitlist)
    .values({
      email,
      name: input.name ?? null,
      avatarUrl: input.avatarUrl ?? null,
      source: input.source ?? "email",
      googleId: input.googleId ?? null,
      position: sql`(SELECT COALESCE(MAX(position), 0) + 1 FROM waitlist)`,
    })
    .onConflictDoNothing({ target: waitlist.email })
    .returning();

  if (inserted.length > 0) {
    const row = inserted[0];
    return { position: row.position ?? 0, alreadyRegistered: false, row };
  }

  const existing = await db
    .select()
    .from(waitlist)
    .where(eq(waitlist.email, email))
    .limit(1);
  const row = existing[0];
  if (!row) throw new Error("waitlist lookup failed after conflict");
  return { position: row.position ?? 0, alreadyRegistered: true, row };
}

export async function getMemberByEmail(email: string): Promise<WaitlistRow | null> {
  await ensureSchema();
  const rows = await db
    .select()
    .from(waitlist)
    .where(eq(waitlist.email, email.trim().toLowerCase()))
    .limit(1);
  return rows[0] ?? null;
}

export async function getWaitlistCount(): Promise<number> {
  await ensureSchema();
  const [r] = await db.select({ c: sql<number>`COUNT(*)` }).from(waitlist);
  return Number(r?.c ?? 0);
}

export async function getAllRows(): Promise<WaitlistRow[]> {
  await ensureSchema();
  return db.select().from(waitlist).orderBy(desc(waitlist.createdAt));
}

export async function markAllSynced(): Promise<void> {
  await ensureSchema();
  await db.update(waitlist).set({ lastSyncedAt: new Date() });
}

/** serialize a db row into the flat shape mirrored into google sheets */
export function toSheetRow(row: WaitlistRow) {
  return {
    position: row.position,
    email: row.email,
    name: row.name,
    source: row.source,
    google_id: row.googleId,
    joined_at: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
  };
}

export type WaitlistStats = {
  total: number;
  today: number;
  week: number;
  google: number;
  email: number;
};

export function computeStats(rows: WaitlistRow[]): WaitlistStats {
  const now = Date.now();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  let today = 0;
  let week = 0;
  let google = 0;
  for (const row of rows) {
    const t = row.createdAt instanceof Date ? row.createdAt.getTime() : 0;
    if (t >= startOfDay.getTime()) today++;
    if (t >= weekAgo) week++;
    if (row.source === "google") google++;
  }
  return { total: rows.length, today, week, google, email: rows.length - google };
}
