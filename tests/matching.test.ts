import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/errors";
import { getFeed, getMatches, getStats, recordSwipe } from "@/lib/matching";
import { swipeBodySchema } from "@/lib/validation";
import { SEED_PROFILES } from "@/db/profiles-data";
import { swipes } from "@/db/schema";
import { DEMO_USER_ID, freshDb } from "./helpers";

const likers = SEED_PROFILES.filter((p) => p.likesUser);
const nonLiker = SEED_PROFILES.find((p) => !p.likesUser)!;

describe("seed data", () => {
  it("has 30+ profiles, some of which privately like the user", async () => {
    expect(SEED_PROFILES.length).toBeGreaterThanOrEqual(30);
    expect(likers.length).toBeGreaterThan(0);
    expect(SEED_PROFILES.every((p) => p.age >= 18)).toBe(true);
  });
});

describe("feed", () => {
  it("returns only public fields and never leaks incoming-like info", async () => {
    const { profiles } = await getFeed(await freshDb(), DEMO_USER_ID, 100);
    expect(profiles).toHaveLength(SEED_PROFILES.length);
    for (const p of profiles) {
      expect(Object.keys(p).sort()).toEqual(["age", "bio", "id", "interests", "location", "name", "photo"]);
    }
    expect(JSON.stringify(profiles)).not.toMatch(/likesUser|likes_user/i);
  });

  it("excludes previously swiped profiles (likes and passes) and updates remaining", async () => {
    const db = await freshDb();
    await recordSwipe(db, DEMO_USER_ID, nonLiker.id, "pass");
    await recordSwipe(db, DEMO_USER_ID, likers[0].id, "like");
    const { profiles, remaining } = await getFeed(db, DEMO_USER_ID, 100);
    const ids = profiles.map((p) => p.id);
    expect(ids).not.toContain(nonLiker.id);
    expect(ids).not.toContain(likers[0].id);
    expect(remaining).toBe(SEED_PROFILES.length - 2);
  });

  it("is stable in order across requests", async () => {
    const db = await freshDb();
    const a = (await getFeed(db, DEMO_USER_ID)).profiles.map((p) => p.id);
    const b = (await getFeed(db, DEMO_USER_ID)).profiles.map((p) => p.id);
    expect(a).toEqual(b);
  });
});

describe("swipe", () => {
  it("persists a like", async () => {
    const db = await freshDb();
    await recordSwipe(db, DEMO_USER_ID, nonLiker.id, "like");
    const rows = (await db.select().from(swipes));
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ profileId: nonLiker.id, action: "like" });
  });

  it("persists a pass", async () => {
    const db = await freshDb();
    await recordSwipe(db, DEMO_USER_ID, nonLiker.id, "pass");
    expect((await db.select().from(swipes))[0]).toMatchObject({ profileId: nonLiker.id, action: "pass" });
  });

  it("creates a match when a like is mutual", async () => {
    const db = await freshDb();
    const result = await recordSwipe(db, DEMO_USER_ID, likers[0].id, "like");
    expect(result.matched).toBe(true);
    expect(result.matched && result.match.id).toBeTruthy();
    expect(await getMatches(db, DEMO_USER_ID)).toHaveLength(1);
  });

  it("does NOT create a match for a one-sided like", async () => {
    const db = await freshDb();
    expect(await recordSwipe(db, DEMO_USER_ID, nonLiker.id, "like")).toEqual({ matched: false });
    expect(await getMatches(db, DEMO_USER_ID)).toHaveLength(0);
  });

  it("does NOT create a match when the user passes on someone who liked them", async () => {
    const db = await freshDb();
    expect(await recordSwipe(db, DEMO_USER_ID, likers[0].id, "pass")).toEqual({ matched: false });
    expect(await getMatches(db, DEMO_USER_ID)).toHaveLength(0);
  });

  it("rejects duplicate swipes with 409 and keeps a single row/match", async () => {
    const db = await freshDb();
    await recordSwipe(db, DEMO_USER_ID, likers[0].id, "like");
    await expect(recordSwipe(db, DEMO_USER_ID, likers[0].id, "like")).rejects.toMatchObject({ status: 409, code: "ALREADY_SWIPED" });
    await expect(recordSwipe(db, DEMO_USER_ID, likers[0].id, "pass")).rejects.toBeInstanceOf(ApiError);
    expect(await db.select().from(swipes)).toHaveLength(1);
    expect(await getMatches(db, DEMO_USER_ID)).toHaveLength(1);
  });

  it("handles two simultaneous swipes on the same profile: one wins, one gets 409, one row", async () => {
    const db = await freshDb();
    const results = await Promise.allSettled([
      recordSwipe(db, DEMO_USER_ID, likers[0].id, "like"),
      recordSwipe(db, DEMO_USER_ID, likers[0].id, "like"),
    ]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    const rejected = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
    expect(rejected).toHaveLength(1);
    expect(rejected[0].reason).toMatchObject({ status: 409, code: "ALREADY_SWIPED" });
    expect(await db.select().from(swipes)).toHaveLength(1);
    expect(await getMatches(db, DEMO_USER_ID)).toHaveLength(1);
  });

  it("returns 404 for an unknown profile", async () => {
    await expect(recordSwipe(await freshDb(), DEMO_USER_ID, "nope", "like")).rejects.toMatchObject({
      status: 404,
      code: "PROFILE_NOT_FOUND",
    });
  });
});

