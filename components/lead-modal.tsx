"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Dumbbell, X } from "lucide-react";

import { LeadForm, type LeadPrefill } from "./lead-form";

type Ctx = { open: (prefill?: LeadPrefill) => void; close: () => void };
const LeadCtx = createContext<Ctx>({ open: () => {}, close: () => {} });
export const useLead = () => useContext(LeadCtx);

export function LeadProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<LeadPrefill | undefined>();
  const [showFab, setShowFab] = useState(false);
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = useCallback((p?: LeadPrefill) => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setPrefill(p);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  // Scroll lock, Escape to close, initial focus.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => dialogRef.current?.querySelector<HTMLInputElement>("input,select,button")?.focus(), 60);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [isOpen, close]);

  // Floating CTA appears after the hero.
  useEffect(() => {
    const onScroll = () => setShowFab(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fabVisible = showFab && !isOpen && !pathname?.startsWith("/dashboard");

  return (
    <LeadCtx.Provider value={{ open, close }}>
      {children}

      <AnimatePresence>
        {fabVisible && (
          <motion.button
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => open()}
            className="btn-primary fixed bottom-5 right-5 z-40 shadow-2xl sm:bottom-8 sm:right-8"
          >
            <Dumbbell className="h-4 w-4" aria-hidden /> Free 3-Day Trial
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && close()}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="lead-modal-title"
              initial={{ y: 60, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-line bg-ink-2 p-6 shadow-2xl sm:rounded-3xl sm:p-8"
            >
              <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-80 -translate-x-1/2 rounded-full bg-brand/25 blur-3xl" />
              <button
                onClick={close}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-line text-slate-400 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="eyebrow">No payment · No commitment</p>
              <h2 id="lead-modal-title" className="mt-2 text-4xl font-semibold">
                Book your <span className="text-gradient">free 3-day trial</span>
              </h2>
              <p className="mb-6 mt-2 text-slate-400">Pick a time that suits you — we&apos;ll have a coach ready.</p>
              <LeadForm prefill={prefill} onDone={close} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LeadCtx.Provider>
  );
}
