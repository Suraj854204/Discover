"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FloatingHeart } from "@/components/landing/floating-heart";

export function ContinuePanel() {
  return (
    <section className="relative overflow-hidden rounded-card bg-gradient-to-br from-blush-deep to-blush p-7">
      <FloatingHeart className="right-6 top-6 size-6" />
      <FloatingHeart className="bottom-10 right-16 size-4" delay={1.3} />
      <h2 className="font-display text-3xl font-semibold leading-tight">Continue Discovering</h2>
      <p className="mt-2 max-w-[16rem] text-sm text-ink-soft">More amazing people are waiting for you.</p>
      <Button asChild variant="rose" className="mt-6">
        <Link href="/app/discover">
          Go to Discover <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Button>
    </section>
  );
}

export function PremiumCard() {
  return (
    <section className="rounded-card border border-line bg-card p-7 shadow-soft">
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-rose">
        <Sparkles className="size-3.5" aria-hidden /> Concept preview
      </p>
      <h2 className="mt-3 font-display text-2xl font-semibold leading-tight">Find your person. On your terms.</h2>
      <p className="mt-2 text-sm text-ink-soft">A possible future premium experience, shown here as a design concept only.</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-5">Learn more</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="font-display text-3xl font-semibold">Demo concept</DialogTitle>
          <DialogDescription className="mt-3 text-sm text-ink-soft">
            Premium is not available. There are no plans, payments or subscriptions in this demo. This card only illustrates an optional future experience.
          </DialogDescription>
          <DialogClose asChild>
            <Button className="mt-8 w-full">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </section>
  );
}
