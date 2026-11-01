"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, TrendingUp } from "lucide-react";

import { Reveal } from "@/components/motion";
import { testimonials } from "@/lib/site";

export function Testimonials() {
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const n = testimonials.length;

  const go = useCallback((d: number) => setState(([i]) => [(i + d + n) % n, d]), [n]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [go, paused]);

  const t = testimonials[index];
  const hasSamples = testimonials.some((x) => x.sample);

  return (
    <section aria-labelledby="proof-title" className="container-x py-20 md:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="eyebrow">Transformations</p>
          <h2 id="proof-title" className="mt-3 text-5xl font-extrabold uppercase italic md:text-6xl">
            Real people. <br /><span className="text-gradient">Real progress.</span>
          </h2>
          <p className="mt-4 max-w-md text-slate-400">
            Members of every level train at V Fitness — first-timers, busy shift workers, fighters and lifters.
            Here&apos;s what keeps them coming back.
          </p>
          <div className="mt-8 flex gap-3">
            <button onClick={() => go(-1)} aria-label="Previous testimonial" className="grid h-12 w-12 place-items-center rounded-full border border-line hover:border-brand hover:text-brand">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => go(1)} aria-label="Next testimonial" className="grid h-12 w-12 place-items-center rounded-full border border-line hover:border-brand hover:text-brand">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </Reveal>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          aria-roledescription="carousel"
          aria-label="Member testimonials"
        >
          <div className="relative min-h-[320px] overflow-hidden">
            <AnimatePresence mode="popLayout" custom={dir} initial={false}>
              <motion.figure
                key={index}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1);
                  else if (info.offset.x > 60) go(-1);
                }}
                className="card relative cursor-grab p-8 active:cursor-grabbing sm:p-10"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${n}`}
              >
                <Quote className="h-10 w-10 text-brand/60" aria-hidden />
                <blockquote className="mt-4 text-xl leading-relaxed text-slate-100 sm:text-2xl">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand to-electric font-display text-xl font-bold text-ink">
                      {t.name.charAt(0)}
                    </span>
                    <div>
                      <p className="font-semibold text-white">
                        {t.name}
                        {t.sample && (
                          <span className="ml-2 rounded-full border border-line px-2 py-0.5 align-middle text-[10px] font-medium uppercase tracking-wider text-slate-500">
                            Sample
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-slate-500">{t.detail}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-400">
                    <TrendingUp className="h-4 w-4" aria-hidden /> {t.result}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Choose testimonial">
            {testimonials.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setState([i, i > index ? 1 : -1])}
                className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-brand" : "w-2 bg-line hover:bg-slate-600"}`}
              />
            ))}
          </div>
          {hasSamples && (
            <p className="mt-4 text-center text-xs text-slate-600">
              Sample reviews shown for layout — replace with verified member reviews in <code>lib/site.ts</code>.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
