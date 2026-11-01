"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

import { useLead } from "./lead-modal";
import { billingMeta, plans, type Billing } from "@/lib/site";

const cycles: Billing[] = ["monthly", "quarterly", "annual"];
const fmt = (n: number) => n.toLocaleString("en-AE", { maximumFractionDigits: 0 });

export function PricingCards() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const { open } = useLead();

  return (
    <div>
      <div className="flex justify-center">
        <div role="radiogroup" aria-label="Billing period" className="relative inline-grid grid-cols-3 rounded-full border border-line bg-ink-2 p-1.5">
          {cycles.map((c) => {
            const active = c === billing;
            return (
              <button
                key={c}
                role="radio"
                aria-checked={active}
                onClick={() => setBilling(c)}
                className="relative rounded-full px-4 py-2.5 text-sm font-semibold sm:px-7"
              >
                {active && (
                  <motion.span
                    layoutId="billing-pill"
                    className="absolute inset-0 rounded-full bg-brand"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className={`relative ${active ? "text-ink" : "text-slate-400 hover:text-white"}`}>
                  {billingMeta[c].label}
                </span>
                {c === "annual" && (
                  <span className="absolute -right-1 -top-3 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-ink">
                    BEST
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((plan, i) => {
          const total = plan.price[billing];
          const months = billingMeta[billing].months;
          const perMonth = total / months;
          const saving = Math.round((1 - perMonth / plan.price.monthly) * 100);
          const reg = plan.registrationFee[billing];

          return (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className={`relative flex flex-col rounded-3xl border p-7 sm:p-8 ${
                plan.featured
                  ? "border-brand/60 bg-gradient-to-b from-brand/15 to-ink-2 shadow-[0_30px_80px_-30px_rgba(34,211,238,0.6)]"
                  : "border-line bg-ink-2"
              }`}
              aria-labelledby={`plan-${plan.id}`}
            >
              {plan.featured && (
                <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden /> Most popular
                </span>
              )}
              <h3 id={`plan-${plan.id}`} className="text-3xl font-bold uppercase">{plan.name}</h3>
              <p className="mt-2 min-h-[3rem] text-sm text-slate-400">{plan.summary}</p>

              <div className="mt-6 min-h-[7.5rem]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={billing}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-slate-400">AED</span>
                      <span className="font-display text-6xl font-extrabold text-white tabular-nums">{fmt(total)}</span>
                      <span className="text-sm text-slate-500">/ {months === 1 ? "month" : `${months} months`}</span>
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      {months > 1 ? <>≈ AED {fmt(perMonth)}/month · </> : null}
                      {billingMeta[billing].note}
                    </p>
                    {saving > 0 && (
                      <p className="mt-2 inline-block rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                        Save {saving}% vs monthly
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden /> {f}
                  </li>
                ))}
                <li className="flex gap-3 text-slate-500">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" aria-hidden />
                  {reg > 0 ? `AED ${reg} registration fee` : "No registration fee"} · + 5% VAT
                </li>
              </ul>

              <button
                onClick={() => open({ plan: `${plan.name} (${billingMeta[billing].label})` })}
                className={`mt-8 w-full ${plan.featured ? "btn-primary" : "btn-ghost"}`}
              >
                Start with a free trial
              </button>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
