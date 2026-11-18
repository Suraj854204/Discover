"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";
import type { PublicProfile, SwipeAction } from "@/types";
import type { SwipeOutcome } from "@/hooks/use-discover";
import { ProfileCard } from "./profile-card";
import { TopCard, type TopCardHandle } from "./top-card";

interface Props {
  queue: PublicProfile[];
  paused: boolean;
  onSwipe: (profile: PublicProfile, action: SwipeAction) => Promise<SwipeOutcome>;
}

export function SwipeDeck({ queue, paused, onSwipe }: Props) {
  const topRef = useRef<TopCardHandle>(null);
  const [busy, setBusy] = useState(false);
  const [top, next] = queue;

  const trigger = async (action: SwipeAction) => {
    if (busy || paused || !topRef.current) return;
    setBusy(true);
    try {
      await topRef.current.swipe(action);
    } finally {
      setBusy(false);
    }
  };

  const triggerRef = useRef(trigger);
  triggerRef.current = trigger;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowRight") void triggerRef.current("like");
      if (e.key === "ArrowLeft") void triggerRef.current("pass");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!top) return null;

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative">
        {next && (
          <div aria-hidden className="absolute inset-0 origin-bottom scale-[0.94] opacity-70">
            <ProfileCard profile={next} />
          </div>
        )}
        <AnimatePresence mode="popLayout">
          <TopCard key={top.id} ref={topRef} profile={top} onDecide={onSwipe} />
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-center gap-8 sm:mt-8">
        <button
          type="button"
          onClick={() => void trigger("pass")}
          disabled={busy || paused}
          aria-label={`Pass on ${top.name}`}
          className="grid size-16 cursor-pointer place-items-center rounded-full border border-line bg-card text-ink-soft shadow-soft transition-all hover:-translate-y-0.5 hover:text-ink active:scale-90 disabled:opacity-50"
        >
          <X className="size-7" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => void trigger("like")}
          disabled={busy || paused}
          aria-label={`Like ${top.name}`}
          className="grid size-[4.5rem] cursor-pointer place-items-center rounded-full bg-rose text-white shadow-lift transition-all hover:-translate-y-0.5 hover:bg-rose-deep active:scale-90 disabled:opacity-50"
        >
          <Heart className="size-8" fill="currentColor" aria-hidden />
        </button>
      </div>
      <p className="mt-5 text-center text-xs text-ink-faint">
        Swipe right to like, left to pass · or use the buttons · ← → keys on desktop
      </p>
    </div>
  );
}
