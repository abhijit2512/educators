"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "cookie-consent-v1";

/**
 * Tiny cookie consent strip. Defers showing until after hydration to avoid
 * SSR flicker, and remembers the choice in localStorage so it never
 * reappears unless the user clears storage.
 */
export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* localStorage blocked — fail silent, don't badger the user */
    }
  }, []);

  function decide(value: "accepted" | "essential") {
    try { localStorage.setItem(KEY, value); } catch {}
    setShow(false);
  }

  if (!show) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 print:hidden">
      <div className="container py-3">
        <div className="flex flex-col items-stretch gap-3 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-200 sm:flex-row sm:items-center">
          <p className="flex-1 text-sm text-slate-700">
            We use essential cookies to keep you signed in and remember your
            preferences. We do not use advertising cookies.{" "}
            <Link href="/legal/cookies" className="font-semibold text-brand-700 hover:underline">
              Read our cookie policy
            </Link>.
          </p>
          <div className="flex gap-2">
            <button onClick={() => decide("essential")} className="btn-ghost px-4 py-2 text-sm">
              Essential only
            </button>
            <button onClick={() => decide("accepted")} className="btn-primary px-4 py-2 text-sm">
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
