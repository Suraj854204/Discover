import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Logo } from "./logo";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/app/discover", label: "Discover" },
      { href: "/app/matches", label: "Matches" },
    ],
  },
  {
    title: "Information",
    links: [
      { href: "/about", label: "About" },
      { href: "/safety", label: "Safety" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/feedback", label: "Feedback" },
    ],
  },
];

export function Footer({ className = "" }: { className?: string }) {
  return (
    <footer className={`mt-24 border-t border-line bg-ivory-deep/40 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs sm:col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 font-display text-lg text-ink">More than a match.</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              A calmer way to meet people. Interest stays private until it&apos;s mutual.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sage">
              <ShieldCheck className="size-4" aria-hidden /> Privacy-first by design
            </p>
          </div>
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">{col.title}</h2>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-ink-soft transition-colors hover:text-rose-deep">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Coy. An independent demo built for the Coy SDE Intern Assignment.</p>
          <p>Nobody sees your interest unless it&apos;s mutual · v0.2.0 demo</p>
        </div>
      </div>
    </footer>
  );
}
