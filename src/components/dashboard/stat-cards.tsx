import { Activity, Eye, Heart, HeartHandshake, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { StatsResponse } from "@/types";

function StatCard({ icon: Icon, value, label, hint }: { icon: LucideIcon; value: string; label: string; hint?: string }) {
  return (
    <li className="rounded-3xl border border-line bg-gradient-to-b from-blush/60 to-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <span className="grid size-10 place-items-center rounded-xl bg-card text-rose shadow-soft">
        <Icon className="size-5" aria-hidden />
      </span>
      <p className="mt-4 font-display text-4xl font-semibold leading-none">{value}</p>
      <p className="mt-2 text-sm font-medium text-ink">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-ink-faint">{hint}</p>}
    </li>
  );
}

export function StatCards({ stats }: { stats: StatsResponse }) {
  const explored = stats.totalProfiles ? Math.round((stats.profilesViewed / stats.totalProfiles) * 100) : 0;
  return (
    <ul className="grid grid-cols-2 gap-4 xl:grid-cols-4" aria-label="Your statistics">
      <StatCard icon={Heart} value={String(stats.likesSent)} label="Likes Sent" />
      <StatCard icon={HeartHandshake} value={String(stats.mutualMatches)} label="Mutual Matches" />
      <StatCard icon={Eye} value={String(stats.profilesViewed)} label="Profiles Viewed" hint={`${explored}% of everyone explored`} />
      <StatCard icon={Activity} value={String(stats.activityLast7Days)} label="Discovery Activity" hint="Swipes in the last 7 days" />
    </ul>
  );
}

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4" aria-busy="true" aria-label="Loading statistics">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-36 !rounded-3xl" />
      ))}
    </div>
  );
}
