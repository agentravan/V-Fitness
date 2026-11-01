import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <p className="eyebrow justify-center">404</p>
        <h1 className="mt-3 text-6xl font-semibold">
          Rest day for <span className="text-gradient">this page</span>
        </h1>
        <p className="mt-4 text-slate-400">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <Link href="/" className="btn-primary mt-8">Back to home</Link>
      </div>
    </section>
  );
}
