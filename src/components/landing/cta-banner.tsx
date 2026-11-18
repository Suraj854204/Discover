import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingHeart } from "./floating-heart";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blush-deep via-blush to-ivory-deep px-6 py-16 text-center sm:px-16 sm:py-20">
        <div aria-hidden className="absolute -left-16 -top-16 size-64 rounded-full bg-white/40" />
        <div aria-hidden className="absolute -bottom-20 -right-10 size-72 rounded-full bg-rose/15" />
        <FloatingHeart className="left-[12%] top-[22%] size-7" />
        <FloatingHeart className="right-[14%] top-[30%] size-5" delay={1.4} />
        <FloatingHeart className="bottom-[18%] left-[24%] size-4" delay={0.7} />
        <div className="relative">
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Ready to find your match?</h2>
          <p className="mx-auto mt-4 max-w-md text-ink-soft">Join Coy today and start your journey.</p>
          <Button asChild variant="rose" size="lg" className="mt-9">
            <Link href="/app/dashboard">
              Get Started Free <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <p className="mt-4 text-xs text-ink-faint">Demo only. No account, subscription or payment required.</p>
        </div>
      </div>
    </section>
  );
}
