import Image from "next/image";
import { BellRing, CalendarCheck, ChartNoAxesColumnIncreasing, ConciergeBell, Dumbbell, Medal, ShowerHead, Target, UserRound } from "lucide-react";

import { Reveal, RevealItem, Stagger } from "@/components/motion";
import { InstagramIcon } from "@/components/social-icons";
import { photos, posters, site } from "@/lib/site";

const tiles = [
  { ...photos.equipment, icon: Dumbbell, title: "Premium Equipment", text: "Brand-name cardio, racks, machines and a full free-weight floor." },
  { ...photos.trainers, icon: UserRound, title: "Expert Trainers", text: "Qualified coaches who teach form, plan your training and push you." },
  { ...photos.clean, icon: ShowerHead, title: "Clean & Hygienic", text: "Spotless floor, lockers and showers — cleaned throughout the day." },
  { ...photos.staff, icon: ConciergeBell, title: "Friendly Staff", text: "A warm welcome at the desk and help whenever you need it." },
];

/** "The V Fitness Experience" — slanted photo tiles straight from the campaign. */
export function Experience() {
  return (
    <section aria-labelledby="exp-title" className="relative py-20 md:py-28">
      <div className="container-x">
        <Reveal className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">The V Fitness experience</p>
            <h2 id="exp-title" className="mt-3 text-5xl font-semibold leading-[0.9] md:text-7xl">
              More than a gym — <br className="hidden md:block" />
              <span className="text-gradient">your fitness community</span>
            </h2>
          </div>
          <p className="max-w-sm text-slate-400">
            Everything that makes a workout feel good, under one roof in Warsan First, Dubai International City.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map(({ src, alt, icon: Icon, title, text }) => (
            <RevealItem key={title}>
              <article className="group relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-brand/25 bg-ink-3 transition-all duration-500 group-hover:border-brand/70 group-hover:shadow-[0_0_50px_-12px_rgba(34,211,238,0.8)] lg:-skew-x-6">
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                    className="scale-[1.18] object-cover transition-transform duration-700 group-hover:scale-[1.28] lg:skew-x-6"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 p-6 lg:skew-x-6">
                    <Icon className="h-9 w-9 text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]" strokeWidth={1.5} aria-hidden />
                    <h3 className="mt-3 text-3xl font-semibold leading-none">{title}</h3>
                    <p className="mt-2 text-sm text-slate-300">{text}</p>
                  </div>
                </div>
              </article>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

const loop = [
  { icon: Target, title: "Set your goal" },
  { icon: Dumbbell, title: "Follow your plan" },
  { icon: ChartNoAxesColumnIncreasing, title: "Track your progress" },
  { icon: CalendarCheck, title: "Stay consistent" },
  { icon: Medal, title: "Achieve results" },
];

/** "Focus · Train · Progress · Repeat" — the coaching loop. */
export function Loop() {
  return (
    <section aria-labelledby="loop-title" className="relative overflow-hidden py-20 md:py-28">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-electric/20 blur-[130px]" />
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <p className="eyebrow">How we coach</p>
            <h2 id="loop-title" className="mt-4 font-semibold leading-[0.86]">
              <span className="block text-6xl md:text-8xl">Focus</span>
              <span className="block text-6xl md:text-8xl">Train</span>
              <span className="block text-6xl md:text-8xl">Progress</span>
              <span className="text-gradient block text-6xl md:text-8xl">Repeat</span>
            </h2>
            <p className="mt-6 max-w-md text-lg text-slate-300">
              Stay consistent and see the difference. Every member gets a goal, a plan and a coach checking in on the numbers.
            </p>
          </Reveal>

          <Stagger className="relative mt-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div aria-hidden className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-brand/0 via-brand/70 to-brand/0 sm:block" />
            {loop.map(({ icon: Icon, title }, i) => (
              <RevealItem key={title} className={i === 4 ? "col-span-2 sm:col-span-1" : ""}>
                <div className="relative flex flex-col items-center text-center">
                  <span className="relative grid h-[4.5rem] w-[4.5rem] place-items-center rounded-2xl border border-brand/40 bg-ink-2 shadow-[0_0_30px_-10px_rgba(34,211,238,0.9)]">
                    <Icon className="h-8 w-8 text-white" strokeWidth={1.5} aria-hidden />
                    <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-brand text-xs font-extrabold text-ink">
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="mt-3 text-lg font-semibold leading-tight">{title}</h3>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>

        <Reveal delay={0.1} className="relative mx-auto w-full max-w-lg">
          <div className="relative aspect-[4/5]">
            <div aria-hidden className="absolute inset-6 rounded-full border border-brand/30 spin-slow" />
            <div aria-hidden className="absolute inset-16 rounded-full border border-dashed border-electric/40 spin-slower-rev" />
            <Image src={photos.athleteWoman.src} alt={photos.athleteWoman.alt} fill sizes="(min-width:1024px) 40vw, 90vw" className="fade-xy object-cover" />
          </div>
          <div className="hud card absolute bottom-10 left-0 rounded-xl px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-brand">Your plan</p>
            <p className="text-2xl font-semibold text-white">Built for you</p>
          </div>
          <div className="hud card absolute right-0 top-10 flex items-center gap-2 rounded-xl px-4 py-3">
            <BellRing className="h-4 w-4 text-brand" aria-hidden />
            <p className="text-sm font-semibold text-white">Coach check-ins</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Campaign posters — doubles as a social-proof / follow-us strip. */
export function Campaign() {
  return (
    <section aria-labelledby="campaign-title" className="container-x py-20 md:py-28">
      <Reveal className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">On the gram</p>
          <h2 id="campaign-title" className="mt-3 text-5xl font-semibold md:text-6xl">
            Join the <span className="text-gradient">movement</span>
          </h2>
        </div>
        <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="btn-ghost">
          <InstagramIcon className="h-5 w-5" /> @vfitness_dxb
        </a>
      </Reveal>
      <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
        {posters.map((p, i) => (
          <RevealItem key={p.src}>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative block overflow-hidden rounded-3xl border border-brand/25 transition-all duration-500 hover:-translate-y-2 hover:border-brand/70 hover:shadow-[0_0_60px_-15px_rgba(34,211,238,0.8)] ${i === 1 ? "md:mt-10" : ""}`}
            >
              <Image src={p.src} alt={p.alt} width={1254} height={1254} sizes="(min-width:768px) 33vw, 100vw" className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]" />
            </a>
          </RevealItem>
        ))}
      </Stagger>
    </section>
  );
}
