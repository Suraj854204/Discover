import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { seed } from "@/db/seed";
import { DEMO_USER_ID, MIGRATIONS_FOLDER, type Db } from "@/lib/db";
import * as schema from "@/db/schema";

/** A fresh, migrated and seeded in-memory Postgres (PGlite) for each test. */
export async function freshDb(): Promise<Db> {
  const client = new PGlite();
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
  await seed(db as unknown as Db);
  return db as unknown as Db;
}
export { DEMO_USER_ID };
