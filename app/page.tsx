import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Droplets, ShieldCheck, Users } from "lucide-react";

import { Hero } from "@/components/home/hero";
import { Programs } from "@/components/home/programs";
import { Calculator } from "@/components/home/calculator";
import { Testimonials } from "@/components/home/testimonials";
import { DisciplineMarquee, Faq, TrialSection } from "@/components/home/sections";
import { RevealItem, Stagger } from "@/components/motion";
import { faqSchema, jsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const pillars = [
  { icon: ShieldCheck, title: "Judgement-free zone", text: "A welcoming community where every fitness level feels respected." },
  { icon: Droplets, title: "Spotless club", text: "From the lobby to the showers, cleanliness is a top priority — every day." },
  { icon: BadgeCheck, title: "Brand-name equipment", text: "High-quality cardio and strength machines plus a full free-weight area." },
  { icon: Users, title: "Staff who care", text: "Coaches on the floor who know your name and help whenever you ask." },
];

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema())} />

      <Hero />
      <DisciplineMarquee />

      <section aria-labelledby="why-title" className="container-x pt-20 md:pt-28">
        <h2 id="why-title" className="sr-only">Why train at V Fitness</h2>
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, title, text }) => (
            <RevealItem key={title}>
              <article className="h-full rounded-2xl border border-line/70 bg-ink-2/60 p-5">
                <Icon className="h-6 w-6 text-brand" aria-hidden />
                <h3 className="mt-4 font-sans text-base font-semibold text-white">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{text}</p>
              </article>
            </RevealItem>
          ))}
        </Stagger>
      </section>

      <Programs />
      <Calculator />
      <Testimonials />

      <section aria-labelledby="price-teaser" className="container-x py-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-line bg-gradient-to-r from-brand/15 via-ink-2 to-rose/10 p-8 md:flex-row md:items-center md:p-10">
          <div>
            <h2 id="price-teaser" className="text-4xl font-extrabold uppercase italic md:text-5xl">
              Memberships from <span className="text-gradient">AED 150</span>
            </h2>
            <p className="mt-2 text-slate-400">Monthly, quarterly and annual plans. Save up to 40% when you commit for a year.</p>
          </div>
          <Link href="/pricing" className="btn-primary shrink-0">
            Compare plans <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      <TrialSection />
      <Faq />
    </>
  );
}
