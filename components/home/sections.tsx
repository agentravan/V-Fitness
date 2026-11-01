import { ChevronDown, Clock, MapPin, MessageCircle, Phone } from "lucide-react";

import { LeadForm } from "@/components/lead-form";
import { Reveal } from "@/components/motion";
import { disciplines, faqs, site } from "@/lib/site";

export function DisciplineMarquee() {
  const items = [...disciplines, ...disciplines];
  return (
    <section aria-label="Training disciplines" className="relative border-y border-line bg-ink-2 py-6">
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <ul className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
          {items.map((d, i) => (
            <li key={i} aria-hidden={i >= disciplines.length} className="flex items-center gap-10 text-3xl font-semibold text-slate-200">
              {d}
              <span className="text-brand" aria-hidden>✦</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="container-x scroll-mt-24 py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title" className="mt-3 section-title">
            Good <span className="text-gradient">questions</span>
          </h2>
          <p className="mt-4 text-slate-400">
            Still unsure? Call <a className="text-white underline-offset-4 hover:underline" href={`tel:${site.phoneE164}`}>{site.phone}</a> or message us on WhatsApp.
          </p>
        </Reveal>
        <Reveal className="divide-y divide-line rounded-3xl border border-line bg-ink-2/60">
          {faqs.map((f) => (
            <details key={f.q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <h3 className="font-sans text-base font-semibold text-white sm:text-lg">{f.q}</h3>
                <ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <p className="mt-3 leading-relaxed text-slate-400">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function TrialSection() {
  return (
    <section id="trial" aria-labelledby="trial-title" className="container-x scroll-mt-24 py-12">
      <Reveal className="relative overflow-hidden rounded-3xl border border-line bg-ink-2 p-6 sm:p-10 lg:p-14">
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-electric/20 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Get in touch</p>
            <h2 id="trial-title" className="mt-3 section-title">
              Start with a free <span className="text-gradient">3-day pass</span>
            </h2>
            <p className="mt-4 text-slate-400">
              Full gym access, a fitness assessment and a coach-led walkthrough. No card, no contract.
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-brand" aria-hidden />
                <span>{site.address.street}, {site.address.locality}, {site.address.region}</span>
              </li>
              <li className="flex gap-3">
                <Clock className="h-5 w-5 shrink-0 text-brand" aria-hidden />
                <span>{site.hours.map((h) => `${h.label} ${h.opens}–${h.closes}`).join(" · ")}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 shrink-0 text-brand" aria-hidden />
                <a href={`tel:${site.phoneE164}`} className="hover:text-brand">{site.phone}</a>
              </li>
              <li className="flex gap-3">
                <MessageCircle className="h-5 w-5 shrink-0 text-brand" aria-hidden />
                <a href={`https://wa.me/${site.whatsappE164}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                  WhatsApp {site.whatsapp}
                </a>
              </li>
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-ink/70 p-6 backdrop-blur sm:p-8">
            <LeadForm />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
