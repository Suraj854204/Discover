import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileImage } from "@/components/discover/profile-image";
import { portraitUrl } from "@/db/profiles-data";
import { FloatingHeart } from "./floating-heart";

const POINTS = [
  "Swipe right to like, left to pass.",
  "Get matched only when interest is mutual.",
  "Keep your matches in one place, always accessible.",
];

export function SwipeMatchConnect() {
  return (
    <section id="how-it-works" className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-16 sm:px-6 md:grid-cols-2">
      <div className="relative mx-auto h-[26rem] w-full max-w-sm">
        <div className="absolute left-0 top-8 w-48 -rotate-6 overflow-hidden rounded-3xl border border-line bg-card shadow-lift sm:w-52">
          <ProfileImage src={portraitUrl("men", 32)} name="Rohan" className="aspect-[3/4] w-full" />
          <p className="p-3 font-display text-lg font-semibold">Rohan, 27</p>
        </div>
        <div className="absolute right-0 top-0 w-48 rotate-6 overflow-hidden rounded-3xl border border-line bg-card shadow-lift sm:w-52">
          <ProfileImage src={portraitUrl("women", 65)} name="Meera" className="aspect-[3/4] w-full" />
          <p className="p-3 font-display text-lg font-semibold">Meera, 25</p>
        </div>
        <FloatingHeart className="left-1/2 top-1/2 size-12 -translate-x-1/2" />
        <FloatingHeart className="bottom-6 left-6 size-6" delay={1} />
      </div>
      <div>
        <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Swipe. Match. Connect.</h2>
        <p className="mt-4 max-w-md text-ink-soft">
          Browse one profile at a time at your own pace. Nothing is shared until you both say yes.
        </p>
        <ul className="mt-8 space-y-4">
          {POINTS.map((p) => (
            <li key={p} className="flex items-start gap-3">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-rose-soft text-rose-deep">
                <Check className="size-3.5" aria-hidden />
              </span>
              <span className="text-ink-soft">{p}</span>
            </li>
          ))}
        </ul>
        <Button asChild variant="primary" size="lg" className="mt-9">
          <Link href="/app/discover">
            Explore Discover <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}
