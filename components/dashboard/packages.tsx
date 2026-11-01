"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Dumbbell, Layers, Plus, RefreshCw, Users } from "lucide-react";

import { useStore } from "./store";
import { Avatar, Btn, Donut, Kpi, Legend, Panel, Pill, Progress, RemindButton, aed, ago, fmtDate } from "./ui";
import { PLAN_OPTIONS, daysLeft, statusOf, type PackageKind } from "@/lib/demo-data";

type F = "All" | PackageKind | "Ending soon" | "Completed";

export function Packages() {
  const { data, today, logSession, renewPackage } = useStore();
  const [f, setF] = useState<F>("All");
  const [trainer, setTrainer] = useState("All");

  const memberById = useMemo(() => new Map(data.members.map((m) => [m.id, m])), [data.members]);
  const rows = useMemo(() => {
    return data.packages
      .map((p) => ({ p, left: p.total - p.used, d: daysLeft(p.expiry, today) }))
      .filter(({ p, left, d }) =>
        (trainer === "All" || p.trainer === trainer) &&
        (f === "All" ? true : f === "Ending soon" ? left > 0 && (left <= 2 || d <= 7) : f === "Completed" ? left === 0 : p.kind === f),
      )
      .sort((a, b) => (a.left === 0 ? 1 : 0) - (b.left === 0 ? 1 : 0) || a.left - b.left);
  }, [data.packages, f, trainer, today]);

  const active = data.packages.filter((p) => p.used < p.total);
  const sessionsLeft = active.reduce((s, p) => s + p.total - p.used, 0);
  const weekAgo = Date.now() - 7 * 86_400_000;
  const recent = data.packages.filter((p) => p.lastSessionAt && p.lastSessionAt > weekAgo).length;
  const ending = data.packages.filter((p) => p.used < p.total && (p.total - p.used <= 2 || daysLeft(p.expiry, today) <= 7)).length;
  const trainers = ["All", ...Array.from(new Set(data.packages.map((p) => p.trainer)))];

  const planMix = PLAN_OPTIONS.map((plan, i) => ({
    label: plan,
    value: data.members.filter((m) => m.plan === plan && statusOf(m, today) !== "Expired").length,
    color: ["#00d4dc", "#1d6fe0", "#a78bfa", "#f5b84b"][i],
  }));

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Package metrics">
        <Kpi icon={Layers} label="Active packages" value={String(active.length)} hint={aed(active.reduce((s, p) => s + p.price, 0)) + " sold value"} />
        <Kpi icon={Dumbbell} label="Sessions remaining" value={String(sessionsLeft)} tone="violet" />
        <Kpi icon={Users} label="Trained in last 7 days" value={String(recent)} tone="emerald" />
        <Kpi icon={CalendarClock} label="Ending soon" value={String(ending)} hint="≤ 2 sessions or ≤ 7 days" tone="rose" />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <Panel
          title="Package tracker"
          sub="PT and class-pack sessions by member"
          action={
            <select aria-label="Trainer" value={trainer} onChange={(e) => setTrainer(e.target.value)} className="field !w-44 !py-2 text-xs">
              {trainers.map((t) => <option key={t}>{t}</option>)}
            </select>
          }
        >
          <div className="mb-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Filter packages">
            {(["All", "Personal Training", "Class Pack", "Ending soon", "Completed"] as F[]).map((x) => (
              <button key={x} role="radio" aria-checked={f === x} onClick={() => setF(x)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${f === x ? "bg-brand text-black" : "border border-white/10 text-white/60 hover:text-white"}`}>
                {x}
              </button>
            ))}
          </div>
          <ul className="grid gap-3 md:grid-cols-2">
            {rows.map(({ p, left, d }) => {
              const m = memberById.get(p.memberId);
              if (!m) return null;
              return (
                <li key={p.id} className="rounded-xl border border-white/[0.08] bg-black p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{m.name}</p>
                      <p className="text-xs text-white/45">{p.name} · {p.trainer}</p>
                    </div>
                    {left === 0 ? <Pill>Completed</Pill> : left <= 2 ? <Pill tone="amber">{left} left</Pill> : <Pill tone="brand">{left} left</Pill>}
                  </div>
                  <div className="mt-3"><Progress value={p.used} max={p.total} tone={left === 0 ? "rose" : left <= 2 ? "amber" : "brand"} /></div>
                  <div className="mt-2 flex justify-between text-[11px] text-white/45">
                    <span>{p.used}/{p.total} sessions used</span>
                    <span className={d <= 7 ? "text-amber-200" : ""}>{d < 0 ? `Expired ${fmtDate(p.expiry)}` : `Valid until ${fmtDate(p.expiry)}`}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {left > 0 ? (
                      <Btn tone="primary" onClick={() => logSession(p.id)}><Plus className="h-3.5 w-3.5" aria-hidden /> Log session</Btn>
                    ) : (
                      <Btn tone="primary" onClick={() => renewPackage(p.id)}><RefreshCw className="h-3.5 w-3.5" aria-hidden /> Renew {aed(p.price)}</Btn>
                    )}
                    {left > 0 && left <= 2 && <RemindButton member={m} label="Remind to renew" />}
                    <span className="ml-auto text-[11px] text-white/35">{p.lastSessionAt ? `Last: ${ago(p.lastSessionAt)}` : "Not started"}</span>
                  </div>
                </li>
              );
            })}
          </ul>
          {!rows.length && <p className="py-10 text-center text-sm text-white/45">No packages in this view.</p>}
        </Panel>

        <div className="space-y-5">
          <Panel title="Membership plan mix" sub="Active members by plan">
            <div className="flex flex-col items-center gap-4 sm:flex-row xl:flex-col 2xl:flex-row">
              <Donut parts={planMix} center={{ value: String(planMix.reduce((s, p) => s + p.value, 0)), label: "active" }} />
              <Legend items={planMix.map((p) => ({ label: p.label, color: p.color, value: String(p.value) }))} />
            </div>
          </Panel>
          <Panel title="Trainer load" sub="Remaining PT sessions per coach">
            <ul className="space-y-3">
              {trainers.filter((t) => t !== "All" && t !== "Group classes").map((t) => {
                const left = data.packages.filter((p) => p.trainer === t).reduce((s, p) => s + p.total - p.used, 0);
                return (
                  <li key={t}>
                    <div className="mb-1 flex justify-between text-sm"><span className="text-white/80">{t}</span><span className="tabular-nums text-white/55">{left} sessions</span></div>
                    <Progress value={left} max={120} />
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
