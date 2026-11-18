import type { MatchItem, PublicProfile } from "@/types";

export const makeProfile = (over: Partial<PublicProfile> = {}): PublicProfile => ({
  id: "p01",
  name: "Aanya",
  age: 24,
  photo: "https://example.com/a.jpg",
  bio: "Film-school grad who loves chai.",
  location: "Mumbai",
  interests: ["Cinema", "Chai"],
  ...over,
});

export const makeMatch = (over: Partial<MatchItem> = {}): MatchItem => ({
  id: "m1",
  matchedAt: "2026-11-10T10:00:00.000Z",
  profile: makeProfile(),
  ...over,
});

export const json = (body: unknown, status = 200) =>
  Promise.resolve(new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));
