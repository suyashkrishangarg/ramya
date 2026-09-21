import { integer, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

/** waitlist members — email signups + google (supabase auth) signups */
export const waitlist = pgTable(
  "waitlist",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    avatarUrl: text("avatar_url"),
    source: text("source").notNull().default("email"), // 'email' | 'google'
    googleId: text("google_id"),
    position: integer("position"),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    welcomeEmailSentAt: timestamp("welcome_email_sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("waitlist_email_key").on(t.email)],
);

/** admin-editable site settings (social links, demo video, …) */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** chat beta allowlist — one row per granted email (env list also grants) */
export const chatAccess = pgTable(
  "chat_access",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    grantedBy: text("granted_by"),
    note: text("note"),
    grantedAt: timestamp("granted_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("chat_access_email_key").on(t.email)],
);

export type WaitlistRow = typeof waitlist.$inferSelect;
export type NewWaitlistRow = typeof waitlist.$inferInsert;
export type SettingRow = typeof settings.$inferSelect;
export type ChatAccessRow = typeof chatAccess.$inferSelect;
