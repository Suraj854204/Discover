import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileImage } from "@/components/discover/profile-image";
import { portraitUrl } from "@/db/profiles-data";
import { FloatingHeart } from "./floating-heart";
import { WatchDemoDialog } from "./watch-demo-dialog";

const AVATARS: [("women" | "men"), number, string][] = [
  ["women", 44, "Aanya"],
  ["men", 32, "Rohan"],
  ["women", 65, "Meera"],
  ["men", 15, "Kabir"],
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute -right-40 -top-40 size-[34rem] rounded-full bg-gradient-to-br from-blush-deep to-blush opacity-80 blur-2xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 md:grid-cols-2 md:pt-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose">Privacy-first dating</p>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Good things happen <span className="text-rose">here.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink-soft">
            Discover people, find common ground, and let mutual interest do the rest.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild variant="rose" size="lg">
              <Link href="/app/discover">
                Start Discovering <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <WatchDemoDialog />
          </div>
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {AVATARS.map(([g, n, name]) => (
                <ProfileImage key={n} src={portraitUrl(g, n)} name={name} className="size-10 rounded-full border-2 border-ivory" />
              ))}
            </div>
            <p className="text-sm text-ink-soft">Sample profiles shown for illustration.</p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div aria-hidden className="absolute -left-6 top-10 size-40 rounded-full bg-rose-soft" />
          <div aria-hidden className="absolute -bottom-6 -right-4 size-32 rounded-[2rem] bg-blush-deep" />
          <ProfileImage
            src={portraitUrl("women", 44)}
            name="Aanya"
            className="relative aspect-[3/4] w-full rounded-t-[12rem] rounded-b-[2rem] shadow-lift"
          />
          <div className="absolute -bottom-4 -left-6 rounded-2xl border border-line bg-card px-4 py-3 shadow-soft">
            <p className="text-xs text-ink-faint">Demo profile</p>
            <p className="font-display text-lg font-semibold">Aanya, 24</p>
          </div>
          <FloatingHeart className="-right-3 top-12 size-7" />
          <FloatingHeart className="-left-8 top-1/3 size-5" delay={1.2} />
          <FloatingHeart className="right-6 -top-5 size-4" delay={2.1} />
        </div>
      </div>
    </section>
  );
}
