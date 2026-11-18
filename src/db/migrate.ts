import { connect, runMigrations } from "@/lib/db";

async function main() {
  const { db, pool } = connect();
  try {
    await runMigrations(db);
    console.log("Migrations applied.");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
