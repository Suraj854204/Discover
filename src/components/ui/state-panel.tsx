import type { ReactNode } from "react";

export function StatePanel({ icon, title, children, action }: { icon: ReactNode; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div role="status" className="mx-auto flex max-w-sm flex-col items-center rounded-card border border-line bg-card px-8 py-14 text-center shadow-soft">
      <div className="grid size-16 place-items-center rounded-full bg-rose-soft text-rose-deep">{icon}</div>
      <h2 className="mt-6 font-display text-2xl font-semibold">{title}</h2>
      {children && <p className="mt-2 text-ink-soft">{children}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
