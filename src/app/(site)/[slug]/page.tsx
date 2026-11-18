import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

const PAGES: Record<string, { title: string; body: string }> = {
  about: { title: "About", body: "Coy Discover is a standalone demo of a privacy-first discovery experience: browse profiles, like or pass, and only mutual interest becomes a match." },
  safety: { title: "Safety", body: "This is a demo with fictional profiles. A production product would include reporting, blocking and verification. Those are intentionally out of scope here." },
  privacy: { title: "Privacy", body: "Incoming likes are never shown. Matches are computed on the server, and only mutual likes ever appear in your Matches list." },
  terms: { title: "Terms", body: "Placeholder page. This demo has no real terms of service because there are no real users or accounts." },
  contact: { title: "Contact", body: "Placeholder page. This demo has no live contact channel." },
  feedback: { title: "Feedback", body: "Placeholder page. Feedback collection isn't implemented in this demo." },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = PAGES[(await params).slug];
  return { title: page?.title };
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = PAGES[(await params).slug];
  if (!page) notFound();
  return (
    <section className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose">Placeholder page</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{page.title}</h1>
      <p className="mt-5 text-ink-soft">{page.body}</p>
      <Button asChild className="mt-8">
        <Link href="/app/discover">Back to Discover</Link>
      </Button>
    </section>
  );
}
