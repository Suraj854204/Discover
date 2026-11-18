import Link from "next/link";

export function Logo({ className = "", href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} aria-label="Coy home" className={`inline-flex items-center gap-2 ${className}`}>
      <span aria-hidden className="grid size-8 place-items-center rounded-full bg-rose text-white">
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
          <path d="M12 21s-7.5-4.6-9.6-9.2C.8 8.2 3 4.5 6.6 4.5c2 0 3.6 1 4.7 2.6l.7 1 .7-1c1.1-1.6 2.7-2.6 4.7-2.6 3.6 0 5.8 3.7 4.2 7.3C19.5 16.4 12 21 12 21z" />
        </svg>
      </span>
      <span className="font-display text-2xl font-semibold tracking-tight">Coy</span>
    </Link>
  );
}
