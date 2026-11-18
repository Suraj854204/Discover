"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { Logo } from "./logo";
import { UserMenu } from "./user-menu";

export function TopBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [bellOpen, setBellOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-ivory/85 backdrop-blur-md">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <Logo href="/app/dashboard" className="lg:hidden" />
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/app/matches${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
          }}
          className="relative hidden max-w-md flex-1 md:block"
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your matches"
            aria-label="Search your matches"
            className="h-11 w-full rounded-full border border-line bg-card pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-ink-faint focus:border-rose"
          />
        </form>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={bellOpen}
              onClick={() => setBellOpen((o) => !o)}
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-line bg-card text-ink-soft transition-colors hover:text-ink"
            >
              <Bell className="size-5" aria-hidden />
            </button>
            {bellOpen && (
              <div className="absolute right-0 z-50 mt-3 w-72 rounded-2xl border border-line bg-card p-4 text-sm shadow-lift">
                <p className="font-semibold">You&apos;re all caught up</p>
                <p className="mt-1 text-ink-soft">No notifications. Coy never tells you who liked you until it&apos;s mutual.</p>
              </div>
            )}
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
