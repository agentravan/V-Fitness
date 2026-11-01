import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Bike, Dumbbell, Flame, HeartPulse, Lock, ShowerHead, Sparkles, Swords, Target, Trophy, Users,
} from "lucide-react";

import { Reveal, RevealItem, Stagger } from "@/components/motion";
import { breadcrumbSchema, jsonLd } from "@/lib/schema";
import { disciplines, gallery, personalTrainingFocus, photos, site, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About V Fitness & Our Facilities in International City, Dubai",
  description:
    "Since 2008, V Fitness has been International City's welcoming gym: brand-name cardio and strength equipment, functional training space, MMA, clean locker rooms and qualified personal trainers.",
  alternates: { canonical: "/about" },
  openGraph: { url: `${siteUrl}/about`, title: "About V Fitness Dubai", description: "Our story, equipment, trainers and training spaces." },
};

const timeline = [
  { year: "Oct 2008", title: "Doors open", text: "V Fitness opens in International City with one mission: a gym where everyone feels welcome." },
  { year: "Since", title: "Constant evolution", text: "Much has changed since those early days — the club has evolved into a state-of-the-art facility with brand-name equipment." },
  { year: "Every day", title: "Clean & welcoming", text: "From the lobby and machines to the locker rooms and showers, a clean club remains a top priority." },
  { year: "Today", title: "Coaching-first", text: "Personal training, nutrition advice and structured programs for every goal — from first workout to on-screen roles." },
];

const facilities = [
  { icon: Dumbbell, title: "Free-weight zone", text: "Dumbbells, barbells, plates, racks and benches for serious strength work." },
  { icon: Bike, title: "Cardio deck", text: "Treadmills, bikes, cross-trainers and rowers from leading brands." },
  { icon: Flame, title: "Functional area", text: "Open turf-style space for HIIT, CrossFit-style WODs, sleds and kettlebells." },
  { icon: Swords, title: "MMA & combat", text: "Space for martial arts, self-defence drills and pad work." },
  { icon: HeartPulse, title: "Studio classes", text: "Yoga, Zumba, aerobics, meditation and flexibility sessions." },
  { icon: ShowerHead, title: "Showers", text: "Clean, well-maintained showers — hygiene is a daily priority." },
  { icon: Lock, title: "Locker rooms", text: "Secure lockers so you can come straight from work." },
  { icon: Users, title: "Floor staff", text: "Friendly team on hand for equipment help and form checks." },
];

