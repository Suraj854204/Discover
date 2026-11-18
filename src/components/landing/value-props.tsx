import { HeartHandshake, Lock, Users } from "lucide-react";

const ITEMS = [
  { icon: Lock, title: "Privacy First", body: "Your likes stay private until it's mutual." },
  { icon: HeartHandshake, title: "Meaningful Matches", body: "Only mutual likes create a match." },
  { icon: Users, title: "Real Connections", body: "Discover people who truly vibe with you." },
];

export function ValueProps() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <ul className="grid gap-5 md:grid-cols-3">
        {ITEMS.map(({ icon: Icon, title, body }) => (
          <li key={title} className="group rounded-card border border-line bg-gradient-to-b from-blush/70 to-card p-8 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
            <span className="grid size-12 place-items-center rounded-2xl bg-card text-rose shadow-soft transition-transform duration-300 group-hover:scale-110">
              <Icon className="size-6" aria-hidden />
            </span>
            <h2 className="mt-6 font-display text-2xl font-semibold">{title}</h2>
            <p className="mt-2 text-ink-soft">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
