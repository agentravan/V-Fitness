"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import {
  PLAN_DAYS, PLAN_PRICE, addDays, generateData, parseISO, reminderMessage, startOfDay, toISO, winBackMessage,
  type Channel, type GymData, type Member, type OrderItem, type PaymentMethod, type PlanType,
} from "@/lib/demo-data";

const STATE_KEY = "vf-os-state-v2";

export type Toast = { id: number; tone: "success" | "info" | "warn"; title: string; body?: string };
export type LogItem = { id: number; at: number; text: string; kind: "in" | "out" | "send" | "order" | "pkg" | "member" };

type Ctx = {
  data: GymData;
  today: Date;
  nowMin: number;
  channel: Channel;
  setChannel: (c: Channel) => void;
  sending: Set<string>;
  toasts: Toast[];
  dismiss: (id: number) => void;
  log: LogItem[];
  toast: (t: Omit<Toast, "id">) => void;
  checkIn: (id: string) => void;
  checkOut: (id: string) => void;
  sendReminder: (ids: string[], kind?: "renewal" | "winback") => Promise<void>;
  renew: (id: string) => void;
  addMember: (m: { name: string; phone: string; plan: PlanType; gender: "M" | "F" }) => string;
  createOrder: (o: { memberId: string | null; customer: string; items: OrderItem[]; payment: PaymentMethod }) => void;
  setOrderStatus: (id: string, status: "Paid" | "Collected") => void;
  restock: (productId: string, qty: number) => void;
  logSession: (pkgId: string) => void;
  renewPackage: (pkgId: string) => void;
  reset: () => void;
};

const StoreCtx = createContext<Ctx | null>(null);
export const useStore = () => {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
};

const safe = {
  get(key: string) {
    try { return window.localStorage.getItem(key); } catch { return null; }
  },
  set(key: string, v: string | null) {
    try { if (v === null) window.localStorage.removeItem(key); else window.localStorage.setItem(key, v); } catch { /* ignore */ }
  },
};

function load(today: Date): GymData {
  const raw = safe.get(STATE_KEY);
  if (raw) {
    try {
      const saved = JSON.parse(raw) as { date: string; data: GymData };
      if (saved.date === toISO(today) && saved.data?.members?.length) return saved.data;
    } catch { /* fall through */ }
  }
  return generateData(new Date());
}

