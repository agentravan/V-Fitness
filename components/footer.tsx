import Link from "next/link";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "./social-icons";

import { Logo } from "./logo";
import { nav, programs, site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-line bg-ink-2" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        V Fitness contact details and site links
      </h2>
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-slate-400">
            Dubai International City&apos;s friendly, judgement-free gym since October 2008.
          </p>
          <div className="flex gap-2">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="V Fitness on Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-line hover:border-brand hover:text-brand">
              <InstagramIcon />
            </a>
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="V Fitness on Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-line hover:border-brand hover:text-brand">
              <FacebookIcon />
            </a>
            <a href={`https://wa.me/${site.whatsappE164}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with V Fitness on WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-line hover:border-brand hover:text-brand">
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Explore</h3>
          <ul className="space-y-2.5">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-slate-300 hover:text-brand">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Programs</h3>
          <ul className="space-y-2.5">
            {programs.map((p) => (
              <li key={p.key}>
                <Link href="/#programs" className="text-slate-300 hover:text-brand">{p.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <address className="space-y-3 text-sm not-italic text-slate-300">
          <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Visit us</h3>
          <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-brand">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
            <span>
              {site.address.street},<br />
              {site.address.locality}, {site.address.region}, {site.address.countryName}
            </span>
          </a>
          <a href={`tel:${site.phoneE164}`} className="flex gap-3 hover:text-brand">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
            {site.phone}
          </a>
          <div className="flex gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
            <ul>
              {site.hours.map((h) => (
                <li key={h.label}>
                  {h.label}: {h.opens} – {h.closes}
                </li>
              ))}
            </ul>
          </div>
        </address>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-slate-500 sm:flex-row">
          <p>© {year} {site.name}. All rights reserved.</p>
          <p>Prices exclude 5% VAT.</p>
        </div>
      </div>
    </footer>
  );
}
