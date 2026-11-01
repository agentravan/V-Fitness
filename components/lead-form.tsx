"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, MessageCircle, Send } from "lucide-react";

import { site } from "@/lib/site";

export type LeadPrefill = { goal?: string; program?: string; plan?: string };

type Status = "idle" | "sending" | "done" | "error";

const phoneOk = (v: string) => /^\+?[0-9\s()-]{7,18}$/.test(v.trim());
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export function LeadForm({ prefill, compact = false, onDone }: { prefill?: LeadPrefill; compact?: boolean; onDone?: () => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedName, setSubmittedName] = useState("");
  const uid = useId();
  const fid = (n: string) => `${uid}-${n}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    // Honeypot: bots fill hidden fields.
    if (data.company) return;

    const errs: Record<string, string> = {};
    if (!data.name || data.name.trim().length < 2) errs.name = "Please enter your name.";
    if (!emailOk(data.email || "")) errs.email = "Enter a valid email address.";
    if (!phoneOk(data.phone || "")) errs.phone = "Enter a valid phone number.";
    if (!data.location) errs.location = "Choose a location.";
    if (!data.timeSlot) errs.timeSlot = "Choose a time slot.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...prefill, source: typeof window !== "undefined" ? window.location.pathname : "" }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSubmittedName(data.name.split(" ")[0]);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  const waText = encodeURIComponent(
    `Hi V Fitness! I'd like to book my free 3-day trial.${prefill?.program ? ` Interested in: ${prefill.program}.` : ""}`,
  );

  return (
    <AnimatePresence mode="wait">
      {status === "done" ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 py-8 text-center"
          role="status"
        >
          <CheckCircle2 className="h-14 w-14 text-brand" aria-hidden />
          <h3 className="text-3xl font-semibold">You&apos;re in, {submittedName}!</h3>
          <p className="max-w-sm text-slate-400">
            Our team will call or WhatsApp you within one working day to confirm your free 3-day trial.
          </p>
          <a href={`https://wa.me/${site.whatsappE164}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <MessageCircle className="h-4 w-4" aria-hidden /> Fast-track on WhatsApp
          </a>
          {onDone && (
            <button onClick={onDone} className="text-sm text-slate-500 underline-offset-4 hover:underline">
              Close
            </button>
          )}
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}
          aria-label="Book a free 3-day trial"
        >
          <Field id={fid("name")} label="Full name" error={errors.name}>
            <input id={fid("name")} name="name" autoComplete="name" className="field" placeholder="Your name" />
          </Field>
          <Field id={fid("email")} label="Email" error={errors.email}>
            <input id={fid("email")} name="email" type="email" autoComplete="email" className="field" placeholder="you@example.com" />
          </Field>
          <Field id={fid("phone")} label="Phone / WhatsApp" error={errors.phone}>
            <input id={fid("phone")} name="phone" type="tel" autoComplete="tel" inputMode="tel" className="field" placeholder="+971 5X XXX XXXX" />
          </Field>
          <Field id={fid("location")} label="Preferred location" error={errors.location}>
            <select id={fid("location")} name="location" className="field" defaultValue={site.locations[0]}>
              {site.locations.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="Preferred time slot" error={errors.timeSlot} className={compact ? "" : "sm:col-span-2"}>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Preferred time slot">
              {site.timeSlots.map((t, i) => (
                <label key={t} className="cursor-pointer">
                  <input type="radio" name="timeSlot" value={t} defaultChecked={i === 3} className="peer sr-only" />
                  <span className="inline-block rounded-full border border-line px-3.5 py-2 text-sm text-slate-300 transition-colors peer-checked:border-brand peer-checked:bg-brand/15 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </Field>

          <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          {prefill?.program && (
            <p className={`rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-cyan-100 ${compact ? "" : "sm:col-span-2"}`}>
              Recommended for you: <strong className="text-white">{prefill.program}</strong>
              {prefill.goal ? ` · goal: ${prefill.goal}` : ""}
            </p>
          )}

          <div className={`flex flex-col gap-3 ${compact ? "" : "sm:col-span-2"}`}>
            <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:opacity-70">
              {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
              {status === "sending" ? "Booking…" : "Claim my free 3-day trial"}
            </button>
            {status === "error" && (
              <p className="text-center text-sm text-rose-400" role="alert">
                Something went wrong. Please try again or message us on WhatsApp.
              </p>
            )}
            <p className="text-center text-xs text-slate-500">No payment needed. We&apos;ll only use your details to arrange your visit.</p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function Field({
  id,
  label,
  error,
  children,
  className = "",
}: {
  id?: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {id ? (
        <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </label>
      ) : (
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
      )}
      {children}
      {error && (
        <p className="text-xs text-rose-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
