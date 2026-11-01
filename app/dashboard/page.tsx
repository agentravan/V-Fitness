"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle, ArrowLeft, BarChart3, Bell, CalendarCheck, CalendarClock, Check, ChevronLeft, ChevronRight,
  CircleDollarSign, Eye, EyeOff, KeyRound, LayoutDashboard, Loader2, LogOut, Mail, MessageCircle, MessageSquare,
  RotateCcw, Search, Send, Settings, ShieldCheck, Sparkles, UserCheck, Users, X, Zap,
} from "lucide-react";

import { LogoMark } from "@/components/logo";
import {
  DEMO_CREDENTIALS, DEMO_KPIS, daysLeft, generateMembers, parseISO, pastWeekAttendance, reminderMessage,
  startOfDay, statusOf, toISO, type Channel, type Member, type MemberStatus, type PlanType,
} from "@/lib/demo-data";

/* ============================================================== Page / auth gate */

const AUTH_KEY = "vf-demo-auth";
const STATE_KEY = "vf-demo-state-v1";

const safeGet = (store: "local" | "session", key: string) => {
  try {
    return (store === "local" ? window.localStorage : window.sessionStorage).getItem(key);
  } catch {
    return null;
  }
};
const safeSet = (store: "local" | "session", key: string, value: string | null) => {
  try {
    const s = store === "local" ? window.localStorage : window.sessionStorage;
    if (value === null) s.removeItem(key);
    else s.setItem(key, value);
  } catch {
    /* storage unavailable (private mode) — demo still works in memory */
  }
};

export default function DashboardPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => setAuthed(safeGet("session", AUTH_KEY) === "1"), []);

  const login = () => {
    safeSet("session", AUTH_KEY, "1");
    setAuthed(true);
  };
  const logout = () => {
    safeSet("session", AUTH_KEY, null);
    setAuthed(false);
  };

  if (authed === null) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" aria-label="Loading" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {authed ? (
        <motion.div key="portal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Portal onLogout={logout} />
        </motion.div>
      ) : (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
          <DemoLogin onSuccess={login} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================== Demo login */

function DemoLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    return () => {
      cancelled.current = true;
    };
  }, []);

  const submit = useCallback(
    async (e?: string, p?: string) => {
      const em = (e ?? email).trim().toLowerCase();
      const pw = p ?? password;
      setError("");
      setBusy(true);
      await new Promise((r) => setTimeout(r, 650));
      if (cancelled.current) return;
      if (em === DEMO_CREDENTIALS.email && pw === DEMO_CREDENTIALS.password) onSuccess();
      else {
        setBusy(false);
        setError("Those details don't match the demo account. Use the 1-click login above.");
      }
    },
    [email, password, onSuccess],
  );

  // 1-click: types the credentials in, then signs in.
  const oneClick = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    setEmail("");
    setPassword("");
    for (let i = 1; i <= DEMO_CREDENTIALS.email.length; i++) {
      if (cancelled.current) return;
      setEmail(DEMO_CREDENTIALS.email.slice(0, i));
      await new Promise((r) => setTimeout(r, 18));
    }
    for (let i = 1; i <= DEMO_CREDENTIALS.password.length; i++) {
      if (cancelled.current) return;
      setPassword(DEMO_CREDENTIALS.password.slice(0, i));
      await new Promise((r) => setTimeout(r, 60));
    }
    await submit(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
  };

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden px-4 py-12">
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-brand/25 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-rose/20 blur-[120px]" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to website
        </Link>

        {/* Demo banner */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4 rounded-2xl border border-brand/40 bg-gradient-to-r from-brand/20 to-rose/10 p-4"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white">Live demo — no sign-up needed</p>
              <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-xs text-slate-300">
                <dt className="text-slate-500">Email</dt>
                <dd className="truncate">{DEMO_CREDENTIALS.email}</dd>
                <dt className="text-slate-500">Password</dt>
                <dd>{DEMO_CREDENTIALS.password}</dd>
              </dl>
              <button onClick={oneClick} disabled={busy} className="btn-primary mt-3 w-full !py-2.5 text-sm disabled:opacity-70">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Zap className="h-4 w-4" aria-hidden />}
                1-Click Demo Login
              </button>
            </div>
          </div>
        </motion.div>

        <motion.form
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="rounded-3xl border border-line bg-ink-2/90 p-7 shadow-2xl backdrop-blur"
          aria-labelledby="login-title"
        >
          <div className="flex items-center gap-3">
            <LogoMark className="h-10 w-10" />
            <div>
              <h1 id="login-title" className="text-3xl font-extrabold uppercase italic leading-none">Staff Portal</h1>
              <p className="mt-1 text-sm text-slate-500">V Fitness gym management</p>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">Admin email</label>
              <input id="admin-email" type="email" autoComplete="username" className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="demo@vfitness.com" />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">Password</label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  className="field pr-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-500 hover:text-white" aria-label={show ? "Hide password" : "Show password"}>
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && (
              <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>
            )}
            <button type="submit" disabled={busy} className="btn-ghost w-full disabled:opacity-70">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <KeyRound className="h-4 w-4" aria-hidden />}
              Sign in
            </button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4" aria-hidden /> Demo data only. Nothing is sent to real members.
          </p>
        </motion.form>
      </div>
    </div>
  );
}

