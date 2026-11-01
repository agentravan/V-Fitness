/**
 * Deterministic demo dataset for the V Fitness Club OS portal.
 * Everything is generated in the browser relative to "today", so the demo always looks current.
 *
 * Default shape: 274 members (248 active incl. 12 expiring within 7 days, 26 expired),
 * 42 check-ins today, ~150 shop / protein-bar orders over 30 days, ~70 PT & class packages.
 */

export type PlanType = "Monthly" | "Quarterly" | "Annual" | "Personal Training";
export type MemberStatus = "Active" | "Expiring Soon" | "Expired";
export type Channel = "WhatsApp" | "SMS" | "Email";

export type Member = {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: "M" | "F";
  age: number;
  goal: string;
  plan: PlanType;
  joinDate: string; // yyyy-mm-dd
  expiryDate: string; // yyyy-mm-dd
  /** Last 56 days of visits, oldest first ("1" = visited). Excludes today. */
  visits: string;
  checkInAt: number | null; // minutes after midnight, today
  checkOutAt: number | null;
  lastReminder?: { channel: Channel; at: number };
};

export type ProductCategory = "Protein" | "Supplements" | "Drinks" | "Snacks" | "Gear";
export type Product = { id: string; name: string; category: ProductCategory; price: number; stock: number; reorderAt: number };

export type OrderStatus = "Paid" | "Pending" | "Collected";
export type PaymentMethod = "Cash" | "Card" | "Member account";
export type OrderItem = { productId: string; qty: number; price: number };
export type Order = {
  id: string;
  memberId: string | null;
  customer: string;
  items: OrderItem[];
  total: number;
  payment: PaymentMethod;
  status: OrderStatus;
  at: number; // epoch ms
};

export type PackageKind = "Personal Training" | "Class Pack";
export type Package = {
  id: string;
  memberId: string;
  name: string;
  kind: PackageKind;
  total: number;
  used: number;
  trainer: string;
  start: string;
  expiry: string;
  price: number;
  lastSessionAt: number | null;
};

export type GymData = { members: Member[]; products: Product[]; orders: Order[]; packages: Package[] };

export const CURRENCY = "AED";
export const DEMO_CREDENTIALS = { email: "demo@vfitness.com", password: "demo" } as const;
export const TRAINERS = ["Coach Arjun", "Coach Sara", "Coach Omar", "Coach Lina"];
export const PLAN_DAYS: Record<PlanType, number> = { Monthly: 30, Quarterly: 90, Annual: 365, "Personal Training": 30 };
export const PLAN_PRICE: Record<PlanType, number> = { Monthly: 150, Quarterly: 599, Annual: 1068, "Personal Training": 899 };
export const PLAN_OPTIONS: PlanType[] = ["Monthly", "Quarterly", "Annual", "Personal Training"];

/* ---------------------------------------------------------------- date helpers */

export const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const startOfDay = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const parseISO = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const daysLeft = (expiryISO: string, today = startOfDay()) =>
  Math.round((parseISO(expiryISO).getTime() - today.getTime()) / 86_400_000);

export function statusOf(m: Pick<Member, "expiryDate">, today = startOfDay()): MemberStatus {
  const d = daysLeft(m.expiryDate, today);
  if (d < 0) return "Expired";
  if (d < 7) return "Expiring Soon";
  return "Active";
}

/** Days since last visit (0 = today). Large number if never in the window. */
export function daysSinceVisit(m: Member) {
  if (m.checkInAt !== null) return 0;
  const i = m.visits.lastIndexOf("1");
  return i === -1 ? 99 : m.visits.length - i;
}
export const visitsInLast = (m: Member, days: number) =>
  m.visits.slice(-days).split("").filter((c) => c === "1").length + (m.checkInAt !== null ? 1 : 0);
/** Active plan, joined over 14 days ago, and no visit in the last 14 days. */
export const isAtRisk = (m: Member, today = startOfDay()) =>
  statusOf(m, today) !== "Expired" &&
  daysSinceVisit(m) >= 14 &&
  (today.getTime() - parseISO(m.joinDate).getTime()) / 86_400_000 > 14;

