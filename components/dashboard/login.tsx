"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, Eye, EyeOff, KeyRound, Loader2, ShieldCheck, Zap } from "lucide-react";

import { DEMO_CREDENTIALS } from "@/lib/demo-data";
import { photos } from "@/lib/site";

const ROLES = ["Admin", "Front desk", "Trainer"] as const;
export type Role = (typeof ROLES)[number];

export function DemoLogin({ onSuccess }: { onSuccess: (role: Role) => void }) {
  const [role, setRole] = useState<Role>("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    return () => {
      cancelled.current = true;
    };
  }, []);

  const submit = async (e?: string, p?: string) => {
    const em = (e ?? email).trim().toLowerCase();
    const pw = p ?? password;
    setError("");
    setBusy(true);
    await new Promise((r) => setTimeout(r, 650));
    if (cancelled.current) return;
    if (em === DEMO_CREDENTIALS.email && pw === DEMO_CREDENTIALS.password) onSuccess(role);
    else {
      setBusy(false);
      setError("Those details don't match the demo account. Use the 1-click demo login.");
    }
  };

  const oneClick = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    setEmail("");
    setPassword("");
    for (let i = 1; i <= DEMO_CREDENTIALS.email.length; i++) {
      if (cancelled.current) return;
      setEmail(DEMO_CREDENTIALS.email.slice(0, i));
      await new Promise((r) => setTimeout(r, 16));
    }
    for (let i = 1; i <= DEMO_CREDENTIALS.password.length; i++) {
      if (cancelled.current) return;
      setPassword(DEMO_CREDENTIALS.password.slice(0, i));
      await new Promise((r) => setTimeout(r, 60));
    }
    await submit(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
  };

  return (
    <div className="grid min-h-dvh bg-black lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden lg:block">
        <Image src={photos.heroDuo.src} alt="" fill priority sizes="55vw" className="object-cover object-[60%_20%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Image src="/images/logo.png" alt="V Fitness" width={180} height={60} className="h-12 w-auto" />
          <div>
            <p className="eyebrow">V Fitness Club OS</p>
            <h2 className="mt-3 max-w-lg text-5xl font-semibold leading-[1.05]">Run the whole club from one screen.</h2>
            <ul className="mt-8 grid max-w-lg grid-cols-2 gap-3 text-sm text-white/80">
              {["Attendance & QR check-in", "Member tracking", "Protein bar & shop orders", "PT package tracker", "Renewal reminders", "Customer analytics"].map((f) => (
                <li key={f} className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-brand" aria-hidden /> {f}</li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Form */}
      <main className="relative flex items-center justify-center px-5 py-12">
        <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-brand/10 blur-[120px]" />
        <div className="relative w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to website
          </Link>
          <Image src="/images/logo.png" alt="V Fitness" width={180} height={60} className="mb-6 h-10 w-auto lg:hidden" />
          <h1 className="text-3xl font-semibold">Sign in to Club OS</h1>
          <p className="mt-2 text-white/50">Staff portal for V Fitness, International City.</p>

          <div role="tablist" aria-label="Sign in as" className="mt-7 grid grid-cols-3 rounded-xl border border-white/10 bg-[#0c0c0d] p-1">
            {ROLES.map((r) => (
              <button
                key={r}
                role="tab"
                aria-selected={role === r}
                onClick={() => setRole(r)}
                className="relative rounded-lg px-3 py-2 text-sm font-medium"
              >
                {role === r && <motion.span layoutId="role-pill" className="absolute inset-0 rounded-lg bg-white/10" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <span className={`relative ${role === r ? "text-white" : "text-white/50"}`}>{r}</span>
              </button>
            ))}
          </div>

          {/* demo banner */}
          <div className="mt-5 rounded-xl border border-brand/35 bg-brand/[0.07] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">Live demo account</p>
                <p className="mt-0.5 truncate font-mono text-xs text-white/60">{DEMO_CREDENTIALS.email} · {DEMO_CREDENTIALS.password}</p>
              </div>
              <button onClick={oneClick} disabled={busy} className="btn-primary shrink-0 !px-3.5 !py-2 text-sm disabled:opacity-70">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Zap className="h-4 w-4" aria-hidden />}
                1-Click Demo Login
              </button>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="mt-6 space-y-4"
            aria-label="Sign in"
          >
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-white/70">Work email</label>
              <input id="admin-email" type="email" autoComplete="username" className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@vfitness.com" />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="admin-password" className="text-sm font-medium text-white/70">Password</label>
                <span className="text-xs text-white/35">Forgot password?</span>
              </div>
              <div className="relative">
                <input id="admin-password" type={show ? "text" : "password"} autoComplete="current-password" className="field pr-11" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••" />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-white/40 hover:text-white" aria-label={show ? "Hide password" : "Show password"}>
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-white/60">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-[#00d4dc]" /> Keep me signed in on this device
            </label>
            {error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>}
            <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-70">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <KeyRound className="h-4 w-4" aria-hidden />}
              Sign in as {role}
            </button>
          </form>
          <p className="mt-6 flex items-center gap-2 text-xs text-white/40">
            <ShieldCheck className="h-4 w-4" aria-hidden /> Demo data only. No real member details or messages are sent.
          </p>
        </div>
      </main>
    </div>
  );
}
