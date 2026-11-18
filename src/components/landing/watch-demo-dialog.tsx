"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const STEPS = [
  ["Swipe", "Drag a profile right to like it, or left to pass. Buttons and arrow keys work too."],
  ["Match", "If that person already liked you, you both get an It's a Match! moment. Otherwise nothing is revealed."],
  ["Connect", "Every mutual match is saved in your Matches list, ready whenever you are."],
];

export function WatchDemoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <Play className="size-4" aria-hidden /> Watch Demo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="font-display text-3xl font-semibold">How Coy works</DialogTitle>
        <DialogDescription className="mt-2 text-sm text-ink-soft">
          A quick written walkthrough. This demo has no video.
        </DialogDescription>
        <ol className="mt-6 space-y-4">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="flex gap-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-rose-soft text-sm font-semibold text-rose-deep">{i + 1}</span>
              <p className="text-sm text-ink-soft">
                <strong className="text-ink">{title}.</strong> {body}
              </p>
            </li>
          ))}
        </ol>
        <DialogClose asChild>
          <Button className="mt-8 w-full" variant="primary">Got it</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
