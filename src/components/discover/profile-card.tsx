import { MapPin } from "lucide-react";
import type { PublicProfile } from "@/types";
import { ProfileImage } from "./profile-image";

export function ProfileCard({ profile }: { profile: PublicProfile }) {
  return (
    <article
      aria-label={`${profile.name}, ${profile.age}`}
      className="overflow-hidden rounded-card border border-line bg-card shadow-lift"
    >
      <div className="relative">
        <ProfileImage src={profile.photo} name={profile.name} className="aspect-[4/5] max-h-[44dvh] w-full sm:max-h-[56dvh]" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <h2 className="font-display text-3xl font-semibold leading-tight">
            {profile.name}
            <span className="ml-2 font-sans text-2xl font-normal opacity-90">{profile.age}</span>
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-white/90">
            <MapPin className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{profile.location}</span>
          </p>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <p className="line-clamp-3 text-[15px] leading-relaxed text-ink-soft">{profile.bio}</p>
        <ul className="flex flex-wrap gap-2" aria-label="Interests">
          {profile.interests.map((interest) => (
            <li key={interest} className="rounded-full border border-line bg-ivory px-3 py-1 text-xs font-medium text-ink-soft">
              {interest}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
