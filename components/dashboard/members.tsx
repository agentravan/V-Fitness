"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, LogIn, Mail, Phone, Plus, RefreshCw, Search, ShoppingBag, Target, X } from "lucide-react";

import { useStore } from "./store";
import { Avatar, Btn, ChannelPicker, ExpiryBadge, Panel, Pill, Progress, RemindButton, VisitGrid, aed, fmtDate } from "./ui";
import {
  PLAN_OPTIONS, PLAN_PRICE, daysLeft, daysSinceVisit, isAtRisk, statusOf, visitsInLast,
  type Member, type MemberStatus, type PlanType,
} from "@/lib/demo-data";

type StatusFilter = "All" | MemberStatus | "At risk";
const PAGE = 10;

export function Members({ openId, onOpened }: { openId: string | null; onOpened: () => void }) {
  const { data, today } = useStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [plan, setPlan] = useState<"All" | PlanType>("All");
  const [sort, setSort] = useState<"attention" | "name" | "visits" | "join">("attention");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (openId) {
      setSelected(openId);
      onOpened();
    }
  }, [openId, onOpened]);
  useEffect(() => setPage(1), [query, status, plan, sort]);

  const rows = useMemo(() => {
    const rank: Record<MemberStatus, number> = { "Expiring Soon": 0, Active: 1, Expired: 2 };
    const t = query.trim().toLowerCase();
    const list = data.members
      .map((m) => ({ m, st: statusOf(m, today), days: daysLeft(m.expiryDate, today), v30: visitsInLast(m, 30), risk: isAtRisk(m, today) }))
      .filter(({ m, st, risk }) =>
        (status === "All" || (status === "At risk" ? risk : st === status)) &&
        (plan === "All" || m.plan === plan) &&
        (!t || m.name.toLowerCase().includes(t) || m.id.toLowerCase().includes(t) || m.phone.replace(/\s/g, "").includes(t.replace(/\s/g, ""))),
      );
    list.sort((a, b) =>
      sort === "name" ? a.m.name.localeCompare(b.m.name)
        : sort === "visits" ? b.v30 - a.v30
          : sort === "join" ? b.m.joinDate.localeCompare(a.m.joinDate)
            : rank[a.st] - rank[b.st] || (a.st === "Expired" ? b.days - a.days : a.days - b.days),
    );
    return list;
  }, [data.members, query, status, plan, sort, today]);

  const counts = useMemo(() => ({
    All: data.members.length,
    Active: data.members.filter((m) => statusOf(m, today) === "Active").length,
    "Expiring Soon": data.members.filter((m) => statusOf(m, today) === "Expiring Soon").length,
    Expired: data.members.filter((m) => statusOf(m, today) === "Expired").length,
    "At risk": data.members.filter((m) => isAtRisk(m, today)).length,
  }), [data.members, today]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const pageRows = rows.slice((page - 1) * PAGE, page * PAGE);
  const sel = data.members.find((m) => m.id === selected) ?? null;

  return (
    <>
      <Panel
        title="Member tracking"
        sub={`${rows.length} of ${data.members.length} members`}
        action={
          <div className="flex flex-wrap gap-2">
            <ChannelPicker />
            <Btn tone="primary" onClick={() => setAdding(true)}><Plus className="h-3.5 w-3.5" aria-hidden /> Add member</Btn>
          </div>
        }
      >
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <span className="sr-only">Search members</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, member ID or phone…" className="field !pl-9" />
          </label>
          <select aria-label="Filter by plan" value={plan} onChange={(e) => setPlan(e.target.value as "All" | PlanType)} className="field md:w-44">
            <option value="All">All plans</option>
            {PLAN_OPTIONS.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="field md:w-48">
            <option value="attention">Needs attention first</option>
            <option value="visits">Most visits (30 days)</option>
            <option value="name">Name A–Z</option>
            <option value="join">Newest members</option>
          </select>
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Filter by status">
          {(["All", "Active", "Expiring Soon", "Expired", "At risk"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              role="radio"
              aria-checked={status === s}
              onClick={() => setStatus(s)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${status === s ? "border-brand bg-brand/10 text-white" : "border-white/10 text-white/55 hover:text-white"}`}
            >
              {s}
              <span className={`rounded px-1.5 ${status === s ? "bg-brand text-black" : "bg-white/10 text-white/70"}`}>{counts[s]}</span>
            </button>
          ))}
        </div>

        <div className="-mx-5 mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <caption className="sr-only">Members</caption>
            <thead className="border-y border-white/[0.06] text-xs text-white/40">
              <tr>
                <th scope="col" className="px-5 py-2.5 font-medium">Member</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Plan</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Joined</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Expiry</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Visits (30d)</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Last visit</th>
                <th scope="col" className="px-5 py-2.5 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {pageRows.map(({ m, days, v30, risk }) => {
                const last = daysSinceVisit(m);
                return (
                  <tr key={m.id} className={`cursor-pointer hover:bg-white/[0.03] ${days >= 0 && days < 7 ? (days <= 2 ? "bg-rose-500/[0.04]" : "bg-amber-400/[0.03]") : ""}`} onClick={() => setSelected(m.id)}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={m.name} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">{m.name}</p>
                          <p className="text-xs text-white/40">{m.id} · {m.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-white/75">{m.plan}</td>
                    <td className="px-3 py-3 tabular-nums text-white/55">{fmtDate(m.joinDate)}</td>
                    <td className="px-3 py-3">
                      <p className="tabular-nums text-white/75">{fmtDate(m.expiryDate)}</p>
                      <ExpiryBadge days={days} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 tabular-nums text-white/80">{v30}</span>
                        <div className="w-16"><Progress value={v30} max={20} /></div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-white/60">
                      {last === 0 ? <Pill tone="emerald">Today</Pill> : last >= 99 ? "—" : `${last}d ago`}
                      {risk && <span className="ml-1.5"><Pill tone="rose">At risk</Pill></span>}
                    </td>
                    <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <RemindButton member={m} label={risk ? "Win back" : "Remind"} kind={risk && days >= 7 ? "winback" : "renewal"} />
                        <Btn onClick={() => setSelected(m.id)}>View</Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!pageRows.length && <p className="py-12 text-center text-sm text-white/45">No members match these filters.</p>}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-white/50">
          <span>Page <span className="text-white">{page}</span> of {pages}</span>
          <div className="flex gap-2">
            <Btn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" aria-label="Previous page" /></Btn>
            <Btn onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}><ChevronRight className="h-4 w-4" aria-label="Next page" /></Btn>
          </div>
        </div>
      </Panel>

      <AnimatePresence>{sel && <MemberDrawer member={sel} onClose={() => setSelected(null)} />}</AnimatePresence>
      <AnimatePresence>{adding && <AddMember onClose={() => setAdding(false)} onCreated={(id) => { setAdding(false); setSelected(id); }} />}</AnimatePresence>
    </>
  );
}

function MemberDrawer({ member: m, onClose }: { member: Member; onClose: () => void }) {
  const { data, today, renew, checkIn, checkOut } = useStore();
  const days = daysLeft(m.expiryDate, today);
  const st = statusOf(m, today);
  const pkgs = data.packages.filter((p) => p.memberId === m.id);
  const orders = data.orders.filter((o) => o.memberId === m.id);
  const spend = orders.reduce((s, o) => s + o.total, 0);
  const owed = orders.filter((o) => o.status === "Pending").reduce((s, o) => s + o.total, 0);
  const v30 = visitsInLast(m, 30);
  const inside = m.checkInAt !== null && m.checkOutAt === null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[60] flex justify-end bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={`${m.name} profile`}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="h-full w-full max-w-lg overflow-y-auto border-l border-white/10 bg-[#0a0a0b] p-6"
      >
        <div className="flex items-start gap-4">
          <Avatar name={m.name} size={16} />
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-semibold">{m.name}</h2>
            <p className="text-sm text-white/50">{m.id} · {m.gender === "M" ? "Male" : "Female"}, {m.age} · Member since {fmtDate(m.joinDate)}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone={st === "Expired" ? "slate" : st === "Expiring Soon" ? "amber" : "emerald"}>{st}</Pill>
              {isAtRisk(m, today) && <Pill tone="rose">At risk</Pill>}
              {inside && <Pill tone="brand">In gym now</Pill>}
            </div>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/60 hover:text-white" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
          <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-white/75 hover:text-white"><Phone className="h-4 w-4" aria-hidden /> {m.phone}</a>
          <span className="flex items-center gap-2 truncate rounded-lg border border-white/10 px-3 py-2 text-white/75"><Mail className="h-4 w-4 shrink-0" aria-hidden /> <span className="truncate">{m.email}</span></span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {[["Visits (30d)", String(v30)], ["Avg / week", (visitsInLast(m, 28) / 4).toFixed(1)], ["Shop spend", aed(spend)]].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-white/[0.07] bg-black p-3">
              <p className="text-[11px] text-white/45">{k}</p>
              <p className="mt-0.5 text-lg font-semibold tabular-nums">{v}</p>
            </div>
          ))}
        </div>

        <section className="mt-6">
          <h3 className="text-sm font-semibold">Membership</h3>
          <div className="mt-2 rounded-xl border border-white/[0.07] bg-black p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">{m.plan} · AED {PLAN_PRICE[m.plan]}</p>
                <p className="text-xs text-white/45">Expires {fmtDate(m.expiryDate)}</p>
              </div>
              <ExpiryBadge days={days} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Btn tone="primary" onClick={() => renew(m.id)}><RefreshCw className="h-3.5 w-3.5" aria-hidden /> Renew {m.plan}</Btn>
              <RemindButton member={m} label="Send renewal reminder" />
              {inside ? (
                <Btn onClick={() => checkOut(m.id)}>Check out</Btn>
              ) : (
                <Btn disabled={st === "Expired"} onClick={() => checkIn(m.id)}><LogIn className="h-3.5 w-3.5" aria-hidden /> Check in</Btn>
              )}
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h3 className="flex items-center justify-between text-sm font-semibold">Attendance — last 8 weeks <span className="text-xs font-normal text-white/40">Goal: <Target className="inline h-3 w-3" aria-hidden /> {m.goal}</span></h3>
          <div className="mt-2 rounded-xl border border-white/[0.07] bg-black p-4">
            <VisitGrid visits={m.visits} today={m.checkInAt !== null} />
          </div>
        </section>

        <section className="mt-6">
          <h3 className="text-sm font-semibold">Packages</h3>
          {pkgs.length ? (
            <ul className="mt-2 space-y-2">
              {pkgs.map((p) => (
                <li key={p.id} className="rounded-xl border border-white/[0.07] bg-black p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-white">{p.name}</span>
                    <span className="tabular-nums text-white/60">{p.total - p.used} of {p.total} left</span>
                  </div>
                  <div className="mt-2"><Progress value={p.used} max={p.total} tone={p.total - p.used <= 2 ? "amber" : "brand"} /></div>
                  <p className="mt-2 text-xs text-white/40">{p.trainer} · valid until {fmtDate(p.expiry)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-white/45">No PT or class packages.</p>
          )}
        </section>

        <section className="mt-6 pb-6">
          <h3 className="flex items-center justify-between text-sm font-semibold">
            Orders <span className="text-xs font-normal text-white/45">{owed ? `AED ${owed} on account` : "Nothing owed"}</span>
          </h3>
          {orders.length ? (
            <ul className="mt-2 divide-y divide-white/[0.05] rounded-xl border border-white/[0.07] bg-black">
              {orders.slice(0, 6).map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <span className="flex items-center gap-2 text-white/75"><ShoppingBag className="h-3.5 w-3.5 text-white/35" aria-hidden /> {o.items.length} item{o.items.length > 1 ? "s" : ""} · {new Date(o.at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
                  <span className="flex items-center gap-2"><span className="tabular-nums text-white">{aed(o.total)}</span><Pill tone={o.status === "Pending" ? "amber" : "slate"}>{o.status}</Pill></span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-white/45">No protein bar or shop orders yet.</p>
          )}
        </section>
      </motion.aside>
    </motion.div>
  );
}

function AddMember({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const { addMember } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+971 5");
  const [plan, setPlan] = useState<PlanType>("Monthly");
  const [gender, setGender] = useState<"M" | "F">("M");
  const valid = name.trim().length >= 3 && /^\+?[0-9\s]{9,16}$/.test(phone.trim());

  return (
    <motion.div className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.form
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-title"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onCreated(addMember({ name: name.trim(), phone: phone.trim(), plan, gender }));
        }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0c0d] p-6"
      >
        <h2 id="add-title" className="text-xl font-semibold">Add member</h2>
        <p className="mt-1 text-sm text-white/50">Creates the profile and starts the plan today.</p>
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="nm" className="mb-1.5 block text-sm text-white/70">Full name</label>
            <input id="nm" className="field" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>
          <div>
            <label htmlFor="ph" className="mb-1.5 block text-sm text-white/70">Mobile (WhatsApp)</label>
            <input id="ph" className="field" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="pl" className="mb-1.5 block text-sm text-white/70">Plan</label>
              <select id="pl" className="field" value={plan} onChange={(e) => setPlan(e.target.value as PlanType)}>
                {PLAN_OPTIONS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="gd" className="mb-1.5 block text-sm text-white/70">Gender</label>
              <select id="gd" className="field" value={gender} onChange={(e) => setGender(e.target.value as "M" | "F")}>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-white/55">Plan fee: <span className="font-semibold text-white">AED {PLAN_PRICE[plan]}</span></p>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn tone="primary" type="submit" disabled={!valid}>Create member</Btn>
        </div>
      </motion.form>
    </motion.div>
  );
}
