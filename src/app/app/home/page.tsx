import type { Metadata } from "next";

export const metadata: Metadata = { title: "Home" };

/** Intentionally blank placeholder, as required by the assignment. */
export default function HomePage() {
  return (
    <section className="grid min-h-[60dvh] place-items-center py-20 text-center">
      <div>
        <h1 className="font-display text-3xl font-semibold">Home</h1>
        <p className="mt-2 text-sm text-ink-faint">Placeholder tab. The functionality lives in Discover.</p>
      </div>
    </section>
  );
}
