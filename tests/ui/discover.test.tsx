// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfileCard } from "@/components/discover/profile-card";
import { SwipeDeck } from "@/components/discover/swipe-deck";
import { DiscoverView } from "@/components/discover/discover-view";
import { json, makeProfile } from "./fixtures";

vi.mock("next/link", () => ({ default: ({ children, href, ...p }: { children: React.ReactNode; href: string }) => <a href={href} {...p}>{children}</a> }));
vi.mock("sonner", () => ({ toast: { info: vi.fn(), error: vi.fn() } }));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ProfileCard", () => {
  it("renders name, age, location, bio and interests", () => {
    render(<ProfileCard profile={makeProfile()} />);
    expect(screen.getByRole("heading", { name: /Aanya\s*24/ })).toBeInTheDocument();
    expect(screen.getByText("Mumbai")).toBeInTheDocument();
    expect(screen.getByText(/Film-school grad/)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["Cinema", "Chai"]);
  });

  it("falls back to initials when the image fails", () => {
    render(<ProfileCard profile={makeProfile()} />);
    screen.getAllByRole("img", { hidden: true });
    const img = document.querySelector("img")!;
    img.dispatchEvent(new Event("error"));
    return waitFor(() => expect(screen.getByLabelText(/photo unavailable/)).toBeInTheDocument());
  });
});

describe("SwipeDeck", () => {
  const queue = [makeProfile(), makeProfile({ id: "p02", name: "Rohan" })];

  it("Like and Pass buttons call onSwipe with the right profile and action", async () => {
    const onSwipe = vi.fn().mockResolvedValue("ok");
    const user = userEvent.setup();
    const { rerender } = render(<SwipeDeck queue={queue} paused={false} onSwipe={onSwipe} />);
    await user.click(screen.getByRole("button", { name: "Like Aanya" }));
    expect(onSwipe).toHaveBeenCalledWith(queue[0], "like");

    rerender(<SwipeDeck queue={[queue[1]]} paused={false} onSwipe={onSwipe} />);
    await user.click(await screen.findByRole("button", { name: "Pass on Rohan" }));
    expect(onSwipe).toHaveBeenLastCalledWith(queue[1], "pass");
  });

  it("prevents duplicate submissions from rapid repeated input", async () => {
    let resolve!: (v: "ok") => void;
    const onSwipe = vi.fn(() => new Promise<"ok">((r) => (resolve = r)));
    const user = userEvent.setup();
    render(<SwipeDeck queue={queue} paused={false} onSwipe={onSwipe} />);
    await user.click(screen.getByRole("button", { name: "Like Aanya" }));
    await user.keyboard("{ArrowRight}{ArrowLeft}");
    expect(onSwipe).toHaveBeenCalledTimes(1);
    resolve("ok");
  });

  it("supports keyboard arrows", async () => {
    const onSwipe = vi.fn().mockResolvedValue("ok");
    const user = userEvent.setup();
    render(<SwipeDeck queue={queue} paused={false} onSwipe={onSwipe} />);
    await user.keyboard("{ArrowLeft}");
    expect(onSwipe).toHaveBeenCalledWith(queue[0], "pass");
  });
});

describe("DiscoverView (integration with mocked API)", () => {
  it("shows the empty state when the feed is exhausted", async () => {
    vi.stubGlobal("fetch", vi.fn(() => json({ success: true, profiles: [], remaining: 0 })));
    render(<DiscoverView />);
    expect(await screen.findByText("You've discovered everyone for now.")).toBeInTheDocument();
  });

  it("shows an error state with retry when the network fails", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("offline"))));
    render(<DiscoverView />);
    expect(await screen.findByText("We couldn't load profiles")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("shows the match screen after the server reports a mutual match, and advances the feed", async () => {
    const profiles = [makeProfile(), makeProfile({ id: "p02", name: "Rohan" })];
    const fetchMock = vi.fn((url: string, init?: RequestInit) => {
      if (url === "/api/swipe") {
        expect(JSON.parse(init!.body as string)).toEqual({ profileId: "p01", action: "like" });
        return json({ success: true, matched: true, match: { id: "m1" } });
      }
      return json({ success: true, profiles, remaining: 2 });
    });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<DiscoverView />);
    await user.click(await screen.findByRole("button", { name: "Like Aanya" }));
    expect(await screen.findByText("It's a Match!")).toBeInTheDocument();
    expect(screen.getByText(/You both liked each other/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View Matches" })).toHaveAttribute("href", "/app/matches");
    await user.click(screen.getByRole("button", { name: "Continue Discovering" }));
    expect(await screen.findByRole("button", { name: "Like Rohan" })).toBeInTheDocument();
  });

  it("does not show a match screen for a one-sided like", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) =>
        url === "/api/swipe"
          ? json({ success: true, matched: false })
          : json({ success: true, profiles: [makeProfile(), makeProfile({ id: "p02", name: "Rohan" })], remaining: 2 }),
      ),
    );
    const user = userEvent.setup();
    render(<DiscoverView />);
    await user.click(await screen.findByRole("button", { name: "Like Aanya" }));
    expect(await screen.findByRole("button", { name: "Like Rohan" })).toBeInTheDocument();
    expect(screen.queryByText("It's a Match!")).not.toBeInTheDocument();
  });
});
