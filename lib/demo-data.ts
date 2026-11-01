/**
 * Deterministic demo dataset for the gym-management portal.
 * Generated on the client relative to "today", so the demo always looks current.
 *
 * Shape of the default dataset:
 *  - 236 active + 12 expiring within 7 days  = 248 active members
 *  - 26 expired members (for the "Expired" filter)
 *  - 42 members already checked in today
 */

export type PlanType = "Monthly" | "Quarterly" | "Annual" | "Personal Training";
export type MemberStatus = "Active" | "Expiring Soon" | "Expired";
export type Channel = "WhatsApp" | "SMS" | "Email";

export type Member = {
  id: string;
  name: string;
  phone: string;
  email: string;
  plan: PlanType;
  joinDate: string; // ISO yyyy-mm-dd
  expiryDate: string; // ISO yyyy-mm-dd
  presentToday: boolean;
  lastReminder?: { channel: Channel; at: number };
};

export const DEMO_CREDENTIALS = { email: "demo@vfitness.com", password: "demo" } as const;

export const DEMO_KPIS = {
  monthlyRevenue: 12450,
  revenueChangePct: 8.2,
  currency: "USD",
} as const;

const PLAN_DAYS: Record<PlanType, number> = {
  Monthly: 30,
  Quarterly: 90,
  Annual: 365,
  "Personal Training": 30,
};

export const PLAN_PRICE_USD: Record<PlanType, number> = {
  Monthly: 45,
  Quarterly: 120,
  Annual: 390,
  "Personal Training": 245,
};

const FIRST = [
  "Aarav", "Fatima", "Omar", "Priya", "Daniel", "Aisha", "Rahul", "Sara", "Yusuf", "Maria", "Arjun", "Layla", "Ivan",
  "Noor", "Kiran", "Hassan", "Elena", "Zain", "Meera", "Ali", "Chloe", "Rohan", "Mariam", "Lucas", "Ananya", "Khalid",
  "Sofia", "Vikram", "Huda", "James", "Nadia", "Faisal", "Grace", "Imran", "Leila", "Marco", "Divya", "Tariq", "Amira", "Joel",
];
const LAST = [
  "Sharma", "Al Mansoori", "Khan", "Fernandes", "Rahman", "Petrov", "Nair", "Haddad", "Iyer", "Santos", "Qureshi",
  "Mehta", "Ibrahim", "Kovacs", "Pillai", "Saleh", "Rossi", "Menon", "Farouk", "Reyes", "Chopra", "Aziz", "Thomas", "Hashemi",
];

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

export const toISO = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

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

/** Whole days from today until the expiry date (negative = already expired). */
export const daysLeft = (expiryISO: string, today = startOfDay()) =>
  Math.round((parseISO(expiryISO).getTime() - today.getTime()) / 86_400_000);

export function statusOf(m: Member, today = startOfDay()): MemberStatus {
  const d = daysLeft(m.expiryDate, today);
  if (d < 0) return "Expired";
  if (d < 7) return "Expiring Soon";
  return "Active";
}

export function generateMembers(today = startOfDay()): Member[] {
  const rand = mulberry32(2008);
  const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];
  const used = new Set<string>();

  const makeName = () => {
    for (;;) {
      const n = `${pick(FIRST)} ${pick(LAST)}`;
      if (!used.has(n)) {
        used.add(n);
        return n;
      }
    }
  };

  const planFor = (): PlanType => {
    const r = rand();
    if (r < 0.42) return "Monthly";
    if (r < 0.7) return "Quarterly";
    if (r < 0.9) return "Annual";
    return "Personal Training";
  };

  const members: Member[] = [];
  const push = (expiryOffset: number) => {
    const plan = planFor();
    const name = makeName();
    const expiry = addDays(today, expiryOffset);
    // Members renew, so join date can be several cycles before the current expiry.
    const cycles = 1 + Math.floor(rand() * 4);
    const join = addDays(expiry, -PLAN_DAYS[plan] * cycles);
    const handle = name.toLowerCase().replace(/[^a-z]+/g, ".");
    members.push({
      id: `M${String(1001 + members.length)}`,
      name,
      phone: `+971 5${Math.floor(rand() * 9)} ${String(Math.floor(rand() * 900) + 100)} ${String(Math.floor(rand() * 9000) + 1000)}`,
      email: `${handle}@example.com`,
      plan,
      joinDate: toISO(join),
      expiryDate: toISO(expiry),
      presentToday: false,
    });
  };

  // 12 expiring within 7 days: spread across 0..6 days.
  [0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6, 6].forEach(push);
  // 236 healthy actives.
  for (let i = 0; i < 236; i++) push(7 + Math.floor(rand() * 330));
  // 26 expired.
  for (let i = 0; i < 26; i++) push(-1 - Math.floor(rand() * 60));

  // 42 check-ins today among non-expired members.
  const activeIdx = members.map((m, i) => (daysLeft(m.expiryDate, today) >= 0 ? i : -1)).filter((i) => i >= 0);
  for (let k = activeIdx.length - 1; k > 0; k--) {
    const j = Math.floor(rand() * (k + 1));
    [activeIdx[k], activeIdx[j]] = [activeIdx[j], activeIdx[k]];
  }
  activeIdx.slice(0, 42).forEach((i) => (members[i].presentToday = true));

  // Shuffle so the table isn't grouped by status.
  for (let k = members.length - 1; k > 0; k--) {
    const j = Math.floor(rand() * (k + 1));
    [members[k], members[j]] = [members[j], members[k]];
  }
  return members;
}

/** Attendance for the previous 6 days (today is computed live). */
export function pastWeekAttendance(today = startOfDay()) {
  const rand = mulberry32(42);
  return Array.from({ length: 6 }, (_, i) => {
    const d = addDays(today, -(6 - i));
    const weekend = d.getDay() === 0;
    return { date: d, count: Math.round((weekend ? 30 : 44) + rand() * 18) };
  });
}

export function reminderMessage(m: Member, channel: Channel, today = startOfDay()) {
  const d = daysLeft(m.expiryDate, today);
  const first = m.name.split(" ")[0];
  const when = d < 0 ? `expired ${Math.abs(d)} day${Math.abs(d) === 1 ? "" : "s"} ago` : d === 0 ? "expires today" : `expires in ${d} day${d === 1 ? "" : "s"}`;
  const body = `Hi ${first}, your V Fitness ${m.plan} membership ${when}. Renew now to keep your streak going 💪 Reply YES and we'll lock in your current rate.`;
  return channel === "Email" ? `Subject: Your V Fitness membership — renew today\n\n${body}` : body;
}
