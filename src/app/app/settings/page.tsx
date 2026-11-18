import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  return (
    <section className="mx-auto max-w-xl py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose">Placeholder page</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Settings</h1>
      <p className="mt-5 text-ink-soft">Placeholder page. Account and preference settings aren&apos;t part of this demo.</p>
      <Button asChild className="mt-8">
        <Link href="/app/dashboard">Back to Dashboard</Link>
      </Button>
    </section>
  );
}
