import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LeadProvider } from "@/components/lead-modal";
import { MarketingOnly } from "@/components/marketing-only";
import { organizationGraph, jsonLd } from "@/lib/schema";
import { site, siteUrl } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const title = "V Fitness | Gym in International City, Dubai — Strength, CrossFit, HIIT & PT";
const description =
  "Train at V Fitness, Dubai International City's welcoming gym since 2008. Strength training, CrossFit-style conditioning, HIIT, MMA, yoga and personal training. Memberships from AED 150/month — book a free 3-day trial.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | V Fitness Dubai" },
  description,
  applicationName: site.name,
  keywords: [
    "gym International City Dubai",
    "gym Spain Cluster",
    "V Fitness",
    "personal trainer Dubai",
    "CrossFit International City",
    "HIIT classes Dubai",
    "cheap gym membership Dubai",
    "gym near Dubai Silicon Oasis",
    "MMA gym Dubai",
    "ladies and men gym Dubai",
  ],
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  publisher: site.name,
  category: "fitness",
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: siteUrl,
    siteName: site.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  other: {
    "geo.region": "AE-DU",
    "geo.placename": "International City, Dubai",
    "geo.position": `${site.geo.lat};${site.geo.lng}`,
    ICBM: `${site.geo.lat}, ${site.geo.lng}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh bg-ink antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationGraph())} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <LeadProvider>
          <MarketingOnly>
            <Header />
          </MarketingOnly>
          <main id="main" className="pt-16 md:pt-[76px]">{children}</main>
          <MarketingOnly>
            <Footer />
          </MarketingOnly>
        </LeadProvider>
      </body>
    </html>
  );
}
