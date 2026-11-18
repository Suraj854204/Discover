"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { api, ClientApiError } from "@/lib/client-api";
import type { PublicProfile, SwipeAction } from "@/types";

export type SwipeOutcome = "ok" | "failed";
type Status = "loading" | "ready" | "error";

const TOP_UP_AT = 3;

export function useDiscover() {
  const [queue, setQueue] = useState<PublicProfile[]>([]);
  const [remaining, setRemaining] = useState(0);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [matched, setMatched] = useState<PublicProfile | null>(null);
  const fetching = useRef(false);

  const load = useCallback(async (initial = false) => {
    if (fetching.current) return;
    fetching.current = true;
    if (initial) setStatus("loading");
    try {
      const feed = await api.feed();
      setQueue((prev) => {
        if (initial) return feed.profiles;
        const known = new Set(prev.map((p) => p.id));
        return [...prev, ...feed.profiles.filter((p) => !known.has(p.id))];
      });
      setRemaining(feed.remaining);
      setStatus("ready");
    } catch (err) {
      if (initial) {
        setErrorMessage(err instanceof ClientApiError ? err.message : "Something went wrong loading profiles.");
        setStatus("error");
      }
    } finally {
      fetching.current = false;
    }
  }, []);

  useEffect(() => {
    void load(true);
  }, [load]);

  // Keep the local queue topped up from the server as it runs low.
  useEffect(() => {
    if (status === "ready" && queue.length <= TOP_UP_AT && remaining > queue.length) void load(false);
  }, [queue.length, remaining, status, load]);

  const removeProfile = useCallback((id: string) => {
    setQueue((q) => q.filter((p) => p.id !== id));
    setRemaining((r) => Math.max(0, r - 1));
  }, []);

  /** Sends the swipe to the server (the only source of truth for matching). */
  const swipe = useCallback(
    async (profile: PublicProfile, action: SwipeAction): Promise<SwipeOutcome> => {
      try {
        const result = await api.swipe(profile.id, action);
        removeProfile(profile.id);
        if (result.matched) setMatched(profile);
        return "ok";
      } catch (err) {
        if (err instanceof ClientApiError && (err.code === "ALREADY_SWIPED" || err.code === "PROFILE_NOT_FOUND")) {
          removeProfile(profile.id);
          toast.info(err.code === "ALREADY_SWIPED" ? "You've already responded to that profile." : "That profile is no longer available.");
          return "ok";
        }
        toast.error(err instanceof ClientApiError ? err.message : "Couldn't save that. Please try again.");
        return "failed";
      }
    },
    [removeProfile],
  );

  return {
    queue,
    remaining,
    status,
    errorMessage,
    matched,
    dismissMatch: () => setMatched(null),
    swipe,
    retry: () => load(true),
  };
}
