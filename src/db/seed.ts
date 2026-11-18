import { connect, DEMO_USER_ID } from "@/lib/db";
import type { Db } from "@/lib/db";
import { matches, profiles, swipes, users } from "./schema";
import { portraitUrl, SEED_PROFILES } from "./profiles-data";

/** Idempotent, reproducible seed: wipes all rows and re-inserts the same data every run. */
export async function seed(db: Db) {
  await db.transaction(async (tx) => {
    await tx.delete(matches);
    await tx.delete(swipes);
    await tx.delete(profiles);
    await tx.delete(users);

    await tx.insert(users).values({ id: DEMO_USER_ID, name: "Demo User" });
    await tx.insert(profiles).values(
      SEED_PROFILES.map((p, index) => ({
        id: p.id,
        position: index,
        name: p.name,
        age: p.age,
        photoUrl: portraitUrl(p.gender, p.portrait),
        bio: p.bio,
        location: p.location,
        interests: p.interests,
        likesUser: p.likesUser,
      })),
    );
  });
}

if (process.argv[1]?.endsWith("seed.ts")) {
  const { db, pool } = connect();
  seed(db)
    .then(() => {
      const incoming = SEED_PROFILES.filter((p) => p.likesUser).length;
      console.log(`Seeded ${SEED_PROFILES.length} profiles (${incoming} have privately liked the demo user).`);
    })
    .catch((err) => {
      console.error(err instanceof Error ? err.message : err);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}
