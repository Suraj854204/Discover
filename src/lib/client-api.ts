import type {
  ApiErrorResponse,
  FeedResponse,
  MatchesResponse,
  StatsResponse,
  SwipeAction,
  SwipeResponse,
} from "@/types";

export class ClientApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store", ...init });
  } catch {
    throw new ClientApiError("Can't reach Coy right now. Check your connection and try again.", "NETWORK", 0);
  }
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    throw new ClientApiError("Unexpected response from the server.", "BAD_RESPONSE", res.status);
  }
  if (!res.ok || (body as { success?: boolean }).success === false) {
    const err = (body as ApiErrorResponse).error;
    throw new ClientApiError(err?.message ?? "Something went wrong.", err?.code ?? "UNKNOWN", res.status);
  }
  return body as T;
}

export const api = {
  feed: () => request<FeedResponse>("/api/feed"),
  matches: () => request<MatchesResponse>("/api/matches"),
  stats: () => request<StatsResponse>("/api/stats"),
  swipe: (profileId: string, action: SwipeAction) =>
    request<SwipeResponse>("/api/swipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId, action }),
    }),
};
