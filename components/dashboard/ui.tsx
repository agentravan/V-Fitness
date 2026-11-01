"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Check, Loader2, Mail, MessageCircle, MessageSquare, Send, X, type LucideIcon } from "lucide-react";

import { useStore } from "./store";
import type { Channel, Member } from "@/lib/demo-data";

export const aed = (n: number) => `AED ${Math.round(n).toLocaleString("en-US")}`;
const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });
export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return dateFmt.format(new Date(y, m - 1, d));
};
export const ago = (at: number, now = Date.now()) => {
  const s = Math.max(0, Math.round((now - at) / 1000));
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
};

export function Panel({ title, sub, action, children, className = "", id }: { title?: string; sub?: string; action?: React.ReactNode; children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`min-w-0 rounded-2xl border border-white/[0.08] bg-[#0c0c0d] ${className}`}>
      {(title || action) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
          <div>
            {title && <h2 className="text-base font-semibold tracking-tight">{title}</h2>}
            {sub && <p className="mt-0.5 text-xs text-white/45">{sub}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Kpi({ icon: Icon, label, value, hint, tone = "brand", i = 0 }: { icon: LucideIcon; label: string; value: string; hint?: string; tone?: "brand" | "emerald" | "rose" | "amber" | "sky" | "violet"; i?: number }) {
  const tones = {
    brand: "text-brand bg-brand/10",
    emerald: "text-emerald-400 bg-emerald-400/10",
    rose: "text-rose-400 bg-rose-400/10",
    amber: "text-amber-300 bg-amber-300/10",
    sky: "text-sky-400 bg-sky-400/10",
    violet: "text-violet-300 bg-violet-300/10",
  } as const;
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04 }}
      className="rounded-2xl border border-white/[0.08] bg-[#0c0c0d] p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-medium text-white/55">{label}</h3>
        <span className={`grid h-8 w-8 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <motion.p key={value} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="mt-2 text-[1.7rem] font-semibold tabular-nums tracking-tight text-white">
        {value}
      </motion.p>
      {hint && <p className="mt-0.5 text-xs text-white/45">{hint}</p>}
    </motion.article>
  );
}

export function Avatar({ name, size = 9 }: { name: string; size?: 8 | 9 | 12 | 16 }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const cls = { 8: "h-8 w-8 text-[11px]", 9: "h-9 w-9 text-xs", 12: "h-12 w-12 text-sm", 16: "h-16 w-16 text-lg" }[size];
  return (
    <span className={`grid shrink-0 place-items-center rounded-full font-semibold text-white ${cls}`} style={{ background: `hsl(${hue} 40% 26%)` }} aria-hidden>
      {initials}
    </span>
  );
}

export function Pill({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "brand" | "emerald" | "rose" | "amber" | "sky" | "violet" }) {
  const t = {
    slate: "bg-white/[0.06] text-white/70",
    brand: "bg-brand/12 text-brand",
    emerald: "bg-emerald-400/12 text-emerald-300",
    rose: "bg-rose-500/15 text-rose-300",
    amber: "bg-amber-400/15 text-amber-200",
    sky: "bg-sky-400/12 text-sky-300",
    violet: "bg-violet-400/12 text-violet-200",
  }[tone];
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${t}`}>{children}</span>;
}

export function ExpiryBadge({ days }: { days: number }) {
  if (days < 0) return <Pill>Expired {Math.abs(days)}d ago</Pill>;
  if (days < 7)
    return (
      <Pill tone={days <= 2 ? "rose" : "amber"}>
        <AlertTriangle className="h-3 w-3" aria-hidden />
        {days === 0 ? "Expires today" : `${days} day${days === 1 ? "" : "s"} left`}
      </Pill>
    );
  return <Pill tone="emerald">{days}d left</Pill>;
}

export function Progress({ value, max, tone = "brand" }: { value: number; max: number; tone?: "brand" | "amber" | "rose" }) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  const c = tone === "rose" ? "bg-rose-400" : tone === "amber" ? "bg-amber-300" : "bg-brand";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]" role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <motion.div className={`h-full rounded-full ${c}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
    </div>
  );
}