const minutesNow = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const today = useMemo(() => startOfDay(), []);
  const [data, setData] = useState<GymData>(() => load(today));
  const [channel, setChannel] = useState<Channel>("WhatsApp");
  const [sending, setSending] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [log, setLog] = useState<LogItem[]>([]);
  const [nowMin, setNowMin] = useState(minutesNow);
  const idRef = useRef(1);
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    const t = setTimeout(() => safe.set(STATE_KEY, JSON.stringify({ date: toISO(today), data })), 300);
    return () => clearTimeout(t);
  }, [data, today]);

  useEffect(() => {
    const t = setInterval(() => setNowMin(minutesNow()), 30_000);
    return () => clearInterval(t);
  }, []);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = idRef.current++;
    setToasts((ts) => [...ts, { ...t, id }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 4800);
  }, []);
  const dismiss = useCallback((id: number) => setToasts((ts) => ts.filter((x) => x.id !== id)), []);
  const addLog = useCallback((text: string, kind: LogItem["kind"]) => {
    const id = idRef.current++;
    setLog((l) => [{ id, at: Date.now(), text, kind }, ...l].slice(0, 30));
  }, []);

  const patchMember = (id: string, fn: (m: Member) => Member) =>
    setData((d) => ({ ...d, members: d.members.map((m) => (m.id === id ? fn(m) : m)) }));

  const checkIn = useCallback((id: string) => {
    const m = dataRef.current.members.find((x) => x.id === id);
    if (!m) return;
    const t = minutesNow();
    patchMember(id, (x) => ({ ...x, checkInAt: t, checkOutAt: null }));
    addLog(`${m.name} checked in`, "in");
    toast({ tone: "success", title: `${m.name} checked in`, body: `${m.plan} · ${m.id}` });
  }, [addLog, toast]);

  const checkOut = useCallback((id: string) => {
    const m = dataRef.current.members.find((x) => x.id === id);
    if (!m) return;
    patchMember(id, (x) => ({ ...x, checkOutAt: Math.max(minutesNow(), (x.checkInAt ?? 0) + 1) }));
    addLog(`${m.name} checked out`, "out");
    toast({ tone: "info", title: `${m.name} checked out` });
  }, [addLog, toast]);

  const sendReminder = useCallback(async (ids: string[], kind: "renewal" | "winback" = "renewal") => {
    const targets = dataRef.current.members.filter((m) => ids.includes(m.id));
    if (!targets.length) return;
    setSending((s) => new Set([...s, ...ids]));
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 500)); // simulated gateway
    const at = Date.now();
    setData((d) => ({ ...d, members: d.members.map((m) => (ids.includes(m.id) ? { ...m, lastReminder: { channel, at } } : m)) }));
    setSending((s) => {
      const n = new Set(s);
      ids.forEach((i) => n.delete(i));
      return n;
    });
    const label = kind === "winback" ? "win-back offer" : "renewal reminder";
    if (targets.length === 1) {
      const t = targets[0];
      addLog(`${channel} ${label} sent to ${t.name}`, "send");
      toast({ tone: "success", title: `${channel} sent to ${t.name}`, body: kind === "winback" ? winBackMessage(t) : reminderMessage(t, channel, today).split("\n").pop() });
    } else {
      addLog(`${channel} ${label}s sent to ${targets.length} members`, "send");
      toast({ tone: "success", title: `${targets.length} ${channel} messages delivered`, body: `Every selected member received a ${label}.` });
    }
  }, [addLog, channel, toast, today]);

  const renew = useCallback((id: string) => {
    const m = dataRef.current.members.find((x) => x.id === id);
    if (!m) return;
    const base = parseISO(m.expiryDate) < today ? today : parseISO(m.expiryDate);
    patchMember(id, (x) => ({ ...x, expiryDate: toISO(addDays(base, PLAN_DAYS[x.plan])) }));
    addLog(`${m.name} renewed ${m.plan} (AED ${PLAN_PRICE[m.plan]})`, "member");
    toast({ tone: "success", title: `${m.name} renewed`, body: `${m.plan} plan extended by ${PLAN_DAYS[m.plan]} days.` });
  }, [addLog, toast, today]);

  const addMember = useCallback((input: { name: string; phone: string; plan: PlanType; gender: "M" | "F" }) => {
    const id = `M${1001 + dataRef.current.members.length}`;
    const member: Member = {
      id,
      name: input.name,
      phone: input.phone,
      email: `${input.name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
      gender: input.gender,
      age: 28,
      goal: "General fitness",
      plan: input.plan,
      joinDate: toISO(today),
      expiryDate: toISO(addDays(today, PLAN_DAYS[input.plan])),
      visits: "0".repeat(56),
      checkInAt: null,
      checkOutAt: null,
    };
    setData((d) => ({ ...d, members: [member, ...d.members] }));
    addLog(`New member ${input.name} joined (${input.plan})`, "member");
    toast({ tone: "success", title: `Welcome, ${input.name}!`, body: `${id} · ${input.plan} plan created.` });
    return id;
  }, [addLog, toast, today]);

  const createOrder = useCallback((o: { memberId: string | null; customer: string; items: OrderItem[]; payment: PaymentMethod }) => {
    const total = o.items.reduce((s, it) => s + it.qty * it.price, 0);
    const id = `OR${5001 + dataRef.current.orders.length}`;
    setData((d) => ({
      ...d,
      orders: [{ id, ...o, total, status: o.payment === "Member account" ? "Pending" : "Paid", at: Date.now() }, ...d.orders],
      products: d.products.map((p) => {
        const it = o.items.find((x) => x.productId === p.id);
        return it ? { ...p, stock: Math.max(0, p.stock - it.qty) } : p;
      }),
    }));
    addLog(`Order ${id} · ${o.customer} · AED ${total}`, "order");
    toast({ tone: "success", title: `Order ${id} created`, body: `${o.customer} · AED ${total} · ${o.payment}` });
  }, [addLog, toast]);

  const setOrderStatus = useCallback((id: string, status: "Paid" | "Collected") => {
    setData((d) => ({ ...d, orders: d.orders.map((o) => (o.id === id ? { ...o, status } : o)) }));
    addLog(`Order ${id} marked ${status.toLowerCase()}`, "order");
  }, [addLog]);

  const restock = useCallback((productId: string, qty: number) => {
    const p = dataRef.current.products.find((x) => x.id === productId);
    setData((d) => ({ ...d, products: d.products.map((x) => (x.id === productId ? { ...x, stock: x.stock + qty } : x)) }));
    if (p) toast({ tone: "info", title: `${p.name} restocked`, body: `+${qty} units added to inventory.` });
  }, [toast]);

  const logSession = useCallback((pkgId: string) => {
    const pkg = dataRef.current.packages.find((p) => p.id === pkgId);
    if (!pkg || pkg.used >= pkg.total) return;
    setData((d) => ({ ...d, packages: d.packages.map((p) => (p.id === pkgId ? { ...p, used: p.used + 1, lastSessionAt: Date.now() } : p)) }));
    const m = dataRef.current.members.find((x) => x.id === pkg.memberId);
    addLog(`Session logged · ${m?.name ?? pkg.memberId} · ${pkg.name}`, "pkg");
    toast({ tone: "success", title: "Session logged", body: `${m?.name ?? ""} · ${pkg.total - pkg.used - 1} sessions left` });
  }, [addLog, toast]);

  const renewPackage = useCallback((pkgId: string) => {
    const pkg = dataRef.current.packages.find((p) => p.id === pkgId);
    if (!pkg) return;
    setData((d) => ({ ...d, packages: d.packages.map((p) => (p.id === pkgId ? { ...p, used: 0, start: toISO(today), expiry: toISO(addDays(today, 60)) } : p)) }));
    addLog(`Package ${pkg.name} renewed`, "pkg");
    toast({ tone: "success", title: "Package renewed", body: `${pkg.name} · ${pkg.total} sessions available` });
  }, [addLog, toast, today]);

  const reset = useCallback(() => {
    safe.set(STATE_KEY, null);
    setData(generateData(new Date()));
    setLog([]);
    toast({ tone: "info", title: "Demo data reset" });
  }, [toast]);

  const value: Ctx = {
    data, today, nowMin, channel, setChannel, sending, toasts, dismiss, log, toast,
    checkIn, checkOut, sendReminder, renew, addMember, createOrder, setOrderStatus, restock, logSession, renewPackage, reset,
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
