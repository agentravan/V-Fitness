"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronsRight, Dumbbell, HeartPulse, MapPin, Phone, Sparkles, UserRound, Users } from "lucide-react";

import { useLead } from "@/components/lead-modal";
import { photos, site } from "@/lib/site";

const features = [
  { icon: Dumbbell, label: "Modern Equipment" },
  { icon: UserRound, label: "Supportive Trainers" },
  { icon: Sparkles, label: "Clean & Hygienic" },
  { icon: Users, label: "Friendly Staff" },
  { icon: HeartPulse, label: "Motivating Community" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { open } = useLead();

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* ---------- background layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 opacity-70" />
        <div className="absolute -left-48 top-10 h-[560px] w-[560px] rounded-full bg-brand/20 blur-[130px]" />
        <div className="absolute right-0 top-0 h-[620px] w-[620px] rounded-full bg-electric/25 blur-[140px]" />
        <span className="streak left-[-10%] top-[22%] w-[55%]" />
        <span className="streak right-[-5%] top-[64%] w-[45%] [animation-delay:-2.5s]" />
        <span className="streak bottom-[8%] left-[20%] w-[40%] [animation-delay:-4s]" />
        {/* Burj Khalifa skyline, as on the club's campaign artwork */}
        <div className="absolute bottom-0 left-0 hidden h-[78%] w-[260px] opacity-70 [mask-composite:intersect] [mask-image:linear-gradient(0deg,black_55%,transparent),linear-gradient(90deg,black_55%,transparent)] sm:block">
          <Image src={photos.burj.src} alt="" fill sizes="260px" className="object-cover object-bottom" />
        </div>
      </div>

      {/* ---------- athletes (desktop: full-height right side) */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease }}
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] lg:block"
      >
        <Image src={photos.heroDuo.src} alt={photos.heroDuo.alt} fill priority sizes="58vw" className="fade-xy object-cover object-[50%_20%]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
      </motion.div>

      <div className="container-x relative grid min-h-[calc(100svh-5rem)] content-center gap-10 pb-10 pt-8 lg:pb-14">
        <div className="relative z-10 max-w-2xl">
          {/* address chip (slanted glass panel) */}
          <motion.a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="neon-border inline-flex -skew-x-12 items-center gap-3 rounded-xl bg-ink-2/70 px-4 py-2.5 backdrop-blur-md"
          >
            <span className="flex skew-x-12 items-center gap-3">
              <MapPin className="h-5 w-5 text-brand" aria-hidden />
              <span className="text-left text-xs font-semibold leading-tight text-slate-100 sm:text-sm">
                Prime Residency II · Warsan First
                <span className="block font-normal text-slate-400">Dubai International City, UAE</span>
              </span>
            </span>
          </motion.a>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease }}
            className="mt-7 font-extrabold uppercase italic leading-[0.86]"
          >
            <span className="block text-[clamp(2.6rem,7vw,5.6rem)]">Your</span>
            <span className="text-gradient block text-[clamp(3.2rem,9vw,7.25rem)]">Fitness</span>
            <span className="block text-[clamp(3.2rem,9vw,7.25rem)]">Journey</span>
            <span className="mt-1 block text-[clamp(1.8rem,4.6vw,3.5rem)] text-slate-100">begins at</span>
            <span className="text-gradient block text-[clamp(3.2rem,9vw,7.25rem)]">V Fitness</span>
            <span className="sr-only"> — gym in Warsan First, Dubai International City</span>
          </motion.h1>
          <svg viewBox="0 0 320 18" className="mt-2 h-4 w-64 text-brand drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" aria-hidden>
            <motion.path
              d="M2 14 C 90 2, 220 2, 318 8"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: 0.5, ease }}
            />
          </svg>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-slate-300"
          >
            More than a gym — it&apos;s your fitness community. Strength, CrossFit-style conditioning, HIIT and certified
            personal training in a clean, welcoming club since 2008.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <button onClick={() => open()} className="btn-primary">
              Join Today <ChevronsRight className="h-5 w-5" aria-hidden />
            </button>
            <Link href="/pricing" className="btn-ghost">
              Explore Memberships
            </Link>
          </motion.div>

          <motion.a
            href={`tel:${site.phoneE164}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-6 inline-flex items-center gap-3 text-slate-300 hover:text-white"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full border border-brand/50 bg-brand/10 text-brand shadow-[0_0_20px_-4px_rgba(34,211,238,0.8)]">
              <Phone className="h-4 w-4" aria-hidden />
            </span>
            <span className="font-display text-xl font-bold italic tracking-wide">{site.phone}</span>
          </motion.a>
        </div>

        {/* athletes (mobile/tablet) */}
        <div className="relative -mx-4 h-[420px] sm:-mx-6 sm:h-[520px] lg:hidden">
          <Image src={photos.heroDuo.src} alt={photos.heroDuo.alt} fill sizes="100vw" className="fade-xy object-cover object-top" />
        </div>

        {/* HUD tags on the photo (desktop) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="hud card absolute right-[6%] top-[14%] hidden rounded-xl px-4 py-3 lg:block"
        >
          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Established</p>
          <p className="font-display text-3xl font-extrabold italic text-white">Oct 2008</p>
        </motion.div>
        <motion.button
          onClick={() => open()}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
          transition={{ delay: 1, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
          className="hud card absolute right-[30%] top-[44%] hidden rounded-xl px-4 py-3 text-left lg:block"
        >
          <span className="block text-[10px] uppercase tracking-[0.25em] text-brand">Free pass</span>
          <span className="block font-display text-2xl font-extrabold italic text-white">3-Day Trial</span>
        </motion.button>

        {/* feature strip */}
        <motion.ul
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.5 } } }}
          className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:ml-auto lg:w-[64%] lg:grid-cols-5"
          aria-label="Why V Fitness"
        >
          {features.map(({ icon: Icon, label }, i) => (
            <motion.li
              key={label}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -4 }}
              className={`neon-border flex flex-col items-center gap-2 rounded-2xl bg-ink-2/75 px-3 py-4 text-center backdrop-blur-md ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <Icon className="h-7 w-7 text-white drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" strokeWidth={1.6} aria-hidden />
              <span className="font-display text-base font-bold italic leading-tight text-white">{label}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
