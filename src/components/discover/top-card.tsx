"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { animate, motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import type { PublicProfile, SwipeAction } from "@/types";
import type { SwipeOutcome } from "@/hooks/use-discover";
import { ProfileCard } from "./profile-card";

export interface TopCardHandle {
  swipe: (action: SwipeAction) => Promise<void>;
}

interface Props {
  profile: PublicProfile;
  onDecide: (profile: PublicProfile, action: SwipeAction) => Promise<SwipeOutcome>;
}

const DISTANCE_THRESHOLD = 110;
const VELOCITY_THRESHOLD = 500;

/** The draggable, active profile card. Owns its own motion value and a lock against duplicate swipes. */
export const TopCard = forwardRef<TopCardHandle, Props>(function TopCard({ profile, onDecide }, ref) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-10, 0, 10]);
  const likeOpacity = useTransform(x, [30, 120], [0, 1]);
  const passOpacity = useTransform(x, [-120, -30], [1, 0]);
  const locked = useRef(false);

  const swipe = async (action: SwipeAction) => {
    if (locked.current) return;
    locked.current = true;
    const direction = action === "like" ? 1 : -1;
    const exit = animate(x, direction * (window.innerWidth + 240), { duration: 0.32, ease: "easeIn" });
    const outcome = await onDecide(profile, action);
    if (outcome === "failed") {
      exit.stop();
      await animate(x, 0, { type: "spring", stiffness: 300, damping: 26 });
      locked.current = false;
    }
    // On success the parent removes this card; it stays locked until unmounted.
  };

  useImperativeHandle(ref, () => ({ swipe }));

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > DISTANCE_THRESHOLD || info.velocity.x > VELOCITY_THRESHOLD) void swipe("like");
    else if (info.offset.x < -DISTANCE_THRESHOLD || info.velocity.x < -VELOCITY_THRESHOLD) void swipe("pass");
    else void animate(x, 0, { type: "spring", stiffness: 400, damping: 28 });
  };

  return (
    <motion.div
      style={{ x, rotate }}
      drag="x"
      dragElastic={0.9}
      dragMomentum={false}
      onDragEnd={onDragEnd}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      className="relative cursor-grab touch-pan-y active:cursor-grabbing"
      data-testid="top-card"
    >
      <ProfileCard profile={profile} />
      <motion.div
        aria-hidden
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute left-6 top-8 -rotate-12 rounded-xl border-4 border-sage px-3 py-1 text-2xl font-bold tracking-widest text-sage"
      >
        LIKE
      </motion.div>
      <motion.div
        aria-hidden
        style={{ opacity: passOpacity }}
        className="pointer-events-none absolute right-6 top-8 rotate-12 rounded-xl border-4 border-rose px-3 py-1 text-2xl font-bold tracking-widest text-rose"
      >
        PASS
      </motion.div>
    </motion.div>
  );
});
