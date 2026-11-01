import Link from "next/link";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="vf-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fb923c" />
          <stop offset="1" stopColor="#e11d48" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#vf-g)" />
      <path d="M10 11h5.2l4.8 12.4L24.8 11H30l-7.6 18h-4.8z" fill="#09090b" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="V Fitness — home">
      <LogoMark className="h-9 w-9 transition-transform duration-300 group-hover:rotate-[-6deg]" />
      <span className="font-display text-2xl font-extrabold uppercase italic tracking-wide text-white">
        V <span className="text-brand">Fitness</span>
      </span>
    </Link>
  );
}
