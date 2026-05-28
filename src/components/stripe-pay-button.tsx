"use client";
import { useState } from "react";

/**
 * Redirects to a Stripe Checkout session. Only shown when Stripe is
 * configured (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY present) and the invoice
 * isn't already paid.
 */
export function StripePayButton({ invoiceId, status }: { invoiceId: string; status: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const enabled = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!enabled || status === "PAID") return null;

  async function pay() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/payments/stripe/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Could not start card payment.");
      setLoading(false);
      return;
    }
    const { url } = await res.json();
    if (url) window.location.href = url;
    else {
      setError("No checkout URL returned.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
      <p className="mb-3 text-sm font-semibold text-ink-900">Pay by card</p>
      <button onClick={pay} disabled={loading} className="btn-primary w-full">
        {loading ? "Redirecting…" : "Pay securely with card (Stripe)"}
      </button>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      <p className="mt-3 text-xs text-slate-500">You'll be redirected to Stripe's secure checkout.</p>
    </div>
  );
}
