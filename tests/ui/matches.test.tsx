// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MatchesView } from "@/components/matches/matches-view";
import { json, makeMatch, makeProfile } from "./fixtures";

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(searchQuery.value) }));
const searchQuery = vi.hoisted(() => ({ value: "" }));
vi.mock("next/link", () => ({ default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a> }));

afterEach(() => {
  searchQuery.value = "";
  cleanup();
  vi.unstubAllGlobals();
});

describe("MatchesView", () => {
  it("renders the count, profile details and match date", async () => {
    const matches = [makeMatch(), makeMatch({ id: "m2", profile: makeProfile({ id: "p03", name: "Meera", age: 25, location: "Delhi" }) })];
    vi.stubGlobal("fetch", vi.fn(() => json({ success: true, count: 2, matches })));
    render(<MatchesView />);
    expect(await screen.findByText("2 mutual matches")).toBeInTheDocument();
    expect(screen.getByText("Meera,")).toBeInTheDocument();
    expect(screen.getByText("Delhi")).toBeInTheDocument();
    expect(screen.getAllByText(/Matched 10 Nov 2026/)).toHaveLength(2);
  });

  it("filters by the search query", async () => {
    searchQuery.value = "q=meera";
    const matches = [makeMatch(), makeMatch({ id: "m2", profile: makeProfile({ id: "p03", name: "Meera", location: "Delhi" }) })];
    vi.stubGlobal("fetch", vi.fn(() => json({ success: true, count: 2, matches })));
    render(<MatchesView />);
    expect(await screen.findByText("Meera,")).toBeInTheDocument();
    expect(screen.queryByText("Aanya,")).not.toBeInTheDocument();
  });

  it("renders the empty state with a link to Discover", async () => {
    vi.stubGlobal("fetch", vi.fn(() => json({ success: true, count: 0, matches: [] })));
    render(<MatchesView />);
    expect(await screen.findByText("Your story starts with a connection.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to Discover →" })).toHaveAttribute("href", "/app/discover");
  });

  it("renders an error state when the API fails", async () => {
    vi.stubGlobal("fetch", vi.fn(() => json({ success: false, error: { code: "INTERNAL_ERROR", message: "Boom" } }, 500)));
    render(<MatchesView />);
    expect(await screen.findByText("We couldn't load your matches")).toBeInTheDocument();
    expect(screen.getByText("Boom")).toBeInTheDocument();
  });
});
