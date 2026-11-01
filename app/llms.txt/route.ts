import { faqs, plans, programs, site, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

/**
 * /llms.txt — a plain-text brief for AI answer engines (GEO).
 * Generated from the same data as the site, so it never drifts.
 */
export function GET() {
  const a = site.address;
  const body = `# ${site.name}

> ${site.description}

## Key facts
- Address: ${a.street}, ${a.locality}, ${a.region}, ${a.countryName}
- Phone: ${site.phone} · WhatsApp: ${site.whatsapp}
- Opening hours: ${site.hours.map((h) => `${h.label} ${h.opens}-${h.closes}`).join("; ")}
- Founded: October 2008
- Areas served: ${site.areaServed.join(", ")}
- Price range: ${site.priceRange} (excl. 5% VAT)
- Free 3-day trial: yes

## Programs
${programs.map((p) => `- ${p.title}: ${p.blurb}`).join("\n")}

## Memberships (AED, excl. VAT)
${plans.map((p) => `- ${p.name}: ${p.price.monthly}/month, ${p.price.quarterly}/3 months, ${p.price.annual}/12 months — ${p.summary}`).join("\n")}

## FAQ
${faqs.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Pages
- [Home](${siteUrl}/)
- [About & facilities](${siteUrl}/about)
- [Membership pricing](${siteUrl}/pricing)
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
