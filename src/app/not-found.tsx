import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-hero-radial" />
      <div className="container relative py-24 text-center sm:py-32">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">404</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
          We can&apos;t find that page
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
          The link may be old or mistyped. Try one of the links below, or get
          in touch and a mentor will point you in the right direction.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">Go home</Link>
          <Link href="/services" className="btn-ghost">Browse services</Link>
          <Link href="/contact" className="btn-ghost">Contact a mentor</Link>
        </div>

        <ul className="mx-auto mt-12 grid max-w-3xl gap-3 text-left sm:grid-cols-2">
          {[
            ["/services/coding-and-programming", "Coding & programming support"],
            ["/pricing", "Pricing"],
            ["/samples", "Sample resources"],
            ["/how-it-works", "How it works"],
            ["/faq", "Frequently asked questions"],
            ["/legal/academic-integrity", "Academic integrity"],
          ].map(([href, label]) => (
            <li key={href}>
              <Link
                href={href}
                className="block rounded-xl bg-white p-4 text-sm font-medium text-ink-900 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                {label} <span className="text-brand-600">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
