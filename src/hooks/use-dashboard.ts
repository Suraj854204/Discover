"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ClientApiError } from "@/lib/client-api";
import type { MatchItem, StatsResponse } from "@/types";

export function useDashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const [s, m] = await Promise.all([api.stats(), api.matches()]);
      setStats(s);
      setMatches(m.matches);
      setStatus("ready");
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { stats, matches, status, error, reload: load };
}
