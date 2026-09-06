import { sql } from "drizzle-orm";
import { db } from "./db";
import { settings } from "./schema";
import { ensureSchema } from "./bootstrap";
import { KNOWN_LINKS } from "./link-keys";

export { KNOWN_LINKS };

export async function getSettings(): Promise<Record<string, string>> {
  await ensureSchema();
  const rows = await db.select().from(settings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

/** upsert non-empty values, delete keys cleared to empty */
export async function saveSettings(map: Record<string, string>): Promise<number> {
  await ensureSchema();
  let saved = 0;
  for (const [key, value] of Object.entries(map)) {
    const trimmed = value.trim();
    if (!trimmed) {
      await db.delete(settings).where(sql`key = ${key}`);
      continue;
    }
    await db
      .insert(settings)
      .values({ key, value: trimmed })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: trimmed, updatedAt: new Date() },
      });
    saved++;
  }
  return saved;
}
