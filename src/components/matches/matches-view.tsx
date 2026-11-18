"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { CloudOff, Heart, MapPin } from "lucide-react";
import { api, ClientApiError } from "@/lib/client-api";
import type { MatchItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatePanel } from "@/components/ui/state-panel";
import { ProfileImage } from "@/components/discover/profile-image";

export function MatchCard({ match }: { match: MatchItem }) {
  const { profile } = match;
  return (
    <li>
      <article className="group overflow-hidden rounded-3xl border border-line bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
        <ProfileImage src={profile.photo} name={profile.name} className="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.03]" />
        <div className="p-4">
          <h2 className="font-display text-xl font-semibold">
            {profile.name}, <span className="font-sans font-normal text-ink-soft">{profile.age}</span>
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{profile.location}</span>
          </p>
          <p className="mt-3 text-xs text-ink-faint">Matched {format(new Date(match.matchedAt), "d MMM yyyy")}</p>
        </div>
      </article>
    </li>
  );
}

export function MatchesGrid({ matches }: { matches: MatchItem[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {matches.map((m) => (
        <MatchCard key={m.id} match={m} />
      ))}
    </ul>
  );
}

export function EmptyMatches() {
  return (
    <StatePanel
      icon={<Heart className="size-7" aria-hidden />}
      title="Your story starts with a connection."
      action={
        <Button asChild variant="rose">
          <Link href="/app/discover">Go to Discover →</Link>
        </Button>
      }
    >
      Discover amazing people and find your match!
    </StatePanel>
  );
}

export function MatchesView() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const q = (useSearchParams().get("q") ?? "").trim().toLowerCase();

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await api.matches();
      setMatches(res.matches);
      setStatus("ready");
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const shown = q ? matches.filter((m) => m.profile.name.toLowerCase().includes(q) || m.profile.location.toLowerCase().includes(q)) : matches;

  return (
    <section className="py-10 sm:py-14">
      <header className="mb-10">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Your matches</h1>
        <p className="mt-2 text-ink-soft" aria-live="polite">
          {status === "ready" ? `${matches.length} mutual ${matches.length === 1 ? "match" : "matches"}${q ? ` · ${shown.length} shown for \u201c${q}\u201d` : ""}` : "Only people who liked you back appear here."}
        </p>
      </header>

      {status === "loading" && (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4" aria-busy="true" aria-label="Loading matches">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] !rounded-3xl" />
          ))}
        </div>
      )}
      {status === "error" && (
        <StatePanel icon={<CloudOff className="size-7" aria-hidden />} title="We couldn't load your matches" action={<Button onClick={() => void load()}>Try again</Button>}>
          {error}
        </StatePanel>
      )}
      {status === "ready" && matches.length === 0 && <EmptyMatches />}
      {status === "ready" && matches.length > 0 && shown.length === 0 && <p className="text-ink-soft">No matches found for that search.</p>}
      {status === "ready" && shown.length > 0 && <MatchesGrid matches={shown} />}
    </section>
  );
}
