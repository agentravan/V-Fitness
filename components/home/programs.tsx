"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Dumbbell, Flame, HeartPulse, UserCheck, type LucideIcon } from "lucide-react";

import { useLead } from "@/components/lead-modal";
import { Reveal } from "@/components/motion";
import { programs, type ProgramKey } from "@/lib/site";

const icons: Record<ProgramKey, LucideIcon> = {
  strength: Dumbbell,
  crossfit: Flame,
  hiit: HeartPulse,
  personal: UserCheck,
};

const accents: Record<ProgramKey, string> = {
  strength: "from-orange-500/30",
  crossfit: "from-rose-500/30",
  hiit: "from-amber-400/30",
  personal: "from-fuchsia-500/25",
};

export function Programs() {
  const { open } = useLead();

  return (
    <section id="programs" aria-labelledby="programs-title" className="container-x scroll-mt-24 py-20 md:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow justify-center">Programs</p>
        <h2 id="programs-title" className="mt-3 text-5xl font-extrabold uppercase italic md:text-6xl">
          Pick your <span className="text-gradient">battle</span>
        </h2>
        <p className="mt-4 text-slate-400">
          Four proven paths, one goal: making you stronger, fitter and more confident than you were last month.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {programs.map((p, i) => {
          const Icon = icons[p.key];
          return (
            <motion.article
              key={p.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group card relative flex flex-col overflow-hidden p-6 transition-shadow duration-300 hover:border-brand/50 hover:shadow-[0_20px_60px_-15px_rgba(249,115,22,0.45)]"
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${accents[p.key]} to-transparent opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
              />
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-ink text-brand transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-6 text-3xl font-bold uppercase">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{p.blurb}</p>

              <ul className="mt-5 space-y-2 text-sm text-slate-300">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                    {pt}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-xs text-slate-500">
                <span>{p.sessionLength}</span>
                <span className="flex items-center gap-1" aria-label={`Intensity ${p.intensity} out of 5`}>
                  {Array.from({ length: 5 }).map((_, k) => (
                    <span key={k} className={`h-1.5 w-4 rounded-full ${k < p.intensity ? "bg-brand" : "bg-line"}`} />
                  ))}
                </span>
              </div>

              <button
                onClick={() => open({ program: p.title })}
                className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-white hover:text-brand"
              >
                Try it free <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </button>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
