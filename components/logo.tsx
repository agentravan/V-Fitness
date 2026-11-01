import Image from "next/image";
import Link from "next/link";

/** The V Fitness lifter mark on its own (for compact spots like the dashboard). */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <Image
      src="/images/logo-mark.png"
      alt=""
      aria-hidden
      width={66}
      height={66}
      className={`object-contain drop-shadow-[0_0_10px_rgba(34,211,238,0.45)] ${className}`}
    />
  );
}

/** Full V Fitness logo (mark + wordmark), as used on the club's signage and campaigns. */
export function Logo({ className = "h-11 w-auto" }: { className?: string }) {
  return (
    <Link href="/" className="group flex items-center" aria-label="V Fitness — home">
      <Image
        src="/images/logo.png"
        alt="V Fitness"
        width={180}
        height={60}
        priority
        className={`transition-[filter] duration-300 group-hover:drop-shadow-[0_0_14px_rgba(34,211,238,0.7)] ${className}`}
      />
    </Link>
  );
}
