"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, ArrowRight, Calculator as CalcIcon, Target } from "lucide-react";

import { useLead } from "@/components/lead-modal";
import { Reveal } from "@/components/motion";

type Sex = "male" | "female";
type Goal = "lose" | "maintain" | "gain";

const activity = [
  { id: 1.2, label: "Desk job, little exercise" },
  { id: 1.375, label: "Light: 1–3 workouts / week" },
  { id: 1.55, label: "Moderate: 3–5 workouts / week" },
  { id: 1.725, label: "Very active: 6–7 workouts / week" },
];

const goals: { id: Goal; label: string }[] = [
  { id: "lose", label: "Lose fat" },
  { id: "maintain", label: "Get fit" },
  { id: "gain", label: "Build muscle" },
];

function bmiBand(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", tone: "text-sky-400" };
  if (bmi < 25) return { label: "Healthy range", tone: "text-emerald-400" };
  if (bmi < 30) return { label: "Overweight", tone: "text-amber-400" };
  return { label: "Obese range", tone: "text-rose-400" };
}

function recommend(goal: Goal, bmi: number, factor: number) {
  if (goal === "lose" || bmi >= 30)
    return { program: "HIIT & Circuit", plan: "Performance", why: "High-output intervals plus group accountability are the fastest route to sustainable fat loss." };
  if (goal === "gain")
    return { program: "Strength Training", plan: factor < 1.375 ? "Elite Coaching" : "Essential", why: "Progressive overload on free weights builds muscle; a coach fast-tracks technique if you're new." };
  if (factor <= 1.2)
    return { program: "Personal Training", plan: "Elite Coaching", why: "Starting from a low activity base, 1:1 coaching builds the habit safely and keeps you consistent." };
  return { program: "CrossFit-Style Conditioning", plan: "Performance", why: "Varied functional workouts build an all-round engine, strength and mobility." };
}