export const fmtMinutes = (min: number) => {
  const h = Math.floor(min / 60), m = min % 60;
  const ap = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${ap}`;
};

/* ---------------------------------------------------------------- generator */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_M = ["Aarav", "Omar", "Daniel", "Rahul", "Yusuf", "Arjun", "Ivan", "Kiran", "Hassan", "Zain", "Ali", "Rohan", "Lucas", "Khalid", "Vikram", "James", "Faisal", "Imran", "Marco", "Tariq", "Joel", "Adil", "Sameer", "Noah"];
const FIRST_F = ["Fatima", "Priya", "Aisha", "Sara", "Maria", "Layla", "Noor", "Elena", "Meera", "Chloe", "Mariam", "Ananya", "Sofia", "Huda", "Grace", "Nadia", "Leila", "Divya", "Amira", "Rhea"];
const LAST = ["Sharma", "Al Mansoori", "Khan", "Fernandes", "Rahman", "Petrov", "Nair", "Haddad", "Iyer", "Santos", "Qureshi", "Mehta", "Ibrahim", "Kovacs", "Pillai", "Saleh", "Rossi", "Menon", "Farouk", "Reyes", "Chopra", "Aziz", "Thomas", "Hashemi"];
const GOALS = ["Fat loss", "Muscle gain", "General fitness", "Strength", "Mobility", "MMA / self-defence"];

export const PRODUCTS: Product[] = [
  { id: "P01", name: "Whey Protein Shake", category: "Protein", price: 25, stock: 120, reorderAt: 30 },
  { id: "P02", name: "Mass Gainer Shake", category: "Protein", price: 30, stock: 60, reorderAt: 20 },
  { id: "P03", name: "Vegan Protein Shake", category: "Protein", price: 28, stock: 18, reorderAt: 20 },
  { id: "P04", name: "Whey Protein 2 kg Tub", category: "Supplements", price: 289, stock: 14, reorderAt: 5 },
  { id: "P05", name: "Pre-Workout Shot", category: "Supplements", price: 15, stock: 80, reorderAt: 25 },
  { id: "P06", name: "Creatine 300 g", category: "Supplements", price: 119, stock: 4, reorderAt: 5 },
  { id: "P07", name: "Electrolyte Drink", category: "Drinks", price: 10, stock: 140, reorderAt: 40 },
  { id: "P08", name: "Cold-Pressed Juice", category: "Drinks", price: 18, stock: 36, reorderAt: 15 },
  { id: "P09", name: "Protein Bar", category: "Snacks", price: 12, stock: 9, reorderAt: 20 },
  { id: "P10", name: "Shaker Bottle (V Fitness)", category: "Gear", price: 35, stock: 42, reorderAt: 10 },
  { id: "P11", name: "Lifting Gloves", category: "Gear", price: 65, stock: 22, reorderAt: 8 },
  { id: "P12", name: "Lifting Straps", category: "Gear", price: 45, stock: 17, reorderAt: 8 },
];

const PACKAGE_TYPES: { name: string; kind: PackageKind; total: number; price: number; days: number }[] = [
  { name: "PT · 8 sessions", kind: "Personal Training", total: 8, price: 1200, days: 45 },
  { name: "PT · 12 sessions", kind: "Personal Training", total: 12, price: 1680, days: 60 },
  { name: "PT · 24 sessions", kind: "Personal Training", total: 24, price: 3120, days: 90 },
  { name: "Class Pack · 10", kind: "Class Pack", total: 10, price: 350, days: 45 },
];

export function generateData(now = new Date()): GymData {
  const today = startOfDay(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const rand = mulberry32(2008);
  const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];
  const used = new Set<string>();

  const planFor = (): PlanType => {
    const r = rand();
    return r < 0.42 ? "Monthly" : r < 0.7 ? "Quarterly" : r < 0.9 ? "Annual" : "Personal Training";
  };

  const members: Member[] = [];
  const push = (expiryOffset: number, kind: "active" | "expired") => {
    const gender: "M" | "F" = rand() < 0.62 ? "M" : "F";
    let name = "";
    do name = `${pick(gender === "M" ? FIRST_M : FIRST_F)} ${pick(LAST)}`; while (used.has(name));
    used.add(name);
    const plan = planFor();
    const expiry = addDays(today, expiryOffset);
    const join = addDays(expiry, -PLAN_DAYS[plan] * (1 + Math.floor(rand() * 5)));
    // Visit pattern for the last 56 days
    const freq = kind === "expired" ? 0.25 : 0.12 + rand() * 0.55;
    const atRisk = kind === "active" && rand() < 0.11;
    let visits = "";
    for (let d = 56; d >= 1; d--) {
      const date = addDays(today, -d);
      const beforeJoin = date < join;
      const afterExpiry = date > expiry;
      const quiet = atRisk && d <= 16;
      visits += !beforeJoin && !afterExpiry && !quiet && rand() < freq ? "1" : "0";
    }
    members.push({
      id: `M${1001 + members.length}`,
      name,
      phone: `+971 5${Math.floor(rand() * 9)} ${String(Math.floor(rand() * 900) + 100)} ${String(Math.floor(rand() * 9000) + 1000)}`,
      email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
      gender,
      age: 18 + Math.floor(rand() * 38),
      goal: pick(GOALS),
      plan,
      joinDate: toISO(join),
      expiryDate: toISO(expiry),
      visits,
      checkInAt: null,
      checkOutAt: null,
    });
  };

  [0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6, 6].forEach((o) => push(o, "active"));
  for (let i = 0; i < 236; i++) push(7 + Math.floor(rand() * 330), "active");
  for (let i = 0; i < 26; i++) push(-1 - Math.floor(rand() * 60), "expired");

  // 42 check-ins today, weighted to morning and evening peaks, never in the future.
  const latest = Math.max(nowMin - 5, 6 * 60 + 30);
  const peakMinute = () => {
    const r = rand();
    const base = r < 0.38 ? 6 * 60 + rand() * 180 : r < 0.55 ? 10 * 60 + rand() * 300 : 17 * 60 + rand() * 300;
    return Math.min(latest, Math.round(base));
  };
  const activeIdx = members.map((m, i) => (daysLeft(m.expiryDate, today) >= 0 && daysSinceVisit(m) < 14 ? i : -1)).filter((i) => i >= 0);
  for (let k = activeIdx.length - 1; k > 0; k--) {
    const j = Math.floor(rand() * (k + 1));
    [activeIdx[k], activeIdx[j]] = [activeIdx[j], activeIdx[k]];
  }
  activeIdx.slice(0, 42).forEach((i) => {
    const inAt = peakMinute();
    members[i].checkInAt = inAt;
    const out = inAt + 45 + Math.floor(rand() * 70);
    members[i].checkOutAt = out < nowMin - 5 && rand() < 0.8 ? out : null;
  });

  // Packages
  const packages: Package[] = [];
  const pkgMembers = members.filter((m) => daysLeft(m.expiryDate, today) >= 0).slice(0, 260);
  for (let i = 0; i < pkgMembers.length && packages.length < 72; i++) {
    if (rand() > 0.3) continue;
    const t = pick(PACKAGE_TYPES);
    const start = addDays(today, -Math.floor(rand() * (t.days - 3)));
    const usedSessions = Math.min(t.total, Math.floor(rand() * (t.total + 2)));
    packages.push({
      id: `PK${201 + packages.length}`,
      memberId: pkgMembers[i].id,
      name: t.name,
      kind: t.kind,
      total: t.total,
      used: usedSessions,
      trainer: t.kind === "Class Pack" ? "Group classes" : pick(TRAINERS),
      start: toISO(start),
      expiry: toISO(addDays(start, t.days)),
      price: t.price,
      lastSessionAt: usedSessions ? addDays(today, -Math.floor(rand() * 6)).getTime() + 18 * 3600_000 : null,
    });
  }

  // Orders over the last 30 days (more on recent days), today limited to before "now".
  const products = PRODUCTS.map((p) => ({ ...p }));
  const orders: Order[] = [];
  const buyers = members.filter((m) => daysLeft(m.expiryDate, today) >= -10);
  for (let d = 29; d >= 0; d--) {
    const n = d === 0 ? 17 : 3 + Math.floor(rand() * 5);
    for (let k = 0; k < n; k++) {
      const minute = d === 0 ? Math.min(latest, 6 * 60 + 30 + Math.floor(rand() * Math.max(30, latest - 390))) : 6 * 60 + Math.floor(rand() * 16 * 60);
      const at = addDays(today, -d).getTime() + minute * 60_000;
      const lines = 1 + (rand() < 0.35 ? 1 : 0) + (rand() < 0.1 ? 1 : 0);
      const items: OrderItem[] = [];
      for (let l = 0; l < lines; l++) {
        const r = rand();
        const p = r < 0.45 ? products[Math.floor(rand() * 3)] : r < 0.7 ? products[6 + Math.floor(rand() * 3)] : pick(products);
        if (items.some((it) => it.productId === p.id)) continue;
        items.push({ productId: p.id, qty: p.category === "Drinks" && rand() < 0.3 ? 2 : 1, price: p.price });
      }
      const walkIn = rand() < 0.12;
      const m = walkIn ? null : pick(buyers);
      const total = items.reduce((s, it) => s + it.qty * it.price, 0);
      const payment: PaymentMethod = rand() < 0.5 ? "Card" : rand() < 0.6 ? "Cash" : walkIn ? "Cash" : "Member account";
      const status: OrderStatus = d === 0 && rand() < 0.3 ? (payment === "Member account" ? "Pending" : "Paid") : payment === "Member account" && d < 4 && rand() < 0.5 ? "Pending" : "Collected";
      orders.push({ id: `OR${5001 + orders.length}`, memberId: m?.id ?? null, customer: m?.name ?? "Walk-in guest", items, total, payment, status, at });
    }
  }
  orders.sort((a, b) => b.at - a.at);

  return { members, products, orders, packages };
}

/* ---------------------------------------------------------------- analytics series (synthetic history) */

const MONTH = new Intl.DateTimeFormat("en-GB", { month: "short" });

/** 12 months of history ending this month. The current month uses live order data. */
export function monthlySeries(data: GymData, today = startOfDay()) {
  const rand = mulberry32(77);
  const out: { label: string; membership: number; pt: number; shop: number; active: number; joins: number; churn: number }[] = [];
  let active = 196;
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const joins = 18 + Math.floor(rand() * 16);
    const churn = 9 + Math.floor(rand() * 9);
    active = i === 0 ? data.members.filter((m) => daysLeft(m.expiryDate, today) >= 0).length : active + joins - churn;
    let shop = 5200 + Math.round(rand() * 2600) + (11 - i) * 140;
    if (i === 0) {
      const from = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
      shop = data.orders.filter((o) => o.at >= from).reduce((s, o) => s + o.total, 0);
    }
    out.push({
      label: MONTH.format(d),
      membership: Math.round(active * 148 + rand() * 2500),
      pt: Math.round(9000 + rand() * 5000 + (11 - i) * 220),
      shop,
      active,
      joins,
      churn,
    });
  }
  return out;
}

/** Visits by weekday (Mon..Sun) × hour (6..22), synthetic but consistent. */
export function peakGrid() {
  const rand = mulberry32(9);
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, di) => ({
    day,
    values: hours.map((h) => {
      const peak = h >= 6 && h <= 8 ? 0.75 : h >= 17 && h <= 21 ? 1 : h >= 12 && h <= 14 ? 0.45 : 0.25;
      const weekend = di >= 5 ? 0.7 : 1;
      return Math.round((peak * weekend * 22 + rand() * 6) * (di === 4 ? 0.85 : 1));
    }),
  }));
}

export function reminderMessage(m: Member, channel: Channel, today = startOfDay()) {
  const d = daysLeft(m.expiryDate, today);
  const first = m.name.split(" ")[0];
  const when = d < 0 ? `expired ${Math.abs(d)} day${Math.abs(d) === 1 ? "" : "s"} ago` : d === 0 ? "expires today" : `expires in ${d} day${d === 1 ? "" : "s"}`;
  const body = `Hi ${first}, your V Fitness ${m.plan} membership ${when}. Renew now to keep your streak going. Reply YES and we'll lock in your current rate.`;
  return channel === "Email" ? `Subject: Your V Fitness membership — renew today\n\n${body}` : body;
}

export function winBackMessage(m: Member) {
  return `Hi ${m.name.split(" ")[0]}, we miss you at V Fitness! Your next session is on us — just show this message at the desk this week.`;
}
