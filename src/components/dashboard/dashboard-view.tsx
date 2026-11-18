"use client";

import { CloudOff } from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatePanel } from "@/components/ui/state-panel";
import { MatchesPreview } from "./matches-preview";
import { ContinuePanel, PremiumCard } from "./side-panels";
import { StatCards, StatCardsSkeleton } from "./stat-cards";

export function DashboardView() {
  const { stats, matches, status, error, reload } = useDashboard();

  return (
    <section className="py-10 sm:py-12">
      <header>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Welcome back!</h1>
        <p className="mt-2 text-ink-soft">New connections are waiting for you.</p>
      </header>

      {status === "error" ? (
        <div className="mt-10">
          <StatePanel icon={<CloudOff className="size-7" aria-hidden />} title="We couldn't load your dashboard" action={<Button onClick={() => void reload()}>Try again</Button>}>
            {error}
          </StatePanel>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_20rem]">
          <div className="min-w-0 space-y-10">
            {status === "loading" || !stats ? <StatCardsSkeleton /> : <StatCards stats={stats} />}
            {status === "loading" ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4" aria-busy="true" aria-label="Loading matches">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/5] !rounded-3xl" />
                ))}
              </div>
            ) : (
              <MatchesPreview matches={matches} />
            )}
          </div>
          <div className="space-y-6">
            <ContinuePanel />
            <PremiumCard />
          </div>
        </div>
      )}
    </section>
  );
}
