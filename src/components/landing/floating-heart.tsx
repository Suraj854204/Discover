"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingHeart({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.span
      aria-hidden
      className={cn("absolute text-rose", className)}
      animate={{ y: [0, -10, 0], rotate: [-6, 6, -6] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <Heart fill="currentColor" className="size-full" />
    </motion.span>
  );
}
