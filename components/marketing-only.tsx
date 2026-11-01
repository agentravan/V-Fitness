"use client";

import { usePathname } from "next/navigation";

/** Renders marketing chrome (header, footer, floating CTA) everywhere except the demo portal. */
export function MarketingOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;
  return <>{children}</>;
}