/* ============================================================== Portal */

type Toast = { id: number; tone: "success" | "info" | "warn"; title: string; body?: string };
type LogItem = { id: number; at: number; text: string; icon: "check" | "undo" | "send" };
type StatusFilter = "All" | MemberStatus;
type PlanFilter = "All" | PlanType;
type SortKey = "expiry" | "name" | "join";

const PLAN_OPTIONS: PlanType[] = ["Monthly", "Quarterly", "Annual", "Personal Training"];
const PAGE_SIZE = 10;
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: DEMO_KPIS.currency, maximumFractionDigits: 0 });
const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const fmtDate = (iso: string) => dateFmt.format(parseISO(iso));

type Persisted = { date: string; present: string[]; reminders: Record<string, { channel: Channel; at: number }> };

function loadMembers(today: Date): Member[] {
  const base = generateMembers(today);
  const raw = safeGet("local", STATE_KEY);
  if (!raw) return base;
  try {
    const saved = JSON.parse(raw) as Persisted;
    if (saved.date !== toISO(today)) return base;
    const present = new Set(saved.present);
    return base.map((m) => ({ ...m, presentToday: present.has(m.id), lastReminder: saved.reminders[m.id] }));
  } catch {
    return base;
  }
}

function Portal({ onLogout }: { onLogout: () => void }) {
  const today = useMemo(() => startOfDay(), []);
  const [members, setMembers] = useState<Member[]>(() => loadMembers(today));
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [plan, setPlan] = useState<PlanFilter>("All");
  const [sort, setSort] = useState<SortKey>("expiry");
  const [page, setPage] = useState(1);
  const [channel, setChannel] = useState<Channel>("WhatsApp");
  const [sending, setSending] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [log, setLog] = useState<LogItem[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const idRef = useRef(1);

  // Persist demo state for today.
  useEffect(() => {
    const data: Persisted = {
      date: toISO(today),
      present: members.filter((m) => m.presentToday).map((m) => m.id),
      reminders: Object.fromEntries(members.filter((m) => m.lastReminder).map((m) => [m.id, m.lastReminder!])),
    };
    safeSet("local", STATE_KEY, JSON.stringify(data));
  }, [members, today]);

  // Keep "sent 2m ago" labels fresh.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => setPage(1), [query, status, plan, sort]);

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = idRef.current++;
    setToasts((ts) => [...ts, { ...t, id }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 4800);
  }, []);

  const addLog = useCallback((text: string, icon: LogItem["icon"]) => {
    const id = idRef.current++;
    setLog((l) => [{ id, at: Date.now(), text, icon }, ...l].slice(0, 8));
  }, []);

  /* ---------- derived numbers (all live) */
  const withStatus = useMemo(
    () => members.map((m) => ({ ...m, status: statusOf(m, today), days: daysLeft(m.expiryDate, today) })),
    [members, today],
  );

  const kpis = useMemo(() => {
    const active = withStatus.filter((m) => m.status !== "Expired").length;
    const expiring = withStatus.filter((m) => m.status === "Expiring Soon").length;
    const present = withStatus.filter((m) => m.presentToday).length;
    return { active, expiring, present };
  }, [withStatus]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = withStatus.filter(
      (m) =>
        (status === "All" || m.status === status) &&
        (plan === "All" || m.plan === plan) &&
        (!q || m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.phone.replace(/\s/g, "").includes(q.replace(/\s/g, ""))),
    );
    // "Expiry" sort surfaces what needs action first: expiring → active → expired.
    const rank: Record<MemberStatus, number> = { "Expiring Soon": 0, Active: 1, Expired: 2 };
    rows.sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "join"
          ? b.joinDate.localeCompare(a.joinDate)
          : rank[a.status] - rank[b.status] || (a.status === "Expired" ? b.days - a.days : a.days - b.days),
    );
    return rows;
  }, [withStatus, query, status, plan, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const expiringList = useMemo(
    () => withStatus.filter((m) => m.status === "Expiring Soon").sort((a, b) => a.days - b.days),
    [withStatus],
  );

  /* ---------- actions */
  const toggleAttendance = (id: string) => {
    const m = members.find((x) => x.id === id);
    if (!m) return;
    const next = !m.presentToday;
    setMembers((ms) => ms.map((x) => (x.id === id ? { ...x, presentToday: next } : x)));
    addLog(`${m.name} ${next ? "checked in" : "check-in undone"}`, next ? "check" : "undo");
    pushToast({ tone: next ? "success" : "info", title: next ? `${m.name} marked present` : `Attendance removed for ${m.name}` });
  };

  const sendReminder = async (ids: string[]) => {
    const targets = members.filter((m) => ids.includes(m.id));
    if (!targets.length) return;
    setSending((s) => new Set([...s, ...ids]));
    // Simulated gateway latency (WhatsApp Business API / SMS / SMTP in production).
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 500));
    const at = Date.now();
    setMembers((ms) => ms.map((m) => (ids.includes(m.id) ? { ...m, lastReminder: { channel, at } } : m)));
    setSending((s) => {
      const n = new Set(s);
      ids.forEach((i) => n.delete(i));
      return n;
    });
    if (targets.length === 1) {
      const t = targets[0];
      addLog(`${channel} reminder sent to ${t.name}`, "send");
      pushToast({
        tone: "success",
        title: `${channel} sent to ${t.name}`,
        body: reminderMessage(t, channel, today).split("\n").pop(),
      });
    } else {
      addLog(`${channel} reminders sent to ${targets.length} members`, "send");
      pushToast({ tone: "success", title: `${targets.length} ${channel} reminders delivered`, body: "All expiring members have been notified." });
    }
  };

  const resetDemo = () => {
    safeSet("local", STATE_KEY, null);
    setMembers(generateMembers(today));
    setLog([]);
    pushToast({ tone: "info", title: "Demo data reset" });
  };

  const week = useMemo(() => [...pastWeekAttendance(today), { date: today, count: kpis.present }], [today, kpis.present]);

  return (
    <div className="flex min-h-dvh">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-ink-2 p-5 lg:flex">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark className="h-9 w-9" />
          <span className="font-display text-xl font-extrabold uppercase italic text-white">
            V <span className="text-brand">Fitness</span>
          </span>
        </Link>
        <p className="mt-1 pl-[46px] text-[11px] uppercase tracking-widest text-slate-600">Staff portal</p>
        <nav aria-label="Dashboard" className="mt-8 space-y-1 text-sm">
          {[
            { icon: LayoutDashboard, label: "Overview", href: "#overview", active: true },
            { icon: Users, label: "Members", href: "#members" },
            { icon: CalendarClock, label: "Renewals", href: "#renewals" },
            { icon: BarChart3, label: "Attendance", href: "#attendance" },
          ].map(({ icon: Icon, label, href, active }) => (
            <a key={label} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${active ? "bg-brand/10 text-white ring-1 ring-brand/30" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
              <Icon className={`h-4 w-4 ${active ? "text-brand" : ""}`} aria-hidden /> {label}
            </a>
          ))}
          <span className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-slate-600" title="Not part of the demo">
            <Settings className="h-4 w-4" aria-hidden /> Settings
          </span>
        </nav>
        <div className="mt-auto space-y-3">
          <div className="rounded-2xl border border-line bg-ink p-4 text-xs text-slate-400">
            <p className="font-semibold text-white">Demo mode</p>
            <p className="mt-1">Changes are saved in this browser for today only.</p>
            <button onClick={resetDemo} className="mt-3 inline-flex items-center gap-1.5 text-brand hover:underline">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset demo data
            </button>
          </div>
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
            <LogOut className="h-4 w-4" aria-hidden /> Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-line bg-ink/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Link href="/" className="lg:hidden" aria-label="V Fitness home">
              <LogoMark className="h-8 w-8" />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-extrabold uppercase italic leading-none sm:text-3xl">Dashboard</h1>
              <p className="truncate text-xs text-slate-500">
                {new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(today)}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 sm:inline-flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live demo
              </span>
              <button className="relative grid h-10 w-10 place-items-center rounded-full border border-line text-slate-400 hover:text-white" aria-label={`${kpis.expiring} memberships expiring`}>
                <Bell className="h-4 w-4" />
                {kpis.expiring > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose px-1 text-[10px] font-bold text-white">{kpis.expiring}</span>}
              </button>
              <div className="hidden items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 sm:flex">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand to-rose text-xs font-bold text-ink">AD</span>
                <span className="text-xs text-slate-300">{DEMO_CREDENTIALS.email}</span>
              </div>
              <button onClick={onLogout} className="grid h-10 w-10 place-items-center rounded-full border border-line text-slate-400 hover:text-white lg:hidden" aria-label="Log out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-6 p-4 sm:p-6">
          {/* KPI cards */}
          <section id="overview" aria-label="Key metrics" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <StatCard icon={Users} label="Total Active Members" value={kpis.active.toLocaleString()} hint="Incl. expiring this week" tone="brand" i={0} />
            <StatCard icon={UserCheck} label="Today's Attendance" value={kpis.present.toLocaleString()} hint={`${Math.round((kpis.present / Math.max(1, kpis.active)) * 100)}% of active members`} tone="emerald" i={1} />
            <StatCard icon={AlertTriangle} label="Expiring Memberships" value={kpis.expiring.toLocaleString()} hint="Within the next 7 days" tone="rose" i={2} />
            <StatCard icon={CircleDollarSign} label="Monthly Revenue" value={usd.format(DEMO_KPIS.monthlyRevenue)} hint={`▲ ${DEMO_KPIS.revenueChangePct}% vs last month`} tone="amber" i={3} />
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
            {/* Attendance chart */}
            <section id="attendance" aria-labelledby="att-title" className="card min-w-0 scroll-mt-20 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 id="att-title" className="text-2xl font-bold uppercase">Weekly attendance</h2>
                  <p className="text-xs text-slate-500">Today updates live as you mark check-ins</p>
                </div>
                <CalendarCheck className="h-5 w-5 text-brand" aria-hidden />
              </div>
              <AttendanceChart data={week} />
            </section>

            {/* Expiring panel */}
            <section id="renewals" aria-labelledby="exp-title" className="card min-w-0 scroll-mt-20 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 id="exp-title" className="text-2xl font-bold uppercase">Expiring this week</h2>
                  <p className="text-xs text-slate-500">Send renewal reminders before memberships lapse</p>
                </div>
                <button
                  onClick={() => sendReminder(expiringList.map((m) => m.id))}
                  disabled={!expiringList.length || expiringList.some((m) => sending.has(m.id))}
                  className="btn-primary shrink-0 !px-3.5 !py-2 text-xs disabled:opacity-60"
                >
                  {expiringList.some((m) => sending.has(m.id)) ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Send className="h-3.5 w-3.5" aria-hidden />}
                  Remind all
                </button>
              </div>
              <ChannelPicker value={channel} onChange={setChannel} className="mt-4 max-w-full" />
              <ul className="mt-4 max-h-[236px] space-y-2 overflow-y-auto pr-1">
                {expiringList.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 rounded-xl border border-line bg-ink/60 px-3 py-2.5">
                    <Avatar name={m.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{m.name}</p>
                      <p className="text-xs text-slate-500">{m.plan}</p>
                    </div>
                    <ExpiryBadge days={m.days} />
                    <ReminderButton member={m} sending={sending.has(m.id)} onSend={() => sendReminder([m.id])} now={now} compact />
                  </li>
                ))}
                {!expiringList.length && <li className="py-8 text-center text-sm text-slate-500">Nothing expiring this week 🎉</li>}
              </ul>
            </section>
          </div>

          {/* Members table */}
          <section id="members" aria-labelledby="members-title" className="card scroll-mt-20 overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-line p-5 sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="members-title" className="text-2xl font-bold uppercase">Member tracking & attendance</h2>
                  <p className="text-xs text-slate-500">
                    {filtered.length} of {members.length} members · reminders send via <span className="text-slate-300">{channel}</span>
                  </p>
                </div>
                <ChannelPicker value={channel} onChange={setChannel} />
              </div>

              {/* Search & filter bar */}
              <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
                <label className="relative block">
                  <span className="sr-only">Search members</span>
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, member ID or phone…" className="field !pl-10" />
                  {query && (
                    <button onClick={() => setQuery("")} className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-slate-500 hover:text-white" aria-label="Clear search">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </label>
                <label className="block">
                  <span className="sr-only">Filter by plan</span>
                  <select value={plan} onChange={(e) => setPlan(e.target.value as PlanFilter)} className="field md:w-48">
                    <option value="All">All plans</option>
                    {PLAN_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="sr-only">Sort</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="field md:w-48">
                    <option value="expiry">Needs attention first</option>
                    <option value="name">Name (A–Z)</option>
                    <option value="join">Join date (newest)</option>
                  </select>
                </label>
              </div>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filter by status">
                {(["All", "Active", "Expiring Soon", "Expired"] as StatusFilter[]).map((s) => {
                  const count = s === "All" ? withStatus.length : withStatus.filter((m) => m.status === s).length;
                  const active = status === s;
                  return (
                    <button
                      key={s}
                      role="radio"
                      aria-checked={active}
                      onClick={() => setStatus(s)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${active ? "border-brand bg-brand/15 text-white" : "border-line text-slate-400 hover:text-white"}`}
                    >
                      {s}
                      <span className={`rounded-full px-1.5 text-xs ${active ? "bg-brand text-ink" : "bg-line text-slate-300"}`}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Members with plan, dates, attendance and actions</caption>
                <thead className="bg-ink-2 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-medium">Member Name</th>
                    <th scope="col" className="px-4 py-3 font-medium">Membership Plan</th>
                    <th scope="col" className="px-4 py-3 font-medium">Join Date</th>
                    <th scope="col" className="px-4 py-3 font-medium">Expiry Date</th>
                    <th scope="col" className="px-4 py-3 font-medium">Attendance Status</th>
                    <th scope="col" className="px-6 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  <AnimatePresence initial={false}>
                    {pageRows.map((m) => (
                      <motion.tr
                        key={m.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`transition-colors hover:bg-white/[0.02] ${m.status === "Expiring Soon" ? (m.days <= 2 ? "bg-rose-500/[0.04]" : "bg-amber-500/[0.03]") : ""}`}
                      >
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar name={m.name} />
                            <div className="min-w-0">
                              <p className="truncate font-medium text-white">{m.name}</p>
                              <p className="text-xs text-slate-500">{m.id} · {m.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5"><PlanChip plan={m.plan} /></td>
                        <td className="px-4 py-3.5 tabular-nums text-slate-400">{fmtDate(m.joinDate)}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col items-start gap-1">
                            <span className="tabular-nums text-slate-300">{fmtDate(m.expiryDate)}</span>
                            <ExpiryBadge days={m.days} />
                          </div>
                        </td>
                        <td className="px-4 py-3.5"><AttendancePill present={m.presentToday} /></td>
                        <td className="px-6 py-3.5">
                          <div className="flex justify-end gap-2">
                            <AttendanceButton member={m} onToggle={() => toggleAttendance(m.id)} />
                            <ReminderButton member={m} sending={sending.has(m.id)} onSend={() => sendReminder([m.id])} now={now} />
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-line md:hidden">
              {pageRows.map((m) => (
                <li key={m.id} className="space-y-3 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-white">{m.name}</p>
                      <p className="text-xs text-slate-500">{m.id} · <PlanChip plan={m.plan} inline /></p>
                    </div>
                    <AttendancePill present={m.presentToday} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span>Joined {fmtDate(m.joinDate)}</span>
                    <span>Expires {fmtDate(m.expiryDate)}</span>
                    <ExpiryBadge days={m.days} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <AttendanceButton member={m} onToggle={() => toggleAttendance(m.id)} full />
                    <ReminderButton member={m} sending={sending.has(m.id)} onSend={() => sendReminder([m.id])} now={now} full />
                  </div>
                </li>
              ))}
            </ul>

            {!pageRows.length && (
              <div className="px-6 py-16 text-center">
                <Search className="mx-auto h-8 w-8 text-slate-600" aria-hidden />
                <p className="mt-3 text-slate-400">No members match these filters.</p>
                <button onClick={() => { setQuery(""); setStatus("All"); setPlan("All"); }} className="mt-3 text-sm text-brand hover:underline">Clear filters</button>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-line px-5 py-4 text-sm text-slate-400 sm:px-6">
              <span>
                Page <span className="text-white">{page}</span> of {pages}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="grid h-9 w-9 place-items-center rounded-full border border-line hover:text-white disabled:opacity-40" aria-label="Previous page">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="grid h-9 w-9 place-items-center rounded-full border border-line hover:text-white disabled:opacity-40" aria-label="Next page">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Activity log */}
          <section aria-labelledby="log-title" className="card p-5 sm:p-6">
            <h2 id="log-title" className="text-2xl font-bold uppercase">Recent activity</h2>
            {log.length ? (
              <ul className="mt-4 space-y-2">
                <AnimatePresence initial={false}>
                  {log.map((l) => (
                    <motion.li key={l.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 text-sm">
                      <span className={`grid h-7 w-7 place-items-center rounded-full ${l.icon === "send" ? "bg-sky-500/15 text-sky-400" : l.icon === "check" ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"}`}>
                        {l.icon === "send" ? <Send className="h-3.5 w-3.5" /> : l.icon === "check" ? <Check className="h-3.5 w-3.5" /> : <RotateCcw className="h-3.5 w-3.5" />}
                      </span>
                      <span className="flex-1 text-slate-300">{l.text}</span>
                      <span className="text-xs text-slate-500">{ago(l.at, now)}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500">Mark attendance or send a reminder — actions will appear here.</p>
            )}
            <button onClick={resetDemo} className="mt-5 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand lg:hidden">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset demo data
            </button>
          </section>
        </div>
      </div>

      {/* Toasts */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              className="pointer-events-auto rounded-2xl border border-line bg-ink-3/95 p-4 shadow-2xl backdrop-blur"
            >
              <div className="flex gap-3">
                <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${t.tone === "success" ? "bg-emerald-500/20 text-emerald-400" : t.tone === "warn" ? "bg-amber-500/20 text-amber-400" : "bg-sky-500/20 text-sky-400"}`}>
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">{t.title}</p>
                  {t.body && <p className="mt-1 line-clamp-3 text-xs text-slate-400">{t.body}</p>}
                </div>
                <button onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))} className="text-slate-500 hover:text-white" aria-label="Dismiss">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================== Small pieces */

const TONES = {
  brand: "from-brand/20 text-brand",
  emerald: "from-emerald-500/20 text-emerald-400",
  rose: "from-rose-500/20 text-rose-400",
  amber: "from-amber-400/20 text-amber-400",
} as const;

function StatCard({
  icon: Icon, label, value, hint, tone, i,
}: { icon: typeof Users; label: string; value: string; hint: string; tone: keyof typeof TONES; i: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06 }}
      whileHover={{ y: -3 }}
      className="card relative overflow-hidden p-4 sm:p-5"
    >
      <div aria-hidden className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${TONES[tone].split(" ")[0]} to-transparent blur-xl`} />
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-sans text-xs font-medium uppercase tracking-wider text-slate-400">{label}</h3>
        <Icon className={`h-5 w-5 shrink-0 ${TONES[tone].split(" ")[1]}`} aria-hidden />
      </div>
      <motion.p key={value} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 font-display text-4xl font-extrabold tabular-nums text-white sm:text-5xl">
        {value}
      </motion.p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </motion.article>
  );
}

function AttendanceChart({ data }: { data: { date: Date; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const day = new Intl.DateTimeFormat("en-GB", { weekday: "short" });
  return (
    <div className="mt-6 flex h-52 items-end gap-2 sm:gap-3" role="img" aria-label={`Attendance over the last 7 days: ${data.map((d) => `${day.format(d.date)} ${d.count}`).join(", ")}`}>
      {data.map((d, i) => {
        const today = i === data.length - 1;
        return (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className={`text-xs tabular-nums ${today ? "font-semibold text-white" : "text-slate-500"}`}>{d.count}</span>
            <motion.div
              className={`w-full rounded-t-lg ${today ? "bg-gradient-to-t from-brand to-brand-2" : "bg-line"}`}
              initial={{ height: 0 }}
              animate={{ height: `${(d.count / max) * 78}%` }}
              transition={{ type: "spring", stiffness: 160, damping: 22, delay: i * 0.03 }}
            />
            <span className={`text-[11px] uppercase ${today ? "text-brand" : "text-slate-500"}`}>{today ? "Today" : day.format(d.date)}</span>
          </div>
        );
      })}
    </div>
  );
}

function ChannelPicker({ value, onChange, className = "" }: { value: Channel; onChange: (c: Channel) => void; className?: string }) {
  const items: { c: Channel; icon: typeof Mail }[] = [
    { c: "WhatsApp", icon: MessageCircle },
    { c: "SMS", icon: MessageSquare },
    { c: "Email", icon: Mail },
  ];
  return (
    <div role="radiogroup" aria-label="Reminder channel" className={`inline-flex rounded-full border border-line bg-ink p-1 ${className}`}>
      {items.map(({ c, icon: Icon }) => (
        <button
          key={c}
          role="radio"
          aria-checked={value === c}
          onClick={() => onChange(c)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${value === c ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden /> {c}
        </button>
      ))}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white" style={{ background: `hsl(${hue} 45% 28%)` }} aria-hidden>
      {initials}
    </span>
  );
}

function PlanChip({ plan, inline }: { plan: PlanType; inline?: boolean }) {
  const color =
    plan === "Annual" ? "text-violet-300 bg-violet-500/10" : plan === "Quarterly" ? "text-sky-300 bg-sky-500/10" : plan === "Personal Training" ? "text-orange-300 bg-orange-500/10" : "text-slate-300 bg-white/5";
  if (inline) return <span className={color.split(" ")[0]}>{plan}</span>;
  return <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>{plan}</span>;
}

function ExpiryBadge({ days }: { days: number }) {
  if (days < 0)
    return <span className="inline-flex rounded-full bg-slate-500/15 px-2 py-0.5 text-[11px] font-medium text-slate-400">Expired {Math.abs(days)}d ago</span>;
  if (days < 7) {
    const red = days <= 2;
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${red ? "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30" : "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30"}`}>
        <AlertTriangle className="h-3 w-3" aria-hidden />
        {days === 0 ? "Expires today" : `${days} day${days === 1 ? "" : "s"} left`}
      </span>
    );
  }
  return <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">{days}d left</span>;
}

function AttendancePill({ present }: { present: boolean }) {
  return present ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Present
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-500">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-600" /> Not checked in
    </span>
  );
}

function AttendanceButton({ member, onToggle, full }: { member: Member & { status: MemberStatus }; onToggle: () => void; full?: boolean }) {
  const expired = member.status === "Expired";
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      disabled={expired && !member.presentToday}
      title={expired ? "Membership expired — renew before check-in" : undefined}
      className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        member.presentToday ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25" : "border-line text-slate-300 hover:border-brand hover:text-white"
      } ${full ? "w-full" : ""}`}
      aria-pressed={member.presentToday}
    >
      {member.presentToday ? <Check className="h-3.5 w-3.5" aria-hidden /> : <CalendarCheck className="h-3.5 w-3.5" aria-hidden />}
      {member.presentToday ? "Present today" : "Mark Today's Attendance"}
    </motion.button>
  );
}

function ReminderButton({
  member, sending, onSend, now, compact, full,
}: { member: Member; sending: boolean; onSend: () => void; now: number; compact?: boolean; full?: boolean }) {
  const sent = member.lastReminder;
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onSend}
      disabled={sending}
      className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-70 ${
        sent ? "border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20" : "border-brand/50 bg-brand/10 text-orange-200 hover:bg-brand/20"
      } ${full ? "w-full" : ""}`}
      title={sent ? `Last sent via ${sent.channel} ${ago(sent.at, now)} — click to resend` : "Send renewal reminder"}
    >
      {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : sent ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Send className="h-3.5 w-3.5" aria-hidden />}
      {sending ? "Sending…" : sent ? (compact ? "Sent" : `Sent ${ago(sent.at, now)}`) : compact ? "Remind" : "Send Renewal Reminder"}
    </motion.button>
  );
}

function ago(at: number, now: number) {
  const s = Math.max(0, Math.round((now - at) / 1000));
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.round(m / 60)}h ago`;
}
