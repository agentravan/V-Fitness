import { faqs, plans, programs, site, siteUrl } from "./site";

/**
 * JSON-LD graph for local SEO and Generative Engine Optimization.
 * One connected @graph lets Google, Bing and AI answer engines resolve
 * the organisation, the physical gym, the website and its offers as one entity.
 */
export function organizationGraph() {
  const gymId = `${siteUrl}/#gym`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["ExerciseGym", "SportsActivityLocation", "HealthClub", "LocalBusiness"],
        "@id": gymId,
        name: site.name,
        legalName: site.legalName,
        description: site.description,
        url: siteUrl,
        logo: `${siteUrl}/icon.svg`,
        image: `${siteUrl}/opengraph-image`,
        telephone: site.phoneE164,
        ...(site.email ? { email: site.email } : {}),
        foundingDate: site.foundingDate,
        priceRange: site.priceRange,
        currenciesAccepted: site.currency,
        paymentAccepted: "Cash, Credit Card, Debit Card",
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: site.address.locality,
          addressRegion: site.address.region,
          addressCountry: site.address.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: site.geo.lat,
          longitude: site.geo.lng,
        },
        hasMap: site.mapsUrl,
        openingHoursSpecification: site.hours.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
          opens: h.opens,
          closes: h.closes,
        })),
        areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
        sameAs: Object.values(site.social),
        amenityFeature: [
          "Free weights",
          "Cardio machines",
          "Locker rooms",
          "Showers",
          "Group exercise studio",
          "Personal training",
        ].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
        knowsAbout: programs.map((p) => p.title),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Memberships & Training",
          itemListElement: plans.map((p) => ({
            "@type": "Offer",
            name: `${p.name} membership (monthly)`,
            description: p.summary,
            url: `${siteUrl}/pricing`,
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: p.price.monthly,
              priceCurrency: site.currency,
              unitCode: "MON",
              valueAddedTaxIncluded: false,
            },
            availability: "https://schema.org/InStock",
          })),
        },
        potentialAction: {
          "@type": "ReserveAction",
          name: "Book a free 3-day trial",
          target: `${siteUrl}/#trial`,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: site.name,
        inLanguage: "en-AE",
        publisher: { "@id": gymId },
      },
    ],
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${siteUrl}${it.path}`,
    })),
  };
}

/** Serialises JSON-LD safely for inline <script> injection. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
