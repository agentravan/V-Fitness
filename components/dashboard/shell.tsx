"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3, Bell, CalendarCheck, Layers, LayoutDashboard, LogOut, RotateCcw, Search, ShoppingBag, Users,
  type LucideIcon,
} from "lucide-react";

import { LogoMark } from "@/components/logo";
import { useStore } from "./store";
import { Avatar, Toasts } from "./ui";
import { Overview } from "./overview";
import { Attendance } from "./attendance";
import { Members } from "./members";
import { Orders } from "./orders";
import { Packages } from "./packages";
import { Analytics } from "./analytics";
import { DEMO_CREDENTIALS, statusOf } from "@/lib/demo-data";
import type { Role } from "./login";

export type Section = "overview" | "attendance" | "members" | "orders" | "packages" | "analytics";

const NAV: { id: Section; label: string; icon: LucideIcon; blurb: string }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, blurb: "Today at a glance" },
  { id: "attendance", label: "Attendance", icon: CalendarCheck, blurb: "Check-in desk and today's log" },
  { id: "members", label: "Members", icon: Users, blurb: "Customer tracking, renewals and profiles" },
  { id: "orders", label: "Orders", icon: ShoppingBag, blurb: "Protein bar, pro shop and inventory" },
  { id: "packages", label: "Packages", icon: Layers, blurb: "PT and class-pack session tracker" },
  { id: "analytics", label: "Analytics", icon: BarChart3, blurb: "Customer, revenue and retention insights" },
];

export function Portal({ role, onLogout }: { role: Role; onLogout: () => void }) {
  const { data, today, reset } = useStore();
  const [section, setSection] = useState<Section>("overview");
  const [openMember, setOpenMember] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    const h = window.location.hash.replace("#", "") as Section;
    if (NAV.some((n) => n.id === h)) setSection(h);
  }, []);

  const go = useCallback((s: Section) => {
    setSection(s);
    history.replaceState(null, "", `#${s}`);
    window.scrollTo({ top: 0 });
  }, []);
  const onOpened = useCallback(() => setOpenMember(null), []);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return [];
    return data.members.filter((m) => m.name.toLowerCase().includes(t) || m.id.toLowerCase().includes(t)).slice(0, 6);
  }, [q, data.members]);

  const expiring = data.members.filter((m) => statusOf(m, today) === "Expiring Soon").length;
  const current = NAV.find((n) => n.id === section)!;

  return (
    <div className="flex min-h-dvh bg-black">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-white/[0.07] bg-[#070708] p-4 lg:flex">
        <Link href="/" className="flex items-center gap-2 px-2 py-1" aria-label="V Fitness website">
          <Image src="/images/logo.png" alt="V Fitness" width={180} height={60} className="h-9 w-auto" />
        </Link>
        <p className="mt-1 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">Club OS</p>

        <div className="mt-6 rounded-lg border border-white/[0.07] bg-black px-3 py-2 text-xs">
          <p className="text-white/40">Branch</p>
          <p className="font-medium text-white">International City</p>
        </div>

        <nav aria-label="Dashboard" className="mt-5 space-y-0.5">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = section === id;
            return (
              <button
                key={id}
                onClick={() => go(id)}
                aria-current={active ? "page" : undefined}
                className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? "text-white" : "text-white/50 hover:bg-white/[0.04] hover:text-white"}`}
              >
                {active && <motion.span layoutId="side-pill" className="absolute inset-0 rounded-lg bg-white/[0.07]" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                <Icon className={`relative h-4 w-4 ${active ? "text-brand" : ""}`} aria-hidden />
                <span className="relative">{label}</span>
                {id === "members" && expiring > 0 && <span className="relative ml-auto rounded bg-rose-500/20 px-1.5 text-[10px] font-semibold text-rose-300">{expiring}</span>}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2">
          <button onClick={reset} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/40 hover:text-white">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset demo data
          </button>
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] p-2.5">
            <Avatar name="Admin Demo" size={8} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white">{role}</p>
              <p className="truncate text-[11px] text-white/40">{DEMO_CREDENTIALS.email}</p>
            </div>
            <button onClick={onLogout} className="text-white/40 hover:text-white" aria-label="Log out"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-black/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Link href="/" className="lg:hidden" aria-label="V Fitness website"><LogoMark className="h-8 w-8" /></Link>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">{current.label}</h1>
              <p className="hidden truncate text-xs text-white/40 sm:block">{current.blurb} · {new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(today)}</p>
            </div>

            <div className="relative ml-auto hidden w-72 md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" aria-hidden />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search members…" className="field !py-2 !pl-9 text-sm" aria-label="Search members" />
              <AnimatePresence>
                {results.length > 0 && (
                  <motion.ul initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-x-0 top-full mt-1 overflow-hidden rounded-lg border border-white/10 bg-[#141416] shadow-2xl">
                    {results.map((m) => (
                      <li key={m.id}>
                        <button
                          onClick={() => { setOpenMember(m.id); setQ(""); go("members"); }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-white/5"
                        >
                          <Avatar name={m.name} size={8} />
                          <span className="min-w-0 flex-1 truncate text-white/85">{m.name}</span>
                          <span className="text-xs text-white/40">{m.id}</span>
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 sm:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live demo
            </span>
            <button onClick={() => go("members")} className="relative grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/60 hover:text-white" aria-label={`${expiring} memberships expiring`}>
              <Bell className="h-4 w-4" />
              {expiring > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{expiring}</span>}
            </button>
            <button onClick={onLogout} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/60 hover:text-white lg:hidden" aria-label="Log out"><LogOut className="h-4 w-4" /></button>
          </div>

          {/* mobile tabs */}
          <nav aria-label="Dashboard sections" className="flex gap-1 overflow-x-auto px-3 pb-2 lg:hidden">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => go(id)} className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${section === id ? "bg-brand text-black" : "text-white/55"}`}>
                <Icon className="h-3.5 w-3.5" aria-hidden /> {label}
              </button>
            ))}
          </nav>
        </header>

        <main className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {section === "overview" && <Overview go={go} />}
              {section === "attendance" && <Attendance />}
              {section === "members" && <Members openId={openMember} onOpened={onOpened} />}
              {section === "orders" && <Orders />}
              {section === "packages" && <Packages />}
              {section === "analytics" && <Analytics />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Toasts />
    </div>
  );
}
