import type { Metadata } from "next";
import { Suspense } from "react";
import { MatchesView } from "@/components/matches/matches-view";

export const metadata: Metadata = { title: "Matches" };

export default function MatchesPage() {
  return (
    <Suspense>
      <MatchesView />
    </Suspense>
  );
}
