import type { Metadata } from "next";

import { AppTeaser, ClubGallery, ClubHero, Ecosystem, Philosophy, Refuel, SmartClub, TrainYourWay } from "@/components/home/club";
import { Faq, TrialSection } from "@/components/home/sections";
import { faqSchema, jsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema())} />
      <ClubHero />
      <Ecosystem />
      <TrainYourWay />
      <Refuel />
      <SmartClub />
      <ClubGallery />
      <Philosophy />
      <AppTeaser />
      <TrialSection />
      <Faq />
    </>
  );
}
