"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Footer } from "./footer";
import { BottomNav } from "./bottom-nav";
import { Logo } from "./logo";
import { APP_NAV, APP_SECONDARY_NAV, type NavItem } from "./nav-items";
import { TopBar } from "./top-bar";

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
        active ? "text-rose-deep" : "text-ink-soft hover:bg-ivory-deep hover:text-ink",
      )}
    >
      {active && (
        <motion.span layoutId="sidebar-pill" className="absolute inset-0 -z-10 rounded-2xl bg-rose-soft" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
      )}
      <Icon className="size-5" aria-hidden />
      {item.label}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-card/60 px-4 py-6 lg:flex">
        <Logo href="/app/dashboard" className="px-3" />
        <nav aria-label="Primary" className="mt-10 flex flex-1 flex-col">
          <ul className="space-y-1">
            {APP_NAV.map((item) => (
              <li key={item.href}>
                <SidebarLink item={item} active={pathname === item.href} />
              </li>
            ))}
          </ul>
          <ul className="mt-auto space-y-1 border-t border-line pt-4">
            {APP_SECONDARY_NAV.map((item) => (
              <li key={item.href}>
                <SidebarLink item={item} active={pathname === item.href} />
              </li>
            ))}
            <li>
              <Link href="/" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-ivory-deep hover:text-ink">
                <LogOut className="size-5" aria-hidden /> Log out
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="min-w-0">
        <TopBar />
        <main id="main" className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          {children}
        </main>
        <Footer className="mt-16" />
      </div>
      <BottomNav />
    </div>
  );
}
