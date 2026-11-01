"use client";

import { useMemo, useState } from "react";
import { DoorOpen, LogIn, LogOut, QrCode, Search, Timer, UserCheck, Users } from "lucide-react";

import { useStore } from "./store";
import { Avatar, BarChart, Btn, Kpi, Panel, Pill } from "./ui";
import { addDays, fmtMinutes, statusOf } from "@/lib/demo-data";

export function Attendance() {
  const { data, today, nowMin, checkIn, checkOut, toast } = useStore();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "in" | "left">("all");

  const present = useMemo(() => data.members.filter((m) => m.checkInAt !== null).sort((a, b) => (b.checkInAt ?? 0) - (a.checkInAt ?? 0)), [data.members]);
  const inGym = present.filter((m) => m.checkOutAt === null);
  const avgStay = (() => {
    const done = present.filter((m) => m.checkOutAt !== null);
    if (!done.length) return 0;
    return Math.round(done.reduce((s, m) => s + ((m.checkOutAt ?? 0) - (m.checkInAt ?? 0)), 0) / done.length);
  })();

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return [];
    return data.members
      .filter((m) => m.name.toLowerCase().includes(t) || m.id.toLowerCase().includes(t) || m.phone.replace(/\s/g, "").includes(t.replace(/\s/g, "")))
      .slice(0, 6);
  }, [q, data.members]);

  // Hourly check-ins today
  const hourly = useMemo(() => {
    const hours = Array.from({ length: 17 }, (_, i) => i + 6);
    return hours.map((h) => ({ label: `${((h + 11) % 12) + 1}${h < 12 ? "a" : "p"}`, count: present.filter((m) => Math.floor((m.checkInAt ?? 0) / 60) === h).length }));
  }, [present]);

  // Last 7 days from visit history + today
  const week = useMemo(() => {
    const day = new Intl.DateTimeFormat("en-GB", { weekday: "short" });
    const out = [];
    for (let d = 6; d >= 1; d--) {
      const idx = 56 - d;
      out.push({ label: day.format(addDays(today, -d)), count: data.members.filter((m) => m.visits[idx] === "1").length });
    }
    out.push({ label: "Today", count: present.length });
    return out;
  }, [data.members, present.length, today]);

  const scanRandom = () => {
    const pool = data.members.filter((m) => m.checkInAt === null && statusOf(m, today) !== "Expired");
    if (!pool.length) return;
    const m = pool[Math.floor(Math.random() * pool.length)];
    toast({ tone: "info", title: "QR code scanned", body: `Member card ${m.id} recognised` });
    checkIn(m.id);
  };

  const rows = present.filter((m) => (filter === "in" ? m.checkOutAt === null : filter === "left" ? m.checkOutAt !== null : true));

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Attendance metrics">
        <Kpi icon={UserCheck} label="Check-ins today" value={String(present.length)} tone="emerald" />
        <Kpi icon={DoorOpen} label="In the gym now" value={String(inGym.length)} />
        <Kpi icon={Timer} label="Average stay" value={avgStay ? `${avgStay} min` : "—"} tone="sky" />
        <Kpi icon={Users} label="Peak hour today" value={hourly.reduce((a, b) => (b.count > a.count ? b : a)).label.toUpperCase()} tone="violet" />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_1.2fr]">
        <Panel title="Check-in desk" sub="Search by name, member ID or phone — or scan the member QR card">
          <div className="flex gap-2">
            <label className="relative block flex-1">
              <span className="sr-only">Find member</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Sara, M1042, 0501234567" className="field !pl-9" autoFocus />
            </label>
            <Btn tone="primary" onClick={scanRandom} className="!px-4"><QrCode className="h-4 w-4" aria-hidden /> Scan QR</Btn>
          </div>
          <ul className="mt-4 space-y-2">
            {results.map((m) => {
              const st = statusOf(m, today);
              const inside = m.checkInAt !== null && m.checkOutAt === null;
              return (
                <li key={m.id} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/40 p-3">
                  <Avatar name={m.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{m.name}</p>
                    <p className="text-xs text-white/45">{m.id} · {m.plan} · <span className={st === "Expired" ? "text-rose-300" : st === "Expiring Soon" ? "text-amber-200" : "text-emerald-300"}>{st}</span></p>
                  </div>
                  {inside ? (
                    <Btn onClick={() => checkOut(m.id)}><LogOut className="h-3.5 w-3.5" aria-hidden /> Check out</Btn>
                  ) : (
                    <Btn tone="primary" disabled={st === "Expired"} title={st === "Expired" ? "Membership expired — renew first" : undefined} onClick={() => { checkIn(m.id); setQ(""); }}>
                      <LogIn className="h-3.5 w-3.5" aria-hidden /> Check in
                    </Btn>
                  )}
                </li>
              );
            })}
            {q.trim().length >= 2 && !results.length && <li className="py-6 text-center text-sm text-white/45">No member found.</li>}
            {q.trim().length < 2 && <li className="rounded-xl border border-dashed border-white/10 py-8 text-center text-sm text-white/40">Type at least 2 characters to find a member.</li>}
          </ul>
        </Panel>

        <Panel title="Check-ins by hour (today)" sub={`Updated ${fmtMinutes(nowMin)}`}>
          <BarChart data={hourly.map((h) => ({ label: h.label, count: h.count }))} keys={["count"]} colors={["#00d4dc"]} height={170} />
          <h3 className="mb-3 mt-6 text-sm font-semibold">Last 7 days</h3>
          <BarChart data={week.map((w) => ({ label: w.label, count: w.count }))} keys={["count"]} colors={["#1d6fe0"]} height={110} highlightLast />
        </Panel>
      </div>

      <Panel
        title="Today's attendance log"
        sub={`${rows.length} of ${present.length} visits`}
        action={
          <div role="radiogroup" aria-label="Filter" className="inline-flex rounded-lg border border-white/10 bg-black p-0.5 text-xs">
            {(["all", "in", "left"] as const).map((f) => (
              <button key={f} role="radio" aria-checked={filter === f} onClick={() => setFilter(f)} className={`rounded-md px-3 py-1.5 font-medium ${filter === f ? "bg-white/10 text-white" : "text-white/45 hover:text-white"}`}>
                {f === "all" ? "All" : f === "in" ? "In gym" : "Left"}
              </button>
            ))}
          </div>
        }
      >
        <div className="-mx-5 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs text-white/40">
              <tr>
                <th scope="col" className="px-5 py-2 font-medium">Member</th>
                <th scope="col" className="px-3 py-2 font-medium">Plan</th>
                <th scope="col" className="px-3 py-2 font-medium">Time in</th>
                <th scope="col" className="px-3 py-2 font-medium">Time out</th>
                <th scope="col" className="px-3 py-2 font-medium">Duration</th>
                <th scope="col" className="px-5 py-2 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {rows.map((m) => {
                const dur = (m.checkOutAt ?? nowMin) - (m.checkInAt ?? 0);
                return (
                  <tr key={m.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={m.name} size={8} />
                        <div>
                          <p className="font-medium text-white">{m.name}</p>
                          <p className="text-xs text-white/40">{m.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-white/70">{m.plan}</td>
                    <td className="px-3 py-2.5 tabular-nums text-white/80">{fmtMinutes(m.checkInAt ?? 0)}</td>
                    <td className="px-3 py-2.5 tabular-nums text-white/60">{m.checkOutAt !== null ? fmtMinutes(m.checkOutAt) : "—"}</td>
                    <td className="px-3 py-2.5 tabular-nums text-white/60">{Math.max(1, dur)} min</td>
                    <td className="px-5 py-2.5 text-right">
                      {m.checkOutAt === null ? (
                        <div className="flex items-center justify-end gap-2">
                          <Pill tone="emerald">In gym</Pill>
                          <Btn onClick={() => checkOut(m.id)}>Check out</Btn>
                        </div>
                      ) : (
                        <Pill>Left</Pill>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
