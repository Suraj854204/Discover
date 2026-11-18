"use client";

import Link from "next/link";
import { CloudOff, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { useDiscover } from "@/hooks/use-discover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatePanel } from "@/components/ui/state-panel";
import { MatchModal } from "./match-modal";
import { SwipeDeck } from "./swipe-deck";

function DeckSkeleton() {
  return (
    <div className="mx-auto w-full max-w-sm" aria-busy="true" aria-label="Loading profiles">
      <Skeleton className="aspect-[4/5] max-h-[44dvh] w-full !rounded-card" />
      <Skeleton className="mt-4 h-24 w-full !rounded-card" />
    </div>
  );
}

export function DiscoverView() {
  const { queue, remaining, status, errorMessage, matched, dismissMatch, swipe, retry } = useDiscover();

  return (
    <section className="py-6 sm:py-14">
      <header className="mx-auto max-w-xl text-center">
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">Good connections start here.</h1>
        <p className="mt-3 text-ink-soft">Discover people, find common ground, and let mutual interest do the rest.</p>
        {status === "ready" && remaining > 0 && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-1.5 text-sm text-ink-soft" aria-live="polite">
            <Sparkles className="size-4 text-rose" aria-hidden />
            {remaining} {remaining === 1 ? "person" : "people"} left to discover
          </p>
        )}
      </header>

      <div className="mt-6 sm:mt-10">
        {status === "loading" && <DeckSkeleton />}

        {status === "error" && (
          <StatePanel
            icon={<CloudOff className="size-7" aria-hidden />}
            title="We couldn't load profiles"
            action={<Button onClick={() => void retry()}>Try again</Button>}
          >
            {errorMessage}
          </StatePanel>
        )}

        {status === "ready" && queue.length === 0 && (
          <StatePanel
            icon={<Heart className="size-7" aria-hidden />}
            title="You've discovered everyone for now."
            action={
              <Button asChild variant="rose">
                <Link href="/app/matches">Explore Matches</Link>
              </Button>
            }
          >
            Check back later for more connections.
          </StatePanel>
        )}

        {status === "ready" && queue.length > 0 && <SwipeDeck queue={queue} paused={!!matched} onSwipe={swipe} />}
      </div>

      <p className="mx-auto mt-10 flex max-w-md items-center justify-center gap-2 text-center text-sm text-sage">
        <ShieldCheck className="size-4 shrink-0" aria-hidden />
        Your likes are private. We only reveal interest when it&apos;s mutual.
      </p>

      <MatchModal profile={matched} onClose={dismissMatch} />
    </section>
  );
}
