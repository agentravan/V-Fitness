"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, Menu, X } from "lucide-react";

import { Logo } from "./logo";
import { useLead } from "./lead-modal";
import { nav } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const { open } = useLead();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen ? "border-b border-white/10 bg-black/85 backdrop-blur-xl" : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-[76px]">
        <Logo className="h-10 w-auto" />

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => {
            const active = !item.href.includes("#") && pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-[15px] font-medium transition-colors ${active ? "text-white" : "text-white/70 hover:text-white"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[15px] font-medium text-white/80 hover:text-white">
            <LogIn className="h-4 w-4" aria-hidden /> Sign in
          </Link>
          <button onClick={() => open()} className="btn-primary !py-2.5">
            Join now
          </button>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 text-white lg:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden lg:hidden"
          >
            <div className="container-x flex flex-col gap-1 pb-6 pt-2">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-lg px-3 py-3 text-lg font-medium text-white/90 hover:bg-white/5">
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link href="/dashboard" className="btn-ghost">
                  <LogIn className="h-4 w-4" aria-hidden /> Sign in
                </Link>
                <button onClick={() => open()} className="btn-primary">Join now</button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
