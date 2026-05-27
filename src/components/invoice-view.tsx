"use client";
import { useEffect, useState } from "react";

type Invoice = {
  id: string;
  number: string;
  amount: any;
  currency: string;
  status: string;
  issuedAt: string | Date;
  dueAt?: string | Date | null;
  lineItems: string;
  enquiry?: { serviceSlug: string; name: string; email: string };
};

export function InvoiceView({ invoice }: { invoice: Invoice }) {
  const [business, setBusiness] = useState<{ business_name: string; business_email: string; business_phone: string; business_address: string } | null>(null);

  useEffect(() => {
    fetch("/api/site-settings").then((r) => r.json()).then(setBusiness).catch(() => {});
  }, []);

  let lines: Array<{ label: string; amount: number }> = [];
  try { lines = JSON.parse(invoice.lineItems); } catch {}

  return (
    <div className="container max-w-3xl py-10 print:py-0">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <h1 className="h2">Invoice {invoice.number}</h1>
        <button onClick={() => window.print()} className="btn-primary">Print / Save as PDF</button>
      </div>
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-bold">{business?.business_name || "Academic Support Brand"}</div>
            <div className="text-xs text-slate-500">{business?.business_email}</div>
            <div className="text-xs text-slate-500">{business?.business_phone}</div>
            <div className="text-xs text-slate-500">{business?.business_address}</div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-slate-500">Invoice</div>
            <div className="font-mono text-lg">{invoice.number}</div>
            <div className="text-xs text-slate-500">Issued: {new Date(invoice.issuedAt).toLocaleDateString("en-GB")}</div>
            {invoice.dueAt && <div className="text-xs text-slate-500">Due: {new Date(invoice.dueAt).toLocaleDateString("en-GB")}</div>}
            <div className="mt-1 text-xs">Status: <strong>{invoice.status}</strong></div>
          </div>
        </div>

        {invoice.enquiry && (
          <div className="mt-6">
            <div className="text-xs uppercase tracking-wider text-slate-500">Bill to</div>
            <div>{invoice.enquiry.name}</div>
            <div className="text-xs text-slate-500">{invoice.enquiry.email}</div>
            <div className="text-xs text-slate-500">Service: {invoice.enquiry.serviceSlug}</div>
          </div>
        )}

        <table className="mt-6 w-full text-sm">
          <thead><tr className="border-b text-left text-xs uppercase text-slate-500"><th className="py-2">Description</th><th className="py-2 text-right">Amount</th></tr></thead>
          <tbody>
            {lines.length === 0 ? (
              <tr><td className="py-2">Academic support service</td><td className="py-2 text-right">{invoice.currency} {invoice.amount.toString()}</td></tr>
            ) : lines.map((l, i) => (
              <tr key={i} className="border-b"><td className="py-2">{l.label}</td><td className="py-2 text-right">{invoice.currency} {l.amount.toFixed(2)}</td></tr>
            ))}
          </tbody>
          <tfoot><tr><td className="pt-3 text-right font-semibold">Total</td><td className="pt-3 text-right font-bold">{invoice.currency} {invoice.amount.toString()}</td></tr></tfoot>
        </table>

        <p className="mt-8 text-xs text-slate-500">
          This invoice is for academic coaching and learning-support services. All
          support is provided for tutoring, guidance and reference only.
        </p>
      </div>
    </div>
  );
}
