"use client";

import { useMemo } from "react";
import { Activity, HeartHandshake, Repeat, TrendingDown, UserPlus, Wallet } from "lucide-react";

import { useStore } from "./store";
import { Avatar, BarChart, Btn, Donut, Kpi, Legend, LineChart, Panel, RemindButton, aed } from "./ui";
import { daysSinceVisit, isAtRisk, monthlySeries, peakGrid, statusOf, visitsInLast } from "@/lib/demo-data";

export function Analytics() {
  const { data, today, sendReminder, sending } = useStore();

  const a = useMemo(() => {
    const series = monthlySeries(data, today);
    const active = data.members.filter((m) => statusOf(m, today) !== "Expired");
    const last = series[series.length - 1], prev = series[series.length - 2];
    const churnRate = (last.churn / Math.max(1, prev.active)) * 100;
    const avgVisits = active.reduce((s, m) => s + visitsInLast(m, 28), 0) / Math.max(1, active.length) / 4;
    const revenue = last.membership + last.pt + last.shop;
    const arpm = revenue / Math.max(1, active.length);
    const atRisk = active.filter((m) => isAtRisk(m, today)).sort((x, y) => daysSinceVisit(y) - daysSinceVisit(x));
    const gender = { M: active.filter((m) => m.gender === "M").length, F: active.filter((m) => m.gender === "F").length };
    const ages = [["18–24", 18, 24], ["25–34", 25, 34], ["35–44", 35, 44], ["45+", 45, 99]].map(([l, lo, hi]) => ({ label: l as string, count: active.filter((m) => m.age >= (lo as number) && m.age <= (hi as number)).length }));
    const goals = new Map<string, number>();
    active.forEach((m) => goals.set(m.goal, (goals.get(m.goal) || 0) + 1));
    const prodQty = new Map<string, number>();
    const prodRev = new Map<string, number>();
    data.orders.forEach((o) => o.items.forEach((it) => { prodQty.set(it.productId, (prodQty.get(it.productId) || 0) + it.qty); prodRev.set(it.productId, (prodRev.get(it.productId) || 0) + it.qty * it.price); }));
    const topProducts = [...prodRev].sort((x, y) => y[1] - x[1]).slice(0, 6).map(([id, rev]) => ({ name: data.products.find((p) => p.id === id)?.name ?? id, rev, qty: prodQty.get(id) || 0 }));
    const frequency = [
      { label: "0", count: active.filter((m) => visitsInLast(m, 28) === 0).length },
      { label: "1–4", count: active.filter((m) => { const v = visitsInLast(m, 28); return v >= 1 && v <= 4; }).length },
      { label: "5–8", count: active.filter((m) => { const v = visitsInLast(m, 28); return v >= 5 && v <= 8; }).length },
      { label: "9–12", count: active.filter((m) => { const v = visitsInLast(m, 28); return v >= 9 && v <= 12; }).length },
      { label: "13+", count: active.filter((m) => visitsInLast(m, 28) >= 13).length },
    ];
    return { series, active, last, churnRate, avgVisits, revenue, arpm, atRisk, gender, ages, goals: [...goals].sort((x, y) => y[1] - x[1]), topProducts, frequency };
  }, [data, today]);

  const grid = useMemo(() => peakGrid(), []);
  const gmax = Math.max(...grid.flatMap((g) => g.values));
  const revParts = [
    { label: "Membership", value: a.last.membership, color: "#00d4dc" },
    { label: "Personal training", value: a.last.pt, color: "#1d6fe0" },
    { label: "Protein bar & shop", value: a.last.shop, color: "#f5b84b" },
  ];
  const topMax = Math.max(...a.topProducts.map((t) => t.rev), 1);

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6" aria-label="Customer metrics">
        <Kpi icon={UserPlus} label="New members this month" value={String(a.last.joins)} tone="emerald" />
        <Kpi icon={TrendingDown} label="Monthly churn" value={`${a.churnRate.toFixed(1)}%`} hint={`${a.last.churn} left this month`} tone="rose" />
        <Kpi icon={Repeat} label="Retention (3 months)" value={`${(100 - a.churnRate * 3).toFixed(0)}%`} tone="sky" />
        <Kpi icon={Activity} label="Avg visits / week" value={a.avgVisits.toFixed(1)} hint="Active members, last 4 weeks" />
        <Kpi icon={Wallet} label="Revenue / member" value={aed(a.arpm)} hint="This month" tone="amber" />
        <Kpi icon={HeartHandshake} label="At-risk members" value={String(a.atRisk.length)} hint="No visit in 14+ days" tone="violet" />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Active members — last 12 months" sub="Month-end active memberships">
          <LineChart values={a.series.map((s) => s.active)} labels={a.series.map((s) => s.label)} height={210} />
        </Panel>
        <Panel title="Joins vs. cancellations" sub="Members per month">
          <BarChart data={a.series.slice(-6).map((s) => ({ label: s.label, joins: s.joins, churn: s.churn }))} keys={["joins", "churn"]} colors={["#00d4dc", "#f43f5e"]} height={170} />
          <div className="mt-3"><Legend items={[{ label: "Joined", color: "#00d4dc" }, { label: "Cancelled / lapsed", color: "#f43f5e" }]} /></div>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Revenue mix this month" sub={aed(a.revenue)}>
          <div className="flex flex-col items-center gap-4">
            <Donut parts={revParts} center={{ value: `${Math.round((a.last.membership / a.revenue) * 100)}%`, label: "membership" }} />
            <Legend items={revParts.map((p) => ({ label: p.label, color: p.color, value: aed(p.value) }))} />
          </div>
        </Panel>
        <Panel title="Visit frequency" sub="Active members by visits in the last 4 weeks">
          <BarChart data={a.frequency.map((f) => ({ label: f.label, count: f.count }))} keys={["count"]} colors={["#1d6fe0"]} height={180} />
        </Panel>
        <Panel title="Who trains here" sub="Active members">
          <div className="flex items-center gap-4">
            <Donut size={110} parts={[{ label: "Male", value: a.gender.M, color: "#00d4dc" }, { label: "Female", value: a.gender.F, color: "#a78bfa" }]} center={{ value: `${Math.round((a.gender.F / Math.max(1, a.gender.M + a.gender.F)) * 100)}%`, label: "female" }} />
            <ul className="flex-1 space-y-2 text-sm">
              {a.ages.map((g) => (
                <li key={g.label} className="flex items-center gap-2">
                  <span className="w-12 text-white/55">{g.label}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.07]"><span className="block h-full rounded-full bg-brand" style={{ width: `${(g.count / Math.max(1, a.active.length)) * 100}%` }} /></span>
                  <span className="w-8 text-right tabular-nums text-white/70">{g.count}</span>
                </li>
              ))}
            </ul>
          </div>
          <h3 className="mb-2 mt-5 text-xs font-medium text-white/55">Top goals</h3>
          <div className="flex flex-wrap gap-1.5">
            {a.goals.slice(0, 5).map(([g, n]) => (
              <span key={g} className="rounded-md border border-white/10 px-2 py-1 text-xs text-white/75">{g} <span className="text-white/40">{n}</span></span>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Peak hours" sub="Typical check-ins by weekday and hour">
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full min-w-[560px] border-separate border-spacing-1 text-[10px]">
              <thead>
                <tr>
                  <th className="w-8" />
                  {grid[0].values.map((_, i) => {
                    const h = i + 6;
                    return <th key={i} className="font-normal text-white/35">{i % 2 === 0 ? `${((h + 11) % 12) + 1}${h < 12 ? "a" : "p"}` : ""}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {grid.map((row) => (
                  <tr key={row.day}>
                    <th scope="row" className="pr-1 text-left font-normal text-white/45">{row.day}</th>
                    {row.values.map((v, i) => (
                      <td key={i} title={`${row.day} ${i + 6}:00 — ${v} check-ins`} className="h-6 rounded" style={{ background: `rgba(0, 212, 220, ${0.06 + (v / gmax) * 0.9})` }} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-white/45">Busiest: weekday evenings 6–9 PM. Quietest: weekday afternoons — a good slot for off-peak offers.</p>
        </Panel>

        <Panel title="Top products (30 days)" sub="Protein bar & pro shop revenue">
          <ul className="space-y-3">
            {a.topProducts.map((t) => (
              <li key={t.name}>
                <div className="mb-1 flex justify-between text-sm"><span className="truncate text-white/80">{t.name}</span><span className="tabular-nums text-white/60">{aed(t.rev)}</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-amber-300" style={{ width: `${(t.rev / topMax) * 100}%` }} /></div>
                <p className="mt-0.5 text-[11px] text-white/35">{t.qty} sold</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title="At-risk members"
        sub="Active plan, but no visit in 14+ days — send a win-back message before they cancel"
        action={
          <Btn tone="primary" disabled={!a.atRisk.length || a.atRisk.some((m) => sending.has(m.id))} onClick={() => sendReminder(a.atRisk.map((m) => m.id), "winback")}>
            Send win-back to all ({a.atRisk.length})
          </Btn>
        }
      >
        <ul className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {a.atRisk.slice(0, 12).map((m) => (
            <li key={m.id} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black px-3 py-2.5">
              <Avatar name={m.name} size={8} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{m.name}</p>
                <p className="text-xs text-white/45">{m.plan} · last visit {daysSinceVisit(m) >= 99 ? "8+ weeks" : `${daysSinceVisit(m)}d`} ago</p>
              </div>
              <RemindButton member={m} label="Win back" kind="winback" />
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