const coaches = [
  { icon: Trophy, role: "Strength & Physique", focus: "Muscle building, bodybuilding, powerlifting technique" },
  { icon: Target, role: "Fat-Loss & Conditioning", focus: "HIIT, circuits, weight management, nutrition habits" },
  { icon: Swords, role: "Combat & Performance", focus: "MMA, self-defence, speed, strength and power" },
  { icon: Sparkles, role: "Mobility & Wellness", focus: "Yoga, flexibility, meditation, injury-smart training" },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About & Facilities", path: "/about" }]))}
      />

      {/* Intro */}
      <section aria-labelledby="about-title" className="relative overflow-hidden pb-16 pt-14 md:pt-20">
        <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 -z-10" />
        <div aria-hidden className="pointer-events-none absolute -right-32 top-0 -z-10 h-[460px] w-[460px] rounded-full bg-electric/20 blur-[120px]" />
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">About V Fitness</p>
            <h1 id="about-title" className="mt-3 text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold uppercase italic leading-[0.9]">
              Built for <span className="text-gradient">every body</span> since 2008
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              V Fitness opened in October 2008 and has grown into a state-of-the-art club in {site.address.locality}, Dubai —
              where the right atmosphere, guidance and equipment help everyone enjoy the journey to their goal.
            </p>
            <p className="mt-4 leading-relaxed text-slate-400">
              We&apos;re known as a judgement-free community: comfortable, safe and energetic, where every member is accepted and
              respected regardless of fitness level.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/pricing" className="btn-primary">See memberships <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">Get directions</a>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="grid grid-cols-2 gap-4">
            {[photos.athleteMan, photos.trainers, photos.athleteWoman, photos.staff].map((g, i) => (
              <figure key={g.src} className={`relative overflow-hidden rounded-3xl border border-brand/25 bg-ink-3 shadow-[0_0_40px_-18px_rgba(34,211,238,0.8)] ${i % 2 ? "mt-10 aspect-[3/4]" : "aspect-[3/4]"}`}>
                <Image src={g.src} alt={g.alt} fill sizes="(min-width:1024px) 25vw, 45vw" className="object-cover transition-transform duration-700 hover:scale-105" />
              </figure>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Facilities */}
      <section aria-labelledby="facilities-title" className="container-x py-16 md:py-24">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Facilities</p>
          <h2 id="facilities-title" className="mt-3 text-5xl font-extrabold uppercase italic md:text-6xl">
            Everything you need. <span className="text-gradient">Nothing you don&apos;t.</span>
          </h2>
        </Reveal>
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facilities.map(({ icon: Icon, title, text }) => (
            <RevealItem key={title}>
              <article className="group card h-full p-6 transition-colors hover:border-brand/50">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-2xl font-bold uppercase">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
              </article>
            </RevealItem>
          ))}
        </Stagger>
      </section>

      {/* Trainers */}
      <section aria-labelledby="trainers-title" className="border-y border-line bg-ink-2 py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="eyebrow">Personal training</p>
            <h2 id="trainers-title" className="mt-3 text-5xl font-extrabold uppercase italic md:text-6xl">
              Coaches who <span className="text-gradient">teach</span>
            </h2>
            <p className="mt-5 leading-relaxed text-slate-400">
              Knowledge is power. Our qualified personal trainers teach you proper form, how to use every piece of equipment and
              which exercises work best for your body — so the plan is made for you, not copied from the internet.
            </p>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {personalTrainingFocus.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden /> {f}
                </li>
              ))}
            </ul>
          </Reveal>
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {coaches.map(({ icon: Icon, role, focus }) => (
              <RevealItem key={role}>
                <article className="card relative h-full overflow-hidden p-6">
                  <div aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand/15 blur-2xl" />
                  <Icon className="h-7 w-7 text-brand" aria-hidden />
                  <h3 className="mt-5 text-2xl font-bold uppercase">{role}</h3>
                  <p className="mt-2 text-sm text-slate-400">{focus}</p>
                </article>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Story */}
      <section aria-labelledby="story-title" className="container-x py-16 md:py-24">
        <Reveal>
          <h2 id="story-title" className="text-center text-5xl font-extrabold uppercase italic md:text-6xl">
            Our <span className="text-gradient">story</span>
          </h2>
        </Reveal>
        <ol className="relative mx-auto mt-12 max-w-3xl border-l border-line pl-8">
          {timeline.map((t, i) => (
            <li key={t.year} className="relative pb-10 last:pb-0">
              <Reveal delay={i * 0.05}>
                <span className="absolute -left-[41px] top-1 grid h-5 w-5 place-items-center rounded-full border-4 border-ink bg-brand" aria-hidden />
                <p className="font-display text-xl font-bold text-brand">{t.year}</p>
                <h3 className="mt-1 text-3xl font-bold uppercase">{t.title}</h3>
                <p className="mt-2 text-slate-400">{t.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Gallery + disciplines */}
      <section aria-labelledby="gallery-title" className="container-x py-12">
        <Reveal>
          <h2 id="gallery-title" className="text-4xl font-extrabold uppercase italic md:text-5xl">Inside the club</h2>
          <p className="mt-2 text-slate-400">{disciplines.join(" · ")}</p>
        </Reveal>
        <Stagger className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {gallery.map((g) => (
            <RevealItem key={g.src}>
              <figure className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-ink-3">
                <Image src={g.src} alt={g.alt} fill sizes="(min-width:768px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-3 text-xs text-slate-300 opacity-0 transition-opacity group-hover:opacity-100">
                  {g.alt}
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}