export function Calculator() {
  const { open } = useLead();
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(82);
  const [factor, setFactor] = useState(1.375);
  const [goal, setGoal] = useState<Goal>("lose");

  const r = useMemo(() => {
    const h = height / 100;
    const bmi = weight / (h * h);
    // Mifflin–St Jeor BMR
    const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === "male" ? 5 : -161);
    const tdee = bmr * factor;
    const target = goal === "lose" ? tdee - 500 : goal === "gain" ? tdee + 300 : tdee;
    const protein = weight * (goal === "maintain" ? 1.6 : 2.0);
    return { bmi, bmr, tdee, target, protein, band: bmiBand(bmi), rec: recommend(goal, bmi, factor) };
  }, [sex, age, height, weight, factor, goal]);

  // BMI gauge position: map 15–40 to 0–100%.
  const gauge = Math.min(100, Math.max(0, ((r.bmi - 15) / 25) * 100));

  return (
    <section id="calculator" aria-labelledby="calc-title" className="relative scroll-mt-24 py-20 md:py-28">
      <div aria-hidden className="absolute inset-x-0 top-1/2 -z-10 h-[500px] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.12),transparent_65%)]" />
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center"><CalcIcon className="h-4 w-4" aria-hidden /> Free fitness calculator</p>
          <h2 id="calc-title" className="mt-3 text-5xl font-semibold md:text-6xl">
            Know your <span className="text-gradient">numbers</span>
          </h2>
          <p className="mt-4 text-slate-400">
            Get your BMI, daily calorie target and the program & membership our coaches would recommend — in seconds.
          </p>
        </Reveal>

        <Reveal className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          {/* Inputs */}
          <form className="card space-y-6 p-6 sm:p-8" onSubmit={(e) => e.preventDefault()} aria-label="BMI and calorie calculator">
            <fieldset>
              <legend className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Sex</legend>
              <Segmented
                value={sex}
                onChange={(v) => setSex(v as Sex)}
                options={[{ id: "male", label: "Male" }, { id: "female", label: "Female" }]}
                name="sex"
              />
            </fieldset>

            <Slider label="Age" unit="yrs" min={16} max={75} value={age} onChange={setAge} />
            <Slider label="Height" unit="cm" min={140} max={210} value={height} onChange={setHeight} />
            <Slider label="Weight" unit="kg" min={40} max={160} value={weight} onChange={setWeight} />

            <div>
              <label htmlFor="activity" className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                Activity level
              </label>
              <select id="activity" className="field" value={factor} onChange={(e) => setFactor(Number(e.target.value))}>
                {activity.map((a) => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
            </div>

            <fieldset>
              <legend className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Main goal</legend>
              <Segmented value={goal} onChange={(v) => setGoal(v as Goal)} options={goals} name="goal" />
            </fieldset>
          </form>

          {/* Results */}
          <div className="card relative overflow-hidden p-6 sm:p-8" aria-live="polite">
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Stat label="Your BMI" value={r.bmi.toFixed(1)} sub={<span className={r.band.tone}>{r.band.label}</span>} />
              <Stat label="Daily target" value={`${Math.round(r.target).toLocaleString()} kcal`} sub={`Maintenance ≈ ${Math.round(r.tdee).toLocaleString()} kcal`} />
              <Stat label="Protein goal" value={`${Math.round(r.protein)} g/day`} sub="Supports recovery & muscle" />
              <Stat label="Resting burn (BMR)" value={`${Math.round(r.bmr).toLocaleString()} kcal`} sub="Mifflin–St Jeor formula" />
            </div>

            <div className="mt-6">
              <div className="relative h-2.5 rounded-full bg-gradient-to-r from-sky-500 via-emerald-500 via-40% to-rose-500">
                <motion.span
                  className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-ink bg-white shadow"
                  animate={{ left: `${gauge}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 24 }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={r.rec.program + r.rec.plan}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 rounded-2xl border border-brand/30 bg-brand/[0.07] p-5"
              >
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
                  <Target className="h-4 w-4" aria-hidden /> Coach recommendation
                </p>
                <h3 className="mt-2 text-3xl font-semibold">
                  {r.rec.program} <span className="text-slate-500">+</span> {r.rec.plan}
                </h3>
                <p className="mt-2 text-sm text-slate-300">{r.rec.why}</p>
                <button
                  onClick={() =>
                    open({ program: r.rec.program, plan: r.rec.plan, goal: goals.find((g) => g.id === goal)?.label })
                  }
                  className="btn-primary mt-5 w-full sm:w-auto"
                >
                  Try this plan free for 3 days <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </motion.div>
            </AnimatePresence>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
              <Activity className="h-3.5 w-3.5" aria-hidden /> Estimates only — not medical advice.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-ink/60 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-white tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{sub}</p>
    </div>
  );
}

function Slider({
  label, unit, min, max, value, onChange,
}: { label: string; unit: string; min: number; max: number; value: number; onChange: (n: number) => void }) {
  const id = `calc-${label.toLowerCase()}`;
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</label>
        <span className="text-xl font-semibold text-white tabular-nums">
          {value} <span className="text-sm text-slate-500">{unit}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full accent-[#22d3ee]"
        style={{ background: `linear-gradient(90deg,#22d3ee ${pct}%,#27272a ${pct}%)` }}
      />
    </div>
  );
}

function Segmented({
  value, onChange, options, name,
}: { value: string; onChange: (v: string) => void; options: { id: string; label: string }[]; name: string }) {
  return (
    <div className="relative grid rounded-full border border-line bg-ink p-1" style={{ gridTemplateColumns: `repeat(${options.length},1fr)` }}>
      {options.map((o) => {
        const active = o.id === value;
        return (
          <label key={o.id} className="relative cursor-pointer rounded-full px-3 py-2 text-center text-sm font-medium">
            <input type="radio" name={name} value={o.id} checked={active} onChange={() => onChange(o.id)} className="sr-only" />
            {active && (
              <motion.span
                layoutId={`seg-${name}`}
                className="absolute inset-0 rounded-full bg-brand"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className={`relative ${active ? "text-ink" : "text-slate-400"}`}>{o.label}</span>
          </label>
        );
      })}
    </div>
  );
}
