import { sql } from "drizzle-orm";
import { db } from "./db";

/**
 * idempotent schema bootstrap — runs once per server instance so a fresh
 * supabase project works without running migrations manually.
 */
let ready: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS waitlist (
          id SERIAL PRIMARY KEY,
          email TEXT NOT NULL,
          name TEXT,
          avatar_url TEXT,
          source TEXT NOT NULL DEFAULT 'email',
          google_id TEXT,
          position INTEGER,
          last_synced_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await db.execute(
        sql`CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_key ON waitlist (email)`,
      );
      await db.execute(
        sql`CREATE INDEX IF NOT EXISTS waitlist_created_idx ON waitlist (created_at DESC)`,
      );
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
    })().catch((err) => {
      ready = null;
      throw err;
    });
  }
  return ready;
}