export function ChannelPicker({ className = "" }: { className?: string }) {
  const { channel, setChannel } = useStore();
  const items: { c: Channel; icon: LucideIcon }[] = [
    { c: "WhatsApp", icon: MessageCircle },
    { c: "SMS", icon: MessageSquare },
    { c: "Email", icon: Mail },
  ];
  return (
    <div role="radiogroup" aria-label="Reminder channel" className={`inline-flex rounded-lg border border-white/10 bg-black p-0.5 ${className}`}>
      {items.map(({ c, icon: Icon }) => (
        <button
          key={c}
          role="radio"
          aria-checked={channel === c}
          onClick={() => setChannel(c)}
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${channel === c ? "bg-white/10 text-white" : "text-white/45 hover:text-white"}`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden /> {c}
        </button>
      ))}
    </div>
  );
}

export function RemindButton({ member, label = "Remind", kind = "renewal" }: { member: Member; label?: string; kind?: "renewal" | "winback" }) {
  const { sending, sendReminder } = useStore();
  const busy = sending.has(member.id);
  const sent = member.lastReminder;
  return (
    <button
      onClick={() => sendReminder([member.id], kind)}
      disabled={busy}
      title={sent ? `Last sent via ${sent.channel} ${ago(sent.at)}` : undefined}
      className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
        sent ? "border-sky-400/30 bg-sky-400/10 text-sky-200 hover:bg-sky-400/20" : "border-brand/40 bg-brand/10 text-brand hover:bg-brand/20"
      }`}
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : sent ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Send className="h-3.5 w-3.5" aria-hidden />}
      {busy ? "Sending…" : sent ? `Sent ${ago(sent.at)}` : label}
    </button>
  );
}

export function Btn({ children, onClick, tone = "ghost", disabled, className = "", type = "button", title }: { children: React.ReactNode; onClick?: () => void; tone?: "ghost" | "primary" | "danger"; disabled?: boolean; className?: string; type?: "button" | "submit"; title?: string }) {
  const t = {
    ghost: "border border-white/10 bg-white/[0.03] text-white/85 hover:border-white/25 hover:text-white",
    primary: "bg-brand text-black hover:bg-brand-2",
    danger: "border border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20",
  }[tone];
  return (
    <button type={type} onClick={onClick} disabled={disabled} title={title} className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${t} ${className}`}>
      {children}
    </button>
  );
}

export function Toasts() {
  const { toasts, dismiss } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          layout
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="pointer-events-auto rounded-xl border border-white/10 bg-[#141416]/95 p-4 shadow-2xl backdrop-blur"
        >
          <div className="flex gap-3">
            <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${t.tone === "success" ? "bg-emerald-400/20 text-emerald-300" : t.tone === "warn" ? "bg-amber-400/20 text-amber-300" : "bg-brand/20 text-brand"}`}>
              <Check className="h-3.5 w-3.5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">{t.title}</p>
              {t.body && <p className="mt-1 line-clamp-3 text-xs text-white/55">{t.body}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-white/40 hover:text-white" aria-label="Dismiss">
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------ charts (hand-rolled SVG) */

export function BarChart({
  data, keys, colors, height = 200, format = (v: number) => String(v), highlightLast = false,
}: {
  data: { label: string; [k: string]: number | string }[];
  keys: string[];
  colors: string[];
  height?: number;
  format?: (v: number) => string;
  highlightLast?: boolean;
}) {
  const totals = data.map((d) => keys.reduce((s, k) => s + Number(d[k] || 0), 0));
  const max = Math.max(...totals, 1);
  return (
    <div>
      <div className="flex items-end gap-1.5 sm:gap-2" style={{ height }} role="img" aria-label={data.map((d, i) => `${d.label}: ${format(totals[i])}`).join(", ")}>
        {data.map((d, i) => (
          <div key={d.label + i} className="group relative flex h-full flex-1 flex-col justify-end">
            <div className="pointer-events-none absolute -top-1 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-white/10 bg-black px-2 py-1 text-[11px] text-white group-hover:block">
              {d.label}: {format(totals[i])}
            </div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(totals[i] / max) * 100}%` }}
              transition={{ type: "spring", stiffness: 140, damping: 22, delay: i * 0.02 }}
              className={`flex w-full flex-col-reverse overflow-hidden rounded-t-md ${highlightLast && i !== data.length - 1 ? "opacity-60" : ""}`}
            >
              {keys.map((k, ki) => (
                <div key={k} style={{ height: `${(Number(d[k] || 0) / Math.max(1, totals[i])) * 100}%`, background: colors[ki] }} />
              ))}
            </motion.div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5 sm:gap-2">
        {data.map((d, i) => (
          <span key={d.label + i} className="flex-1 truncate text-center text-[10px] text-white/40">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

export function Legend({ items }: { items: { label: string; color: string; value?: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-white/60">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: it.color }} />
          {it.label}
          {it.value && <span className="font-medium text-white/85">{it.value}</span>}
        </li>
      ))}
    </ul>
  );
}

export function LineChart({ values, labels, height = 180, color = "#00d4dc", format = (v: number) => String(v) }: { values: number[]; labels: string[]; height?: number; color?: string; format?: (v: number) => string }) {
  const w = 600, h = height, pad = 24;
  const min = Math.min(...values) * 0.92, max = Math.max(...values) * 1.04;
  const x = (i: number) => pad + (i * (w - pad * 2)) / Math.max(1, values.length - 1);
  const y = (v: number) => h - pad - ((v - min) / Math.max(1, max - min)) * (h - pad * 2);
  const path = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${path} L${x(values.length - 1)},${h - pad} L${x(0)},${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label={labels.map((l, i) => `${l}: ${format(values[i])}`).join(", ")}>
      <defs>
        <linearGradient id="lc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={pad} x2={w - pad} y1={pad + f * (h - pad * 2)} y2={pad + f * (h - pad * 2)} stroke="#ffffff" strokeOpacity="0.06" />
      ))}
      <path d={area} fill="url(#lc-fill)" />
      <motion.path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
      {values.map((v, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(v)} r={i === values.length - 1 ? 5 : 3} fill={i === values.length - 1 ? color : "#0c0c0d"} stroke={color} strokeWidth="2">
            <title>{`${labels[i]}: ${format(v)}`}</title>
          </circle>
          <text x={x(i)} y={h - 6} textAnchor="middle" fontSize="11" fill="#ffffff" fillOpacity="0.4">{labels[i]}</text>
        </g>
      ))}
      <text x={x(values.length - 1)} y={y(values[values.length - 1]) - 12} textAnchor="end" fontSize="13" fontWeight="600" fill="#fff">{format(values[values.length - 1])}</text>
    </svg>
  );
}

export function Donut({ parts, size = 150, center }: { parts: { label: string; value: number; color: string }[]; size?: number; center?: { value: string; label: string } }) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  const r = 52, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 140 140" width={size} height={size} role="img" aria-label={parts.map((p) => `${p.label} ${Math.round((p.value / total) * 100)}%`).join(", ")}>
      <circle cx="70" cy="70" r={r} fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="16" />
      {parts.map((p) => {
        const len = (p.value / total) * c;
        const el = (
          <motion.circle
            key={p.label}
            cx="70" cy="70" r={r} fill="none" stroke={p.color} strokeWidth="16"
            strokeDasharray={`${Math.max(0, len - 2)} ${c}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 70 70)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <title>{`${p.label}: ${Math.round((p.value / total) * 100)}%`}</title>
          </motion.circle>
        );
        offset += len;
        return el;
      })}
      {center && (
        <>
          <text x="70" y="68" textAnchor="middle" fontSize="20" fontWeight="600" fill="#fff">{center.value}</text>
          <text x="70" y="86" textAnchor="middle" fontSize="9.5" fill="#ffffff" fillOpacity="0.5">{center.label}</text>
        </>
      )}
    </svg>
  );
}

/** 8-week visit grid (rows = weeks, oldest top). */
export function VisitGrid({ visits, today }: { visits: string; today: boolean }) {
  const cells = (visits.slice(-55) + (today ? "1" : "0")).split("");
  const weeks: string[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return (
    <div className="grid gap-1" role="img" aria-label={`${cells.filter((c) => c === "1").length} visits in the last 8 weeks`}>
      {weeks.map((w, wi) => (
        <div key={wi} className="flex gap-1">
          {w.map((c, ci) => (
            <span key={ci} className={`h-4 flex-1 rounded-[3px] ${c === "1" ? "bg-brand" : "bg-white/[0.06]"} ${wi === weeks.length - 1 && ci === w.length - 1 ? "ring-1 ring-white/50" : ""}`} />
          ))}
        </div>
      ))}
    </div>
  );
}
