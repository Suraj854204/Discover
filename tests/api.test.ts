import { beforeEach, describe, expect, it, vi } from "vitest";
import { freshDb } from "./helpers";

let db: Awaited<ReturnType<typeof freshDb>>;
vi.mock("@/lib/db", async (orig) => ({ ...(await orig<typeof import("@/lib/db")>()), getDb: () => db }));

const { GET: feed } = await import("@/app/api/feed/route");
const { POST: swipe } = await import("@/app/api/swipe/route");
const { GET: matches } = await import("@/app/api/matches/route");
const { GET: stats } = await import("@/app/api/stats/route");

const post = (body: unknown, raw = false) =>
  swipe(new Request("http://x/api/swipe", { method: "POST", body: raw ? (body as string) : JSON.stringify(body) }));

beforeEach(async () => {
  db = await freshDb();
});

describe("HTTP API", () => {
  it("GET /api/feed returns 200 with public profiles", async () => {
    const res = await feed();
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.profiles.length).toBeGreaterThan(0);
  });

  it("POST /api/swipe pass -> { success, matched:false }", async () => {
    const res = await post({ profileId: "p02", action: "pass" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, matched: false });
  });

  it("POST /api/swipe mutual like -> matched:true with match id", async () => {
    const json = await (await post({ profileId: "p01", action: "like" })).json();
    expect(json).toMatchObject({ success: true, matched: true });
    expect(json.match.id).toBeTruthy();
  });

  it("returns 400 for invalid body, 400 for bad JSON, 404 unknown, 409 duplicate", async () => {
    expect((await post({ profileId: "p01", action: "nope" })).status).toBe(400);
    expect((await post("{not json", true)).status).toBe(400);
    expect((await post({ profileId: "ghost", action: "like" })).status).toBe(404);
    await post({ profileId: "p02", action: "like" });
    const dup = await post({ profileId: "p02", action: "like" });
    expect(dup.status).toBe(409);
    expect((await dup.json()).error.code).toBe("ALREADY_SWIPED");
  });

  it("GET /api/matches reflects only mutual matches after swipes", async () => {
    await post({ profileId: "p02", action: "like" }); // one-sided
    await post({ profileId: "p01", action: "like" }); // mutual
    const json = await (await matches()).json();
    expect(json.count).toBe(1);
    expect(json.matches[0].profile.id).toBe("p01");
  });

  it("GET /api/stats reflects the user's own activity only", async () => {
    await post({ profileId: "p01", action: "like" });
    await post({ profileId: "p02", action: "pass" });
    const json = await (await stats()).json();
    expect(json).toMatchObject({ success: true, likesSent: 1, mutualMatches: 1, profilesViewed: 2 });
  });
});
