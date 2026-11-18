import { Compass, Heart, House, LayoutDashboard, LifeBuoy, Settings, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Main in-app destinations (sidebar + mobile bottom bar). */
export const APP_NAV: NavItem[] = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/home", label: "Home", icon: House },
  { href: "/app/discover", label: "Discover", icon: Compass },
  { href: "/app/matches", label: "Matches", icon: Heart },
];

export const APP_SECONDARY_NAV: NavItem[] = [
  { href: "/app/settings", label: "Settings", icon: Settings },
  { href: "/app/help", label: "Help & Support", icon: LifeBuoy },
];

/** Marketing site navigation. */
export const SITE_NAV = [
  { href: "/", label: "Home" },
  { href: "/app/discover", label: "Discover" },
  { href: "/app/matches", label: "Matches" },
  { href: "/about", label: "About" },
];
