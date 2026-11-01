import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Club OS — Gym Management Demo",
  description: "Interactive demo of V Fitness Club OS: attendance check-in, member tracking, protein bar orders, PT package tracker and customer analytics.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/dashboard" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="-mt-16 min-h-dvh bg-black md:-mt-[76px]">{children}</div>;
}
