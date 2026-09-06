import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { drizzle as drizzlePglite, type PgliteDatabase } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * database layer
 * · production: DATABASE_URL → supabase postgres (session pooler uri)
 * · local dev:  unset → embedded postgres (@electric-sql/pglite), zero accounts
 * both run the same drizzle/pg queries — the swap is invisible to the app.
 *
 * the singleton is created lazily (first query), so importing `db` never
 * opens a connection at build time.
 */

type Db = PgliteDatabase<typeof schema>;

const g = globalThis as unknown as {
  __ramyaDb?: Db;
  __ramyaPostgres?: ReturnType<typeof postgres>;
  __ramyaPglite?: PGlite;
};

function createDb(): Db {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString) {
    const isPooler = /pooler|:6543/.test(connectionString);
    const client =
      g.__ramyaPostgres ??
      postgres(connectionString, {
        // supavisor transaction pooler rejects prepared statements
        prepare: !isPooler,
        max: 10,
      });
    g.__ramyaPostgres = client;
    return drizzlePostgres(client, { schema }) as unknown as Db;
  }

  // local fallback — embedded postgres persisted to .pglite/
  const client = (g.__ramyaPglite ??= new PGlite(".pglite"));
  return drizzlePglite(client, { schema }) as unknown as Db;
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    const real = (g.__ramyaDb ??= createDb());
    const value = Reflect.get(real, prop);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
