import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Hero } from "@/components/home/hero";
import { Programs } from "@/components/home/programs";
import { Calculator } from "@/components/home/calculator";
import { Testimonials } from "@/components/home/testimonials";
import { DisciplineMarquee, Faq, TrialSection } from "@/components/home/sections";
import { Campaign, Experience, Loop } from "@/components/home/experience";
import { faqSchema, jsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};


export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema())} />

      <Hero />
      <DisciplineMarquee />

      <Experience />
      <Programs />
      <Loop />
      <Calculator />
      <Testimonials />

      <section aria-labelledby="price-teaser" className="container-x py-8">
        <div className="flex flex-col items-start justify-between gap-6 neon-border rounded-3xl bg-gradient-to-r from-brand/15 via-ink-2 to-electric/20 p-8 md:flex-row md:items-center md:p-10">
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

      <Campaign />
      <TrialSection />
      <Faq />
    </>
  );
}
