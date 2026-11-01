"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { DemoLogin, type Role } from "@/components/dashboard/login";
import { Portal } from "@/components/dashboard/shell";
import { StoreProvider } from "@/components/dashboard/store";

const AUTH_KEY = "vf-os-auth";

const session = {
  get() {
    try { return window.sessionStorage.getItem(AUTH_KEY); } catch { return null; }
  },
  set(v: string | null) {
    try { if (v === null) window.sessionStorage.removeItem(AUTH_KEY); else window.sessionStorage.setItem(AUTH_KEY, v); } catch { /* private mode */ }
  },
};

/**
 * V Fitness Club OS — interactive demo of the gym management system:
 * attendance, member tracking, protein-bar orders, package tracker and analytics.
 */
export default function DashboardPage() {
  const [role, setRole] = useState<Role | null | undefined>(undefined);

  useEffect(() => setRole((session.get() as Role | null) ?? null), []);

  if (role === undefined) {
    return (
      <div className="grid min-h-dvh place-items-center bg-black">
        <Loader2 className="h-6 w-6 animate-spin text-brand" aria-label="Loading" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {role ? (
        <motion.div key="portal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <StoreProvider>
            <Portal role={role} onLogout={() => { session.set(null); setRole(null); }} />
          </StoreProvider>
        </motion.div>
      ) : (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <DemoLogin onSuccess={(r) => { session.set(r); setRole(r); }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
