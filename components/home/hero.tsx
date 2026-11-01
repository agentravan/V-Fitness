"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flame, MapPin, Timer } from "lucide-react";

import { useLead } from "@/components/lead-modal";
import { gallery, site } from "@/lib/site";

const stats = [
  { value: "2008", label: "Serving Dubai since" },
  { value: "12+", label: "Training disciplines" },
  { value: "1:1", label: "Personal coaching" },
  { value: "AED 150", label: "Memberships from" },
];

export function Hero() {
  const { open } = useLead();

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden pb-16 pt-10 md:pb-24 md:pt-16">
      {/* Ambient glow + grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0" />
        <motion.div
          className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-brand/30 blur-[120px]"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-40 top-40 h-[460px] w-[460px] rounded-full bg-rose/25 blur-[120px]"
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-3/70 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:border-brand/60"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <MapPin className="h-3.5 w-3.5 text-brand" aria-hidden />
            International City · Spain Cluster, Dubai
          </motion.a>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-[clamp(3rem,9vw,6.75rem)] font-extrabold uppercase italic leading-[0.88]"
          >
            Stronger <br />
            starts <span className="text-gradient">here.</span>
            <span className="sr-only"> — V Fitness gym in International City, Dubai</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400"
          >
            Strength training, CrossFit-style conditioning, HIIT and certified personal training in a clean,
            judgement-free club. Real coaches, real results — at a price that makes sense.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <button onClick={() => open()} className="btn-primary text-base">
              Book Free 3-Day Trial <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <Link href="/pricing" className="btn-ghost text-base">
              Explore Memberships
            </Link>
          </motion.div>

          <motion.dl
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } } }}
            className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                <dt className="text-xs uppercase tracking-wider text-slate-500">{s.label}</dt>
                <dd className="mt-1 font-display text-3xl font-bold text-white">{s.value}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-brand/40 via-transparent to-rose/40 blur-2xl" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-ink-3">
            <Image
              src={gallery[0].src}
              alt={gallery[0].alt}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="card absolute -left-4 top-10 flex items-center gap-3 px-4 py-3 backdrop-blur-md sm:-left-8"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/15 text-brand">
              <Flame className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="block text-xs text-slate-500">HIIT session</span>
              <span className="block font-semibold text-white">~450 kcal burned</span>
            </span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="card absolute -right-3 bottom-24 flex items-center gap-3 px-4 py-3 backdrop-blur-md sm:-right-6"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose/15 text-rose-400">
              <Timer className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="block text-xs text-slate-500">Coached classes</span>
              <span className="block font-semibold text-white">Morning to late night</span>
            </span>
          </motion.div>

          <div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-2xl border border-white/10 bg-ink/70 px-4 py-3 backdrop-blur-md">
            <span className="text-sm text-slate-300">Judgement-free since 2008</span>
            <span className="rounded-full bg-brand/15 px-2.5 py-1 text-xs font-semibold text-brand">Est. Oct 2008</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
