// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ProfileImage } from "@/components/discover/profile-image";

afterEach(() => {
  cleanup();
  delete (HTMLImageElement.prototype as unknown as Record<string, unknown>).complete;
  delete (HTMLImageElement.prototype as unknown as Record<string, unknown>).naturalWidth;
});

const stubImage = (complete: boolean, naturalWidth: number) => {
  Object.defineProperty(HTMLImageElement.prototype, "complete", { configurable: true, get: () => complete });
  Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", { configurable: true, get: () => naturalWidth });
};

describe("ProfileImage", () => {
  it("becomes visible when the image already finished loading before hydration (SSR case)", () => {
    stubImage(true, 640);
    render(<ProfileImage src="/avatars/women-44.svg" name="Aanya" />);
    expect(screen.getByAltText("Aanya")).toHaveClass("opacity-100");
  });

  it("shows the fallback when the image already failed before hydration", () => {
    stubImage(true, 0);
    render(<ProfileImage src="/missing.jpg" name="Aanya" />);
    expect(screen.getByLabelText("Aanya (photo unavailable)")).toBeInTheDocument();
  });
});
