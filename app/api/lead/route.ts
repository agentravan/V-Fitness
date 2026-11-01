import { NextResponse } from "next/server";

// Uses only Web-standard APIs (Request/Response/fetch), so it runs on Node or Edge.

type Lead = {
  name: string;
  email: string;
  phone: string;
  location: string;
  timeSlot: string;
  goal?: string;
  program?: string;
  plan?: string;
  source?: string;
};

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (clean(body.company)) return NextResponse.json({ ok: true }); // honeypot

  const lead: Lead = {
    name: clean(body.name, 120),
    email: clean(body.email, 160).toLowerCase(),
    phone: clean(body.phone, 30),
    location: clean(body.location),
    timeSlot: clean(body.timeSlot),
    goal: clean(body.goal) || undefined,
    program: clean(body.program) || undefined,
    plan: clean(body.plan) || undefined,
    source: clean(body.source) || undefined,
  };

  const errors: string[] = [];
  if (lead.name.length < 2) errors.push("name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) errors.push("email");
  if (!/^\+?[0-9\s()-]{7,18}$/.test(lead.phone)) errors.push("phone");
  if (!lead.location) errors.push("location");
  if (!lead.timeSlot) errors.push("timeSlot");
  if (errors.length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, receivedAt: new Date().toISOString() }),
      });
    } catch {
      return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
    }
  } else {
    // No webhook configured: visible in Vercel function logs.
    console.log("[lead]", JSON.stringify(lead));
  }

  return NextResponse.json({ ok: true });
}
