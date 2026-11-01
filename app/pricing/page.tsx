import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";

import { PricingCards } from "@/components/pricing-cards";
import { Reveal } from "@/components/motion";
import { breadcrumbSchema, jsonLd } from "@/lib/schema";
import { faqs, plans, site, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gym Membership Prices — Monthly, Quarterly & Annual",
  description:
    "V Fitness membership rates in International City, Dubai: from AED 150/month, AED 599 for 3 months or AED 1,068 for 12 months. Compare Essential, Performance and Elite Coaching plans.",
  alternates: { canonical: "/pricing" },
  openGraph: { url: `${siteUrl}/pricing`, title: "V Fitness Membership Prices", description: "Gym memberships in International City, Dubai from AED 150/month." },
};

const matrix: { feature: string; values: (boolean | string)[] }[] = [
  { feature: "Gym floor, cardio & free weights", values: [true, true, true] },
  { feature: "Locker rooms & showers", values: [true, true, true] },
  { feature: "Fitness assessment", values: ["On joining", "Monthly", "Weekly"] },
  { feature: "Group classes (HIIT, CrossFit-style, Zumba, yoga, MMA)", values: [false, "Unlimited", "Unlimited"] },
  { feature: "Personal-training sessions", values: [false, false, "8 / month"] },
  { feature: "Custom program & nutrition plan", values: [false, false, true] },
  { feature: "Guest pass", values: [false, false, "1 / month"] },
];

const pricingFaqs = faqs.filter((f) => /much|trial|personal/i.test(f.q));

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Memberships", path: "/pricing" }]))}
      />

      <section aria-labelledby="pricing-title" className="relative overflow-hidden pb-16 pt-14 md:pt-20">
        <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 -z-10" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center">Memberships</p>
            <h1 id="pricing-title" className="mt-3 text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold uppercase italic leading-[0.9]">
              Simple pricing. <span className="text-gradient">Serious results.</span>
            </h1>
            <p className="mt-5 text-lg text-slate-400">
              Choose how you train and how you pay. Every plan starts with a free 3-day trial at our {site.address.locality} club.
            </p>
          </Reveal>
          <div className="mt-12">
            <PricingCards />
          </div>
          <p className="mt-8 text-center text-xs text-slate-500">
            All prices in AED and exclusive of 5% VAT. Monthly plans renew automatically; quarterly and annual plans are one-time payments.
          </p>
        </div>
      </section>

      <section aria-labelledby="compare-title" className="container-x py-16">
        <Reveal>
          <h2 id="compare-title" className="text-center text-4xl font-extrabold uppercase italic md:text-5xl">
            Compare <span className="text-gradient">plans</span>
          </h2>
          <div className="mt-10 overflow-x-auto rounded-3xl border border-line">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">Feature comparison of V Fitness membership plans</caption>
              <thead className="bg-ink-2">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium text-slate-400">Feature</th>
                  {plans.map((p) => (
                    <th key={p.id} scope="col" className="px-6 py-4 font-display text-xl font-bold uppercase text-white">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {matrix.map((row) => (
                  <tr key={row.feature} className="hover:bg-white/[0.02]">
                    <th scope="row" className="px-6 py-4 font-normal text-slate-300">{row.feature}</th>
                    {row.values.map((v, i) => (
                      <td key={i} className="px-6 py-4">
                        {v === true ? (
                          <Check className="h-5 w-5 text-brand" aria-label="Included" />
                        ) : v === false ? (
                          <Minus className="h-5 w-5 text-slate-600" aria-label="Not included" />
                        ) : (
                          <span className="text-slate-200">{v}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="pricing-faq" className="container-x py-12">
        <h2 id="pricing-faq" className="text-center text-4xl font-extrabold uppercase italic">Pricing questions</h2>
        <div className="mx-auto mt-8 max-w-3xl divide-y divide-line rounded-3xl border border-line bg-ink-2/60">
          {pricingFaqs.map((f) => (
            <article key={f.q} className="px-6 py-5">
              <h3 className="font-sans text-base font-semibold text-white">{f.q}</h3>
              <p className="mt-2 text-slate-400">{f.a}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
