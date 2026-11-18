import Link from "next/link";
import { format } from "date-fns";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileImage } from "@/components/discover/profile-image";
import type { MatchItem } from "@/types";

export function MatchesPreview({ matches }: { matches: MatchItem[] }) {
  return (
    <section aria-labelledby="your-matches">
      <div className="flex items-center justify-between">
        <h2 id="your-matches" className="font-display text-2xl font-semibold">Your Matches</h2>
        <Button asChild variant="outline" size="sm">
          <Link href="/app/matches">View All</Link>
        </Button>
      </div>
      {matches.length === 0 ? (
        <div className="mt-5 rounded-3xl border border-dashed border-line bg-card px-6 py-12 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-rose-soft text-rose-deep">
            <Heart className="size-6" aria-hidden />
          </span>
          <p className="mt-4 font-display text-xl font-semibold">Your story starts with a connection.</p>
          <p className="mt-1 text-sm text-ink-soft">Discover amazing people and find your match!</p>
        </div>
      ) : (
        <ul className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          {matches.slice(0, 4).map((m) => (
            <li key={m.id}>
              <Link href="/app/matches" className="group block overflow-hidden rounded-3xl border border-line bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <ProfileImage src={m.profile.photo} name={m.profile.name} className="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.04]" />
                <div className="p-3">
                  <p className="font-display text-lg font-semibold leading-tight">{m.profile.name}, {m.profile.age}</p>
                  <p className="truncate text-xs text-ink-soft">{m.profile.location}</p>
                  <p className="mt-1 text-[11px] text-ink-faint">Matched {format(new Date(m.matchedAt), "d MMM yyyy")}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
