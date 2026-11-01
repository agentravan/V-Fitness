/**
 * Single source of truth for business data (NAP, hours, programs, pricing).
 * Everything rendered on the site AND in the JSON-LD schema reads from here,
 * so keep it accurate — search engines and AI answer engines quote it.
 *
 * Items marked `TODO(confirm)` were not published on the original site and
 * are sensible defaults that must be confirmed with the club owner before launch.
 */

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://www.vfitness.com")
).replace(/\/$/, "");

export const site = {
  name: "V Fitness",
  legalName: "V Fitness Gym",
  tagline: "Train harder. Feel welcome. Since 2008.",
  description:
    "V Fitness is a full-service gym in Dubai International City (Spain Cluster) offering strength training, CrossFit-style conditioning, HIIT, MMA, yoga and certified personal training. Open since October 2008.",
  foundingDate: "2008-10",
  phone: "+971 4 430 8405",
  phoneE164: "+97144308405",
  whatsapp: "+971 54 359 4244",
  whatsappE164: "971543594244",
  email: undefined as string | undefined, // TODO(confirm): public contact email
  address: {
    street: "Shop 8, Prime Residency 2, Spain Cluster",
    locality: "International City",
    region: "Dubai",
    country: "AE",
    countryName: "United Arab Emirates",
  },
  // TODO(confirm): approximate pin for Spain Cluster, International City.
  geo: { lat: 25.1626, lng: 55.4041 },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=V+Fitness+Prime+Residency+2+Spain+Cluster+International+City+Dubai",
  // TODO(confirm): opening hours were not published on the original site.
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "06:00", closes: "23:00", label: "Mon – Sat" },
    { days: ["Sunday"], opens: "08:00", closes: "20:00", label: "Sunday" },
  ],
  priceRange: "AED 150 – AED 1,068",
  currency: "AED",
  areaServed: [
    "International City",
    "Dubai Silicon Oasis",
    "Warsan",
    "Al Warqa",
    "Mirdif",
    "Dragon Mart",
    "Dubai",
  ],
  social: {
    facebook: "https://www.facebook.com/vfitnessgym1",
    instagram: "https://www.instagram.com/vfitness_dxb/",
  },
  locations: ["International City — Spain Cluster", "Online coaching (remote)"],
  timeSlots: ["Early morning (6–9 AM)", "Late morning (9 AM–12 PM)", "Afternoon (12–5 PM)", "Evening (5–9 PM)", "Late night (9–11 PM)"],
} as const;

export type ProgramKey = "strength" | "crossfit" | "hiit" | "personal";

export const programs: {
  key: ProgramKey;
  title: string;
  blurb: string;
  points: string[];
  intensity: number; // 1-5
  sessionLength: string;
}[] = [
  {
    key: "strength",
    title: "Strength Training",
    blurb: "Free weights, racks and machines to build real, functional muscle with progressive overload.",
    points: ["Barbell & dumbbell zones", "Hypertrophy & powerbuilding plans", "Form checks from floor staff"],
    intensity: 4,
    sessionLength: "45–75 min",
  },
  {
    key: "crossfit",
    title: "CrossFit-Style Conditioning",
    blurb: "Functional, varied, high-output workouts that blend lifting, gymnastics and engine work.",
    points: ["Coached group WODs", "Kettlebells, rowers & sleds", "Scalable for every level"],
    intensity: 5,
    sessionLength: "50 min",
  },
  {
    key: "hiit",
    title: "HIIT & Circuit",
    blurb: "Short, intense intervals that torch calories and keep your metabolism elevated for hours.",
    points: ["Circuit, Zumba & aerobics", "Heart-rate guided rounds", "Fat-loss focused"],
    intensity: 5,
    sessionLength: "30–45 min",
  },
  {
    key: "personal",
    title: "Personal Training",
    blurb: "A plan built for your body and your goal by a qualified coach — technique, programming and nutrition.",
    points: ["Weight loss & muscle building", "Mobility, MMA & self-defence", "Nutrition advice included"],
    intensity: 3,
    sessionLength: "60 min",
  },
];

export const disciplines = [
  "Cardio", "Yoga", "Weights", "MMA", "Bodybuilding", "Circuit Training",
  "Zumba", "Aerobics", "Meditation", "Flexibility", "Strength", "Toning",
];

export const personalTrainingFocus = [
  "Weight loss & management",
  "Self-defence & martial arts",
  "Resistance training",
  "Muscle building",
  "Mobility & flexibility",
  "Periodisation for acting & TV roles",
  "Speed, strength & power development",
  "Nutritional advice",
];

/* ---------------------------------------------------------------- Pricing */

export type Billing = "monthly" | "quarterly" | "annual";

export type Plan = {
  id: "essential" | "performance" | "elite";
  name: string;
  summary: string;
  featured?: boolean;
  /** Total charged per billing period, in AED (excl. 5% VAT). */
  price: Record<Billing, number>;
  registrationFee: Record<Billing, number>;
  features: string[];
};

/**
 * "Essential" mirrors the published rates on vfitness.com
 * (1 month AED 150 + AED 200 reg, 3 months AED 599, 12 months AED 1,068).
 * TODO(confirm): "Performance" and "Elite" tiers are proposed packages.
 */
