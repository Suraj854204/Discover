import { defineConfig } from "drizzle-kit";

// `generate` only reads the schema; no database connection is needed.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
});
