/** Public profile shape. Deliberately has NO field about incoming likes. */
export interface PublicProfile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  location: string;
  interests: string[];
}

export interface MatchItem {
  id: string;
  matchedAt: string; // ISO timestamp
  profile: PublicProfile;
}

export type SwipeAction = "like" | "pass";

export interface FeedResponse {
  success: true;
  profiles: PublicProfile[];
  remaining: number;
}

export interface SwipeResponse {
  success: true;
  matched: boolean;
  match?: { id: string };
}

export interface MatchesResponse {
  success: true;
  count: number;
  matches: MatchItem[];
}

export interface ApiErrorResponse {
  success: false;
  error: { code: string; message: string };
}

/** Derived only from the user's OWN actions. Never includes anything about incoming likes. */
export interface StatsResponse {
  success: true;
  likesSent: number;
  mutualMatches: number;
  profilesViewed: number;
  totalProfiles: number;
  activityLast7Days: number;
}
