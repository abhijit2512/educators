"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window { paypal?: any }
}

type Props = {
  invoiceId: string;
  amount: number | string;
  currency: string;
  status: string;
  onPaid?: () => void;
};

/**
 * PayPal Smart Buttons. Loads the SDK only when NEXT_PUBLIC_PAYPAL_CLIENT_ID
 * is configured; otherwise renders a clear fallback so the page never looks
 * broken. Skips entirely once the invoice is already PAID.
 */
export function PayInvoiceButton({ invoiceId, amount, currency, status, onPaid }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState("");
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const amt = Number(amount);

  useEffect(() => {
    if (!sdkReady || renderedRef.current || !containerRef.current || !window.paypal) return;
    renderedRef.current = true;
    window.paypal
      .Buttons({
        style: { layout: "vertical", shape: "rect", label: "pay" },
        createOrder: async () => {
          const res = await fetch("/api/payments/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: amt, currency, invoiceId }),
          });
          if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            throw new Error(j.error || "Could not create order");
          }
          const data = await res.json();
          return data.id;
        },
        onApprove: async (data: any) => {
          const res = await fetch("/api/payments/paypal/capture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderID, invoiceId }),
          });
          if (!res.ok) {
            setError("Payment captured by PayPal but our system failed to record it. Please contact us with order ID " + data.orderID);
            return;
          }
          onPaid?.();
          window.location.reload();
        },
        onError: (err: any) => {
          setError(err?.message || "PayPal payment failed. Please try again.");
        },
      })
      .render(containerRef.current);
  }, [sdkReady, amt, currency, invoiceId, onPaid]);

  if (status === "PAID") {
    return (
      <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-200">
        ✓ This invoice has been paid. Thank you.
      </div>
    );
  }

  if (!clientId) {
    return (
      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">
        <p className="font-semibold text-ink-900">Pay this invoice</p>
        <p className="mt-1">
          Online payment isn&apos;t configured yet. Please contact us to arrange a bank
          transfer or other payment method — our details are at the bottom of the page.
        </p>
      </div>
    );
  }

  const sdkUrl = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}&intent=capture`;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
      <p className="mb-3 text-sm font-semibold text-ink-900">Pay this invoice</p>
      <Script src={sdkUrl} strategy="afterInteractive" onLoad={() => setSdkReady(true)} />
      <div ref={containerRef} />
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      <p className="mt-3 text-xs text-slate-500">
        Payments are processed securely by PayPal. Your card or PayPal balance can both be used.
      </p>
    </div>
  );
}
