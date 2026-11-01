import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gym Management Demo Portal",
  description: "Interactive demo of the V Fitness member management dashboard: attendance, expiring memberships and renewal reminders.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/dashboard" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="-mt-16 min-h-dvh bg-black md:-mt-[76px]">{children}</div>;
}
