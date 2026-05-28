"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <section className="container py-24 text-center sm:py-32">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
        Something went wrong
      </p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
        We hit an unexpected error
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
        Sorry about that. You can try again, or head back to the home page. If
        this keeps happening, please contact us and mention what you were doing.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="btn-primary">Try again</button>
        <Link href="/" className="btn-ghost">Go home</Link>
        <Link href="/contact" className="btn-ghost">Contact us</Link>
      </div>
      {error?.digest && (
        <p className="mt-6 text-xs text-slate-400">Reference: {error.digest}</p>
      )}
    </section>
  );
}
