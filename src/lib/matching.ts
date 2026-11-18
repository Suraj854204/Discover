import { and, asc, count, desc, eq, gte, notInArray } from "drizzle-orm";
import { matches, profiles, swipes, users } from "@/db/schema";
import { ApiError } from "./errors";
import type { Db } from "./db";
import type { MatchItem, PublicProfile, SwipeAction } from "@/types";

/**
 * Whitelist mapper: the ONLY place a DB profile row becomes a client-facing object.
 * `likesUser` and every other private column are dropped here.
 */
export function toPublicProfile(row: typeof profiles.$inferSelect): PublicProfile {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    photo: row.photoUrl,
    bio: row.bio,
    location: row.location,
    interests: row.interests,
  };
}

async function assertUser(db: Db, userId: string) {
  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new ApiError(401, "NO_USER", "No active user. Run the seed script first.");
}

/** Profiles the user has not yet swiped on, in stable order. */
export async function getFeed(db: Db, userId: string, limit = 20) {
  await assertUser(db, userId);
  const swiped = db.select({ id: swipes.profileId }).from(swipes).where(eq(swipes.userId, userId));
  const unswiped = notInArray(profiles.id, swiped);

  const rows = await db.select().from(profiles).where(unswiped).orderBy(asc(profiles.position), asc(profiles.id)).limit(limit);
  const [totalRow] = await db.select({ n: count() }).from(profiles).where(unswiped);
  const total = totalRow?.n ?? 0;

  return { profiles: rows.map(toPublicProfile), remaining: total };
}

export type SwipeResult = { matched: false } | { matched: true; match: { id: string } };

const UNIQUE_VIOLATION = "23505";

function isUniqueViolation(err: unknown): boolean {
  for (let e: unknown = err, depth = 0; e && depth < 4; depth++) {
    if ((e as { code?: string }).code === UNIQUE_VIOLATION) return true;
    e = (e as { cause?: unknown }).cause;
  }
  return false;
}

/**
 * Records a swipe and creates a match iff the profile has liked the user.
 * Runs atomically; the unique (user, profile) index is the final guard against duplicates,
 * including two requests racing each other.
 */
export async function recordSwipe(db: Db, userId: string, profileId: string, action: SwipeAction): Promise<SwipeResult> {
  await assertUser(db, userId);

  try {
    return await db.transaction(async (tx) => {
      const [profile] = await tx.select().from(profiles).where(eq(profiles.id, profileId)).limit(1);
      if (!profile) throw new ApiError(404, "PROFILE_NOT_FOUND", "That profile doesn't exist.");

      const [existing] = await tx
        .select({ id: swipes.id })
        .from(swipes)
        .where(and(eq(swipes.userId, userId), eq(swipes.profileId, profileId)))
        .limit(1);
      if (existing) throw new ApiError(409, "ALREADY_SWIPED", "You've already responded to this profile.");

      await tx.insert(swipes).values({ userId, profileId, action });

      if (action !== "like" || !profile.likesUser) return { matched: false as const };

      await tx.insert(matches).values({ userId, profileId }).onConflictDoNothing();
      const [match] = await tx
        .select({ id: matches.id })
        .from(matches)
        .where(and(eq(matches.userId, userId), eq(matches.profileId, profileId)))
        .limit(1);
      return { matched: true as const, match: { id: match.id } };
    });
  } catch (err) {
    if (isUniqueViolation(err)) throw new ApiError(409, "ALREADY_SWIPED", "You've already responded to this profile.");
    throw err;
  }
}

/** Mutual matches only. One-sided likes have no row in `matches`, so they can't leak here. */
export async function getMatches(db: Db, userId: string): Promise<MatchItem[]> {
  await assertUser(db, userId);
  const rows = await db
    .select({ match: matches, profile: profiles })
    .from(matches)
    .innerJoin(profiles, eq(matches.profileId, profiles.id))
    .where(eq(matches.userId, userId))
    .orderBy(desc(matches.createdAt));
  return rows.map(({ match, profile }) => ({
    id: match.id,
    matchedAt: match.createdAt.toISOString(),
    profile: toPublicProfile(profile),
  }));
}

/** Dashboard numbers. Only the user's own swipes and confirmed matches are counted. */
export async function getStats(db: Db, userId: string, now = Date.now()) {
  await assertUser(db, userId);
  const mine = eq(swipes.userId, userId);
  const since = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const n = (rows: { n: number }[]) => rows[0]?.n ?? 0;

  const [likesSent, profilesViewed, mutualMatches, totalProfiles, activityLast7Days] = await Promise.all([
    db.select({ n: count() }).from(swipes).where(and(mine, eq(swipes.action, "like"))).then(n),
    db.select({ n: count() }).from(swipes).where(mine).then(n),
    db.select({ n: count() }).from(matches).where(eq(matches.userId, userId)).then(n),
    db.select({ n: count() }).from(profiles).then(n),
    db.select({ n: count() }).from(swipes).where(and(mine, gte(swipes.createdAt, since))).then(n),
  ]);

  return { likesSent, mutualMatches, profilesViewed, totalProfiles, activityLast7Days };
}
