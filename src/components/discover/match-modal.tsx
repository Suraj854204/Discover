"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { PublicProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ProfileImage } from "./profile-image";

const SPARKS = [
  { x: -120, y: -70, d: 0 },
  { x: 125, y: -50, d: 0.08 },
  { x: -90, y: 60, d: 0.16 },
  { x: 110, y: 75, d: 0.24 },
  { x: 0, y: -110, d: 0.12 },
];

export function MatchModal({ profile, onClose }: { profile: PublicProfile | null; onClose: () => void }) {
  return (
    <Dialog open={!!profile} onOpenChange={(open) => !open && onClose()}>
      {profile && (
        <DialogContent className="overflow-hidden text-center">
          <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
            {SPARKS.map((s, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.8], x: s.x, y: s.y }}
                transition={{ duration: 1.4, delay: 0.3 + s.d, ease: "easeOut" }}
                className="absolute text-rose"
              >
                <Heart className="size-4" fill="currentColor" />
              </motion.span>
            ))}
          </div>

          <div className="relative flex items-center justify-center">
            <motion.div initial={{ x: -40, opacity: 0, rotate: -8 }} animate={{ x: 10, opacity: 1, rotate: -6 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
              <div className="grid size-28 place-items-center rounded-full border-4 border-card bg-rose-soft font-display text-3xl text-rose-deep shadow-soft">You</div>
            </motion.div>
            <motion.div initial={{ x: 40, opacity: 0, rotate: 8 }} animate={{ x: -10, opacity: 1, rotate: 6 }} transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}>
              <ProfileImage src={profile.photo} name={profile.name} className="size-28 rounded-full border-4 border-card shadow-soft" />
            </motion.div>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
              className="absolute grid size-10 place-items-center rounded-full bg-rose text-white shadow-lift"
            >
              <Heart className="size-5" fill="currentColor" aria-hidden />
            </motion.span>
          </div>

          <DialogTitle className="mt-8 font-display text-4xl font-semibold">It&apos;s a Match!</DialogTitle>
          <DialogDescription className="mt-3 text-ink-soft">
            You both liked each other.
          </DialogDescription>

          <div className="mt-8 flex flex-col gap-3">
            <Button asChild variant="rose" size="lg">
              <Link href="/app/matches" onClick={onClose}>View Matches</Link>
            </Button>
            <Button variant="ghost" size="lg" onClick={onClose}>
              Continue Discovering
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
