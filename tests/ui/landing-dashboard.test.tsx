// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { Hero } from "@/components/landing/hero";
import { ValueProps } from "@/components/landing/value-props";
import { CtaBanner } from "@/components/landing/cta-banner";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { json, makeMatch } from "./fixtures";

vi.mock("next/link", () => ({ default: ({ children, href, ...p }: { children: React.ReactNode; href: string }) => <a href={href} {...p}>{children}</a> }));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("landing page", () => {
  it("hero has the headline and CTAs that lead into the app", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Good things happen here.");
    expect(screen.getByRole("link", { name: /Start Discovering/ })).toHaveAttribute("href", "/app/discover");
    expect(screen.getByRole("button", { name: /Watch Demo/ })).toBeInTheDocument();
  });

  it("states the three product principles", () => {
    render(<ValueProps />);
    expect(screen.getByText("Your likes stay private until it's mutual.")).toBeInTheDocument();
    expect(screen.getByText("Only mutual likes create a match.")).toBeInTheDocument();
    expect(screen.getByText("Discover people who truly vibe with you.")).toBeInTheDocument();
  });

  it("CTA banner links to the dashboard", () => {
    render(<CtaBanner />);
    expect(screen.getByRole("link", { name: /Get Started Free/ })).toHaveAttribute("href", "/app/dashboard");
  });
});

describe("DashboardView", () => {
  const stats = { success: true, likesSent: 5, mutualMatches: 2, profilesViewed: 8, totalProfiles: 32, activityLast7Days: 8 };

  it("renders stats and only the mutual matches the API returns", async () => {
    vi.stubGlobal("fetch", vi.fn((url: string) => (url === "/api/stats" ? json(stats) : json({ success: true, count: 1, matches: [makeMatch()] }))));
    render(<DashboardView />);
    const list = await screen.findByRole("list", { name: "Your statistics" });
    const text = list.textContent!;
    expect(within(list).getByText("Likes Sent")).toBeInTheDocument();
    expect(within(list).getByText("Mutual Matches")).toBeInTheDocument();
    expect(within(list).getByText("Profiles Viewed")).toBeInTheDocument();
    expect(within(list).getByText("Discovery Activity")).toBeInTheDocument();
    expect(text).toContain("25% of everyone explored");
    expect(text).not.toMatch(/Total Likes|liked you/i);
    expect(screen.getByText("Aanya, 24")).toBeInTheDocument();
  });

  it("shows the empty matches state", async () => {
    vi.stubGlobal("fetch", vi.fn((url: string) => (url === "/api/stats" ? json({ ...stats, mutualMatches: 0 }) : json({ success: true, count: 0, matches: [] }))));
    render(<DashboardView />);
    expect(await screen.findByText("Your story starts with a connection.")).toBeInTheDocument();
  });

  it("shows an error state with retry", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("offline"))));
    render(<DashboardView />);
    expect(await screen.findByText("We couldn't load your dashboard")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });
});
