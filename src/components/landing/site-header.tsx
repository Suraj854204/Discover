"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { SITE_NAV } from "@/components/layout/nav-items";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ivory/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {SITE_NAV.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <li key={label}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn("relative block rounded-full px-5 py-2 text-sm font-medium transition-colors", active ? "text-rose-deep" : "text-ink-soft hover:text-ink")}
                  >
                    {active && <motion.span layoutId="site-pill" className="absolute inset-0 -z-10 rounded-full bg-rose-soft" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="rose" size="sm" className="hidden sm:inline-flex">
            <Link href="/app/dashboard">Get Started</Link>
          </Button>
          <button
            type="button"
            className="grid size-10 cursor-pointer place-items-center rounded-full border border-line bg-card md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t border-line bg-ivory px-4 pb-5 pt-3 md:hidden">
          <ul className="space-y-1">
            {SITE_NAV.map(({ href, label }) => (
              <li key={label}>
                <Link href={href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-base font-medium text-ink-soft hover:bg-ivory-deep hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild variant="rose" className="mt-3 w-full">
            <Link href="/app/dashboard">Get Started</Link>
          </Button>
        </nav>
      )}
    </header>
  );
}
