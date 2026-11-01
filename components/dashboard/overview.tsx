"use client";

import { useMemo } from "react";
import {
  AlertTriangle, CircleDollarSign, DoorOpen, LogIn, Package as PackageIcon, ShoppingBag, UserCheck, Users,
} from "lucide-react";

import { useStore } from "./store";
import { Avatar, BarChart, Btn, ChannelPicker, ExpiryBadge, Kpi, Legend, Panel, Pill, RemindButton, aed, ago } from "./ui";
import { daysLeft, fmtMinutes, monthlySeries, statusOf } from "@/lib/demo-data";
import type { Section } from "./shell";

export function Overview({ go }: { go: (s: Section) => void }) {
  const { data, today, sending, sendReminder, log } = useStore();
  const start = today.getTime();

  const k = useMemo(() => {
    const active = data.members.filter((m) => statusOf(m, today) !== "Expired");
    const present = data.members.filter((m) => m.checkInAt !== null);
    const inGym = present.filter((m) => m.checkOutAt === null);
    const expiring = data.members.filter((m) => statusOf(m, today) === "Expiring Soon").sort((a, b) => daysLeft(a.expiryDate, today) - daysLeft(b.expiryDate, today));
    const ordersToday = data.orders.filter((o) => o.at >= start);
    const series = monthlySeries(data, today);
    const month = series[series.length - 1];
    const sessionsLeft = data.packages.reduce((s, p) => s + (p.total - p.used), 0);
    const lowStock = data.products.filter((p) => p.stock <= p.reorderAt);
    return { active, present, inGym, expiring, ordersToday, series, month, sessionsLeft, lowStock };
  }, [data, today, start]);

  const salesToday = k.ordersToday.reduce((s, o) => s + o.total, 0);
  const monthRevenue = k.month.membership + k.month.pt + k.month.shop;
  const recentIn = [...k.present].sort((a, b) => (b.checkInAt ?? 0) - (a.checkInAt ?? 0)).slice(0, 7);

  // Top products today
  const top = useMemo(() => {
    const m = new Map<string, number>();
    k.ordersToday.forEach((o) => o.items.forEach((it) => m.set(it.productId, (m.get(it.productId) || 0) + it.qty)));
    return [...m].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, qty]) => ({ p: data.products.find((x) => x.id === id)!, qty }));
  }, [k.ordersToday, data.products]);

  return (
    <div className="space-y-5">
      <section aria-label="Key metrics" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Kpi icon={Users} label="Active members" value={k.active.length.toLocaleString()} hint="Incl. expiring this week" i={0} />
        <Kpi icon={UserCheck} label="Today's attendance" value={String(k.present.length)} hint={`${k.inGym.length} in the gym now`} tone="emerald" i={1} />
        <Kpi icon={AlertTriangle} label="Expiring ≤ 7 days" value={String(k.expiring.length)} hint="Send renewal reminders" tone="rose" i={2} />
        <Kpi icon={ShoppingBag} label="Shop sales today" value={aed(salesToday)} hint={`${k.ordersToday.length} orders`} tone="amber" i={3} />
        <Kpi icon={PackageIcon} label="PT sessions left" value={String(k.sessionsLeft)} hint={`${data.packages.length} active packages`} tone="violet" i={4} />
        <Kpi icon={CircleDollarSign} label="Revenue this month" value={aed(monthRevenue)} hint="Membership + PT + shop" tone="sky" i={5} />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Revenue — last 12 months" sub="Membership, personal training and protein bar / shop" action={<Btn onClick={() => go("analytics")}>Open analytics</Btn>}>
          <BarChart
            data={k.series.map((s) => ({ label: s.label, membership: s.membership, pt: s.pt, shop: s.shop }))}
            keys={["membership", "pt", "shop"]}
            colors={["#00d4dc", "#1d6fe0", "#f5b84b"]}
            format={aed}
            height={210}
          />
          <div className="mt-4">
            <Legend items={[{ label: "Membership", color: "#00d4dc", value: aed(k.month.membership) }, { label: "PT", color: "#1d6fe0", value: aed(k.month.pt) }, { label: "Shop", color: "#f5b84b", value: aed(k.month.shop) }]} />
          </div>
        </Panel>

        <Panel title="Live check-ins" sub="Most recent first" action={<Btn onClick={() => go("attendance")}><LogIn className="h-3.5 w-3.5" aria-hidden /> Check-in desk</Btn>}>
          <ul className="space-y-2.5">
            {recentIn.map((m) => (
              <li key={m.id} className="flex items-center gap-3">
                <Avatar name={m.name} size={8} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{m.name}</p>
                  <p className="text-xs text-white/45">{m.plan}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs tabular-nums text-white/80">{fmtMinutes(m.checkInAt ?? 0)}</p>
                  {m.checkOutAt === null ? <Pill tone="emerald"><DoorOpen className="h-3 w-3" aria-hidden /> In gym</Pill> : <Pill>Left</Pill>}
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel
          title="Expiring this week"
          sub={`${k.expiring.length} members need a renewal nudge`}
          action={
            <Btn tone="primary" disabled={!k.expiring.length || k.expiring.some((m) => sending.has(m.id))} onClick={() => sendReminder(k.expiring.map((m) => m.id))}>
              Remind all
            </Btn>
          }
          className="lg:col-span-1"
        >
          <ChannelPicker className="mb-3" />
          <ul className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
            {k.expiring.map((m) => (
              <li key={m.id} className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-black/40 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{m.name}</p>
                  <ExpiryBadge days={daysLeft(m.expiryDate, today)} />
                </div>
                <RemindButton member={m} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Top sellers today" sub="Protein bar & pro shop" action={<Btn onClick={() => go("orders")}>New order</Btn>}>
          {top.length ? (
            <ul className="space-y-3">
              {top.map(({ p, qty }) => (
                <li key={p.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-white/85">{p.name}</span>
                  <span className="tabular-nums text-white/55">{qty} sold</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-white/45">No orders yet today.</p>
          )}
          {k.lowStock.length > 0 && (
            <div className="mt-5 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-200"><AlertTriangle className="h-3.5 w-3.5" aria-hidden /> Low stock</p>
              <p className="mt-1 text-xs text-amber-100/70">{k.lowStock.map((p) => `${p.name} (${p.stock})`).join(" · ")}</p>
            </div>
          )}
        </Panel>

        <Panel title="Activity" sub="What happened in this session">
          {log.length ? (
            <ul className="max-h-[320px] space-y-2.5 overflow-y-auto">
              {log.map((l) => (
                <li key={l.id} className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-white/80">{l.text}</span>
                  <span className="shrink-0 text-xs text-white/40">{ago(l.at)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-white/45">Check a member in, take an order or send a reminder — it will show up here.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}