export const plans: Plan[] = [
  {
    id: "essential",
    name: "Essential",
    summary: "Full gym floor access for self-guided training.",
    price: { monthly: 150, quarterly: 599, annual: 1068 },
    registrationFee: { monthly: 200, quarterly: 50, annual: 50 },
    features: [
      "Unlimited gym floor access",
      "Cardio, free weights & machines",
      "Locker rooms & showers",
      "Free fitness assessment",
    ],
  },
  {
    id: "performance",
    name: "Performance",
    summary: "Everything in Essential plus unlimited group classes.",
    featured: true,
    price: { monthly: 250, quarterly: 699, annual: 1999 },
    registrationFee: { monthly: 100, quarterly: 0, annual: 0 },
    features: [
      "Everything in Essential",
      "Unlimited HIIT, CrossFit-style & Zumba",
      "Yoga, MMA & meditation classes",
      "Monthly body-composition check",
      "Priority class booking",
    ],
  },
  {
    id: "elite",
    name: "Elite Coaching",
    summary: "Personal training with a dedicated coach and nutrition plan.",
    price: { monthly: 899, quarterly: 2499, annual: 8999 },
    registrationFee: { monthly: 0, quarterly: 0, annual: 0 },
    features: [
      "Everything in Performance",
      "8 personal-training sessions / month",
      "Custom training program",
      "Nutrition plan & weekly check-ins",
      "Guest pass every month",
    ],
  },
];

export const billingMeta: Record<Billing, { label: string; months: number; note: string }> = {
  monthly: { label: "Monthly", months: 1, note: "Recurring monthly" },
  quarterly: { label: "Quarterly", months: 3, note: "One-time payment" },
  annual: { label: "Annual", months: 12, note: "One-time payment" },
};

/* ---------------------------------------------------------------- Social proof */

/**
 * IMPORTANT: these are SAMPLE testimonials for layout only (flagged `sample`).
 * Replace them with real, consented member reviews (e.g. copied from the club's
 * Google Business Profile) before going live. Do not publish invented reviews,
 * and do not add Review/AggregateRating schema unless the reviews are real.
 */
export const testimonials: {
  name: string;
  detail: string;
  quote: string;
  result: string;
  sample: boolean;
}[] = [
  {
    name: "Member A.",
    detail: "Strength program · 6 months",
    quote: "The coaches fixed my squat in the first week. I finally have a plan instead of wandering around the floor.",
    result: "+40 kg squat",
    sample: true,
  },
  {
    name: "Member B.",
    detail: "HIIT & nutrition · 4 months",
    quote: "Zero judgement, great music and the evening classes fit my shift. The nutrition advice made the difference.",
    result: "−9 kg",
    sample: true,
  },
  {
    name: "Member C.",
    detail: "Personal training · 1 year",
    quote: "Clean, friendly and close to home in International City. My trainer plans every block around my goals.",
    result: "First pull-up",
    sample: true,
  },
  {
    name: "Member D.",
    detail: "MMA & conditioning · 8 months",
    quote: "Came for the MMA sessions, stayed for the community. Staff remember your name and actually push you.",
    result: "−6% body fat",
    sample: true,
  },
];

/* ---------------------------------------------------------------- FAQ (also emitted as FAQPage schema) */

export const faqs: { q: string; a: string }[] = [
  {
    q: "Where is V Fitness located?",
    a: "V Fitness is at Shop 8, Prime Residency 2 building, Spain Cluster, International City, Dubai, UAE — a short drive from Dubai Silicon Oasis, Warsan and Dragon Mart.",
  },
  {
    q: "How much is a gym membership at V Fitness?",
    a: "Memberships start at AED 150 per month (plus a one-time AED 200 registration fee and 5% VAT). A 3-month membership is AED 599 and a 12-month membership is AED 1,068, each with an AED 50 registration fee.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. New members can book a free 3-day trial pass that includes full gym floor access and a fitness assessment with a coach.",
  },
  {
    q: "Do you offer personal training?",
    a: "Yes. Qualified personal trainers cover weight loss, muscle building, resistance training, mobility, martial arts and self-defence, speed and power development, and nutrition advice.",
  },
  {
    q: "What classes and disciplines are available?",
    a: "Cardio, yoga, weights, MMA, bodybuilding, circuit training, Zumba, aerobics, meditation, flexibility, strength and toning, plus HIIT and CrossFit-style conditioning.",
  },
  {
    q: "Is V Fitness beginner friendly?",
    a: "Yes. V Fitness has welcomed members of every fitness level since 2008. Staff give equipment walkthroughs and form checks so beginners can train safely and confidently.",
  },
];

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About & Facilities" },
  { href: "/pricing", label: "Memberships" },
  { href: "/dashboard", label: "Demo Portal" },
];

/** Original club photography hosted on the existing site. */
export const gallery: { src: string; alt: string }[] = [
  { src: "https://www.vfitness.com/wp-content/uploads/2023/06/IMGL1053.jpg", alt: "Strength floor at V Fitness International City with racks and free weights" },
  { src: "https://www.vfitness.com/wp-content/uploads/2023/06/IMGL1050.jpg", alt: "Row of cardio machines at V Fitness gym in Dubai" },
  { src: "https://www.vfitness.com/wp-content/uploads/2023/06/IMGL1049.jpg", alt: "Dumbbell rack and benches in the V Fitness weights area" },
  { src: "https://www.vfitness.com/wp-content/uploads/2023/06/IMGL1031.jpg", alt: "Selectorized resistance machines inside V Fitness" },
  { src: "https://www.vfitness.com/wp-content/uploads/2023/06/IMGL1017.jpg", alt: "Functional training space at V Fitness Spain Cluster" },
  { src: "https://www.vfitness.com/wp-content/uploads/2023/06/IMGL1008.jpg", alt: "Open gym floor at V Fitness with mirrors and equipment" },
];
