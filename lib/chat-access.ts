import { eq } from "drizzle-orm";
import { db } from "./db";
import { chatAccess } from "./schema";
import { ensureSchema } from "./bootstrap";

/**
 * chat beta allowlist — invite-only `/chat`.
 * grants come from either source:
 * · CHAT_BETA_EMAILS env (comma-separated, fastest for early testers)
 * · chat_access table rows (durable, manageable per user)
 */

function envEmails(): Set<string> {
  const raw = process.env.CHAT_BETA_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function hasChatAccess(email: string): Promise<boolean> {
  const clean = email.trim().toLowerCase();
  if (!clean) return false;
  if (envEmails().has(clean)) return true;
  try {
    await ensureSchema();
    const rows = await db.select().from(chatAccess).where(eq(chatAccess.email, clean)).limit(1);
    return rows.length > 0;
  } catch {
    /* db unavailable — deny closed rather than fail open */
    return false;
  }
}

export async function grantChatAccess(email: string, grantedBy?: string | null, note?: string | null) {
  const clean = email.trim().toLowerCase();
  if (!clean) throw new Error("invalid email");
  await ensureSchema();
  await db
    .insert(chatAccess)
    .values({ email: clean, grantedBy: grantedBy ?? null, note: note ?? null })
    .onConflictDoNothing({ target: chatAccess.email });
}

export async function revokeChatAccess(email: string) {
  const clean = email.trim().toLowerCase();
  await ensureSchema();
  const { eq: eqOp } = await import("drizzle-orm");
  await db.delete(chatAccess).where(eqOp(chatAccess.email, clean));
}

export async function listChatAccess(): Promise<{ email: string; grantedAt: Date | null }[]> {
  await ensureSchema();
  const { desc } = await import("drizzle-orm");
  const rows = await db.select().from(chatAccess).orderBy(desc(chatAccess.grantedAt));
  return rows.map((r) => ({ email: r.email, grantedAt: r.grantedAt }));
}
