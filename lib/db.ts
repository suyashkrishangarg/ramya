import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

/**
 * turso (libsql) database.
 * · production: TURSO_DATABASE_URL=libsql://your-db.turso.io (+ TURSO_AUTH_TOKEN)
 * · local dev:  unset both → falls back to a zero-config file database
 */
const url = process.env.TURSO_DATABASE_URL || "file:./local.db";
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

export const libsql = createClient({ url, authToken });

export const db = drizzle(libsql, { schema });