describe("matches", () => {
  it("returns only mutual matches, never one-sided likes", async () => {
    const db = await freshDb();
    for (const p of likers) await recordSwipe(db, DEMO_USER_ID, p.id, "like");
    await recordSwipe(db, DEMO_USER_ID, nonLiker.id, "like");
    const result = await getMatches(db, DEMO_USER_ID);
    expect(result).toHaveLength(likers.length);
    expect(result.map((m) => m.profile.id)).not.toContain(nonLiker.id);
    expect(JSON.stringify(result)).not.toMatch(/likesUser|likes_user/i);
  });

  it("includes id, profile and timestamp", async () => {
    const db = await freshDb();
    await recordSwipe(db, DEMO_USER_ID, likers[0].id, "like");
    const [m] = await getMatches(db, DEMO_USER_ID);
    expect(m.id).toBeTruthy();
    expect(m.profile.id).toBe(likers[0].id);
    expect(new Date(m.matchedAt).getTime()).not.toBeNaN();
  });
});

describe("persistence across requests", () => {
  it("state survives a fresh read on the same database", async () => {
    const db = await freshDb();
    await recordSwipe(db, DEMO_USER_ID, likers[0].id, "like");
    await recordSwipe(db, DEMO_USER_ID, nonLiker.id, "pass");
    expect(await getMatches(db, DEMO_USER_ID)).toHaveLength(1);
    expect((await getFeed(db, DEMO_USER_ID, 100)).remaining).toBe(SEED_PROFILES.length - 2);
  });
});

describe("validation", () => {
  it("accepts valid bodies and rejects bad ones", async () => {
    expect(swipeBodySchema.safeParse({ profileId: "p01", action: "like" }).success).toBe(true);
    expect(swipeBodySchema.safeParse({ profileId: "p01", action: "superlike" }).success).toBe(false);
    expect(swipeBodySchema.safeParse({ profileId: "", action: "like" }).success).toBe(false);
    expect(swipeBodySchema.safeParse({ action: "like" }).success).toBe(false);
  });
});

describe("stats", () => {
  it("counts only the user's own activity and never reveals incoming likes", async () => {
    const db = await freshDb();
    expect(await getStats(db, DEMO_USER_ID)).toEqual({
      likesSent: 0, mutualMatches: 0, profilesViewed: 0, totalProfiles: SEED_PROFILES.length, activityLast7Days: 0,
    });
    await recordSwipe(db, DEMO_USER_ID, likers[0].id, "like"); // mutual
    await recordSwipe(db, DEMO_USER_ID, nonLiker.id, "like"); // one-sided
    await recordSwipe(db, DEMO_USER_ID, SEED_PROFILES.filter((p) => !p.likesUser)[1].id, "pass");
    const stats = await getStats(db, DEMO_USER_ID);
    expect(stats).toMatchObject({ likesSent: 2, mutualMatches: 1, profilesViewed: 3, activityLast7Days: 3 });
    expect(Object.keys(stats).join()).not.toMatch(/incoming|likedYou|likesReceived/i);
  });
});
