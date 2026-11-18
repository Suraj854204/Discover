import path from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { Pool } from "pg";
import * as schema from "@/db/schema";

/** Driver-agnostic Postgres database type (node-postgres in the app, PGlite in unit tests). */
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

export const DEMO_USER_ID = "demo-user";
export const MIGRATIONS_FOLDER = path.resolve(process.cwd(), "drizzle");

function resolveUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Add your Neon connection string to .env (see .env.example).");
  }
  if (!/^postgres(ql)?:\/\//.test(url)) {
    throw new Error("DATABASE_URL must be a PostgreSQL connection string (postgresql://user:password@host/db).");
  }
  return url;
}

/** Opens a pooled connection. Call `pool.end()` when done in scripts. */
export function connect(url: string = resolveUrl()) {
  const pool = new Pool({ connectionString: url, max: 5, connectionTimeoutMillis: 15_000 });
  return { db: drizzle(pool, { schema }) as Db, pool };
}

export async function runMigrations(db: Db) {
  // The migrator needs the concrete node-postgres type; the runtime API is identical.
  await migrate(db as unknown as Parameters<typeof migrate>[0], { migrationsFolder: MIGRATIONS_FOLDER });
}

const globalForDb = globalThis as unknown as { __coyDb?: Db };

/** Singleton for the app server (survives dev hot reloads). */
export function getDb(): Db {
  if (!globalForDb.__coyDb) globalForDb.__coyDb = connect().db;
  return globalForDb.__coyDb;
}
