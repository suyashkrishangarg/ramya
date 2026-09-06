import { sql } from "drizzle-orm";
import { db } from "./db";

/**
 * Idempotent schema bootstrap. Runs once per server instance so the app
 * works on a fresh turso database without running migrations manually.
 */
let ready: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await db.run(sql`
        CREATE TABLE IF NOT EXISTS waitlist (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          name TEXT,
          avatar_url TEXT,
          source TEXT NOT NULL DEFAULT 'email',
          google_id TEXT,
          position INTEGER,
          last_synced_at INTEGER,
          created_at INTEGER NOT NULL
        )
      `);
      await db.run(
        sql`CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist (created_at DESC)`,
      );
      await db.run(
        sql`CREATE INDEX IF NOT EXISTS idx_waitlist_position ON waitlist (position)`,
      );
    })().catch((err) => {
      ready = null;
      throw err;
    });
  }
  return ready;
}
