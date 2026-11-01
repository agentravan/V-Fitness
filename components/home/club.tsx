"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight, BadgeCheck, CalendarCheck, ChartNoAxesColumnIncreasing, Dumbbell, Flame, HeartPulse, Lock, Medal,
  QrCode, ScanLine, ShieldCheck, ShowerHead, Smartphone, Sparkles, Swords, Trophy, Users, Wifi,
} from "lucide-react";

import { useLead } from "@/components/lead-modal";
import { Reveal, RevealItem, Stagger } from "@/components/motion";
import { gallery, photos, site } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ Hero */
export function ClubHero() {
  const { open } = useLead();
  return (
    <section aria-labelledby="hero-title" className="relative -mt-16 flex min-h-[100svh] items-end overflow-hidden md:-mt-[76px]">
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease }}
        className="absolute inset-0 -z-10"
      >
        <Image src={photos.heroDuo.src} alt={photos.heroDuo.alt} fill priority sizes="100vw" className="object-cover object-[65%_20%]" />
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/70 to-black/10" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black to-transparent" />

      <div className="container-x pb-16 pt-32 md:pb-24">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
          Prime Residency II · Warsan First · Dubai International City
        </motion.p>
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="mt-5 max-w-3xl text-[clamp(2.6rem,6.2vw,4.75rem)] font-bold leading-[1.02]"
        >
          International City&apos;s complete fitness club since 2008
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-5 max-w-xl text-lg text-white/70"
        >
          Strength, conditioning, MMA, personal training and a protein bar — under one roof, with a member app that tracks every visit.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => open()} className="btn-primary">Join now</button>
          <Link href="/pricing" className="btn-ghost">View memberships</Link>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-14 grid max-w-3xl grid-cols-2 gap-6 border-t border-white/15 pt-6 sm:grid-cols-4"
        >
          {[
            ["Since", "2008"],
            ["Disciplines", "12+"],
            ["Free trial", "3 days"],
            ["From", "AED 150/mo"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs uppercase tracking-[0.14em] text-white/50">{k}</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">{v}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Ecosystem */
const ecosystem = [
  { ...photos.athleteWoman, title: "Strength", text: "Free weights, racks and brand-name machines for muscle building, powerlifting and toning.", href: "/#classes" },
  { ...photos.athleteMan, title: "Conditioning", text: "HIIT, circuits and CrossFit-style sessions that build an engine and burn fat fast.", href: "/#classes" },
  { ...photos.trainers, title: "Personal Training", text: "1-on-1 coaching for weight loss, muscle gain, mobility, MMA and screen-ready physiques.", href: "/#classes" },
  { ...photos.clean, title: "Recovery & Comfort", text: "Stretching, yoga and meditation, plus spotless lockers and showers for after-work sessions.", href: "/about" },
];

export function Ecosystem() {
  return (
    <section id="training" aria-labelledby="eco-title" className="container-x scroll-mt-24 py-24 md:py-32">
      <Reveal className="max-w-2xl">
        <h2 id="eco-title" className="section-title">A complete ecosystem for your fitness</h2>
        <p className="mt-4 text-lg text-white/60">From your first workout to competition prep — every part of your training lives at V Fitness.</p>
      </Reveal>
      <Stagger className="mt-14 grid gap-5 md:grid-cols-2">
        {ecosystem.map((c) => (
          <RevealItem key={c.title}>
            <Link href={c.href} className="group relative block aspect-[16/11] overflow-hidden rounded-2xl bg-ink-3">
              <Image src={c.src} alt={c.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="scale-[1.12] object-cover transition-transform duration-700 group-hover:scale-[1.2]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
              <span className="arrow-btn absolute right-5 top-5" aria-hidden><ArrowUpRight className="h-5 w-5" /></span>
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <h3 className="text-3xl font-semibold">{c.title}</h3>
                <p className="mt-2 max-w-md text-white/70">{c.text}</p>
              </div>
            </Link>
          </RevealItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ------------------------------------------------------------------ Train your way */
const ways = [
  { icon: Users, title: "Group Classes", text: "Zumba, aerobics, circuit and HIIT sessions that turn effort into energy — with a crowd that keeps you showing up.", tags: ["Zumba", "Aerobics", "Circuit", "HIIT"] },
  { icon: Swords, title: "MMA & Self-Defence", text: "Pad work, striking fundamentals and self-defence drills coached for every level, from first class to sparring.", tags: ["MMA", "Self-defence", "Conditioning"] },
  { icon: Sparkles, title: "Yoga & Mobility", text: "Low-impact sessions for flexibility, posture and core control — the reset your training needs.", tags: ["Yoga", "Meditation", "Flexibility"] },
];

export function TrainYourWay() {
  const { open } = useLead();
  return (
    <section id="classes" aria-labelledby="ways-title" className="scroll-mt-24 border-y border-white/10 bg-ink-2 py-24 md:py-32">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 id="ways-title" className="section-title">Train your way</h2>
            <p className="mt-4 text-lg text-white/60">Group energy. Focused strength. Smart recovery — your training, your terms.</p>
          </div>
          <button onClick={() => open()} className="btn-ghost self-start">Book a free class</button>
        </Reveal>
        <Stagger className="mt-14 grid gap-5 lg:grid-cols-3">
          {ways.map(({ icon: Icon, title, text, tags }) => (
            <RevealItem key={title}>
              <motion.article whileHover={{ y: -6 }} className="group card flex h-full flex-col p-7">
                <div className="flex items-start justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="h-7 w-7" aria-hidden />
                  </span>
                  <span className="arrow-btn" aria-hidden><ArrowUpRight className="h-5 w-5" /></span>
                </div>
                <h3 className="mt-10 text-2xl font-semibold">{title}</h3>
                <p className="mt-3 flex-1 text-white/60">{text}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <li key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">{t}</li>
                  ))}
                </ul>
              </motion.article>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Refuel & gear-up */
export function Refuel() {
  const { open } = useLead();
  return (
    <section id="refuel" aria-labelledby="refuel-title" className="container-x scroll-mt-24 py-24 md:py-32">
      <Reveal className="max-w-2xl">
        <h2 id="refuel-title" className="section-title">Refuel &amp; gear-up zone</h2>
        <p className="mt-4 text-lg text-white/60">Refuel. Recharge. Recover. Order at the desk or in the member app — it&apos;s added to your account.</p>
      </Reveal>
      <div className="mt-14 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <article className="group relative h-full min-h-[460px] overflow-hidden rounded-2xl">
            <Image src={photos.athleteMan.src} alt={photos.athleteMan.alt} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover object-[50%_20%] transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
              <h3 className="text-3xl font-semibold">The Protein Bar</h3>
              <p className="mt-2 max-w-md text-white/70">Whey shakes, recovery smoothies, protein bars, pre-workout and smart hydration — ready when you finish your set.</p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                {["Whey shake", "Mass gainer", "Pre-workout", "Protein bar", "Electrolytes"].map((x) => (
                  <span key={x} className="rounded-full bg-white/10 px-3 py-1 text-white/90 backdrop-blur">{x}</span>
                ))}
              </div>
            </div>
          </article>
        </Reveal>
        <div className="grid gap-5">
          <Reveal>
            <article className="group relative min-h-[260px] overflow-hidden rounded-2xl">
              <Image src={photos.equipment.src} alt={photos.equipment.alt} fill sizes="(min-width:1024px) 40vw, 100vw" className="scale-110 object-cover transition-transform duration-700 group-hover:scale-125" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <h3 className="text-2xl font-semibold">The Pro Shop</h3>
                <p className="mt-2 text-white/70">Gloves, straps, belts, shakers and V Fitness apparel.</p>
              </div>
            </article>
          </Reveal>
          <Reveal>
            <div className="card flex h-full items-center gap-5 p-7">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand text-black"><Smartphone className="h-7 w-7" aria-hidden /></span>
              <div>
                <h3 className="text-xl font-semibold">Order from the member app</h3>
                <p className="mt-1 text-white/60">Pre-order your shake before you finish training and pick it up at the desk.</p>
                <button onClick={() => open({ program: "Protein Bar / Pro Shop" })} className="mt-3 text-sm font-semibold text-brand hover:underline">Ask about member pricing →</button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Smart club */
const pillars = [
  { title: "Community & Challenges", items: [[Trophy, "Monthly transformation challenges"], [Medal, "Squad leaderboards"], [Flame, "Member events & meet-ups"]] },
  { title: "Member Tech", items: [[QrCode, "QR check-in at the front desk"], [ChartNoAxesColumnIncreasing, "Visit & progress tracking"], [CalendarCheck, "Renewal reminders on WhatsApp"]] },
  { title: "Comfort & Care", items: [[ShowerHead, "Clean lockers & showers"], [ShieldCheck, "Judgement-free, all levels"], [Wifi, "Wi-Fi & seating area"]] },
] as const;

export function SmartClub() {
  return (
    <section aria-labelledby="smart-title" className="border-y border-white/10 bg-ink-2 py-24 md:py-32">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="smart-title" className="section-title">Innovation &amp; community</h2>
          <p className="mt-4 text-lg text-white/60">Beyond training: a connected club that remembers your goals.</p>
        </Reveal>
        <Stagger className="mt-14 grid gap-5 md:grid-cols-3">
          {pillars.map((p) => (
            <RevealItem key={p.title}>
              <article className="card h-full p-7">
                <h3 className="text-2xl font-medium">{p.title}</h3>
                <ul className="mt-6 space-y-5">
                  {p.items.map(([Icon, label]) => (
                    <li key={label} className="flex items-center gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-black text-brand">
                        <Icon className="h-6 w-6" aria-hidden />
                      </span>
                      <span className="text-white/80">{label}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Gallery */
export function ClubGallery() {
  const tiles = [
    { src: gallery[0].src, cls: "md:col-span-2 md:row-span-2" },
    { src: photos.staff.src, cls: "" },
    { src: gallery[1].src, cls: "" },
    { src: gallery[2].src, cls: "" },
    { src: gallery[3].src, cls: "md:row-span-2" },
    { src: gallery[4].src, cls: "" },
  ];
  return (
    <section aria-labelledby="gallery-title" className="container-x py-24 md:py-32">
      <Reveal className="grid gap-6 md:grid-cols-2 md:items-end">
        <h2 id="gallery-title" className="section-title">Step inside V Fitness</h2>
        <p className="text-lg text-white/60 md:text-right">Tour the club and see the floor, the kit and the people that make it feel like home.</p>
      </Reveal>
      <Stagger className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4">
        {tiles.map((t, i) => (
          <RevealItem key={t.src} className={`relative overflow-hidden rounded-2xl bg-ink-3 ${t.cls}`}>
            <Image src={t.src} alt={`Inside the V Fitness club, International City — photo ${i + 1}`} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" />
          </RevealItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ------------------------------------------------------------------ Philosophy */
const model = [
  { icon: Dumbbell, title: "Train", text: "Coached programs for your goal" },
  { icon: HeartPulse, title: "Fuel", text: "Protein bar & nutrition advice" },
  { icon: Sparkles, title: "Recover", text: "Mobility, stretching, rest" },
  { icon: ScanLine, title: "Track", text: "Visits, packages & progress in the app" },
];

export function Philosophy() {
  return (
    <section aria-labelledby="phil-title" className="container-x pb-24 md:pb-32">
      <div className="card overflow-hidden p-8 md:p-14">
        <Reveal className="max-w-2xl">
          <h2 id="phil-title" className="section-title">The V Fitness philosophy</h2>
          <p className="mt-4 text-lg text-white/60">The V Fitness model: four habits, one loop, built to keep you consistent.</p>
        </Reveal>
        <div className="relative mt-12 grid gap-4 md:grid-cols-4">
          <div aria-hidden className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-brand/0 via-brand to-brand/0 md:block" />
          {model.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08} className="relative text-center">
              <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full border border-brand/50 bg-black text-brand shadow-[0_0_40px_-10px_rgba(0,212,220,0.8)]">
                <Icon className="h-7 w-7" aria-hidden />
              </span>
              <h3 className="mt-5 text-xl font-semibold">{String(i + 1).padStart(2, "0")} · {title}</h3>
              <p className="mt-1 text-sm text-white/60">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Member app teaser */
export function AppTeaser() {
  return (
    <section aria-labelledby="app-title" className="container-x pb-24 md:pb-32">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand/15 via-ink-2 to-black p-8 md:p-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">V Fitness Club OS</p>
            <h2 id="app-title" className="mt-3 section-title">Your whole gym, in one dashboard</h2>
            <p className="mt-4 text-lg text-white/60">
              Attendance, member tracking, protein-bar orders, PT packages and customer analytics — the system behind the club. Try the live demo.
            </p>
            <ul className="mt-6 grid gap-2 text-white/80 sm:grid-cols-2">
              {["QR attendance check-in", "Member profiles & history", "Shop & protein orders", "Package & session tracker", "Renewal reminders", "Revenue & retention analytics"].map((x) => (
                <li key={x} className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-brand" aria-hidden /> {x}</li>
              ))}
            </ul>
            <Link href="/dashboard" className="btn-primary mt-8">
              <Lock className="h-4 w-4" aria-hidden /> Open the demo portal
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card p-4 shadow-[0_40px_120px_-40px_rgba(0,212,220,0.6)]">
              <div className="grid grid-cols-2 gap-3">
                {[["Active members", "248"], ["Checked in today", "42"], ["Shop orders today", "17"], ["PT sessions left", "312"]].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-white/10 bg-black p-4">
                    <p className="text-xs text-white/50">{k}</p>
                    <p className="mt-1 text-3xl font-semibold">{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex h-28 items-end gap-2 rounded-xl border border-white/10 bg-black p-4">
                {[40, 55, 48, 62, 70, 58, 84].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-t ${i === 6 ? "bg-brand" : "bg-white/15"}`} style={{ height: `${h}%` }} />
                ))}
              </div>
              <p className="mt-2 text-center text-xs text-white/40">Demo data</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
