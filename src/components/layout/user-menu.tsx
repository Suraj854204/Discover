"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogOut, Settings } from "lucide-react";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((o) => !o)}
        className="grid size-10 cursor-pointer place-items-center rounded-full bg-rose-soft text-sm font-semibold text-rose-deep transition-transform active:scale-95"
      >
        D
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-3 w-64 rounded-2xl border border-line bg-card p-3 shadow-lift">
          <div className="px-2 py-2">
            <p className="text-sm font-semibold">Demo User</p>
            <p className="mt-1 text-xs text-ink-soft">Demo account. No sign-in needed.</p>
          </div>
          <Link href="/app/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm text-ink-soft hover:bg-ivory-deep hover:text-ink">
            <Settings className="size-4" aria-hidden /> Settings
          </Link>
          <Link href="/" className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm text-ink-soft hover:bg-ivory-deep hover:text-ink">
            <LogOut className="size-4" aria-hidden /> Log out
          </Link>
        </div>
      )}
    </div>
  );
}
