"use client";
import { useEffect, useState } from "react";

type Settings = {
  business_phone?: string;
  business_whatsapp?: string;
  business_email?: string;
};

function digitsOnly(s?: string) {
  return (s || "").replace(/[^0-9]/g, "");
}

/**
 * Sticky floating CTA in the bottom-right corner — WhatsApp + phone + email
 * shortcuts. Reads numbers from /api/site-settings so changes in the admin
 * panel propagate without redeploy. Hides itself if no contact info is set
 * and on the admin/dashboard surfaces.
 */
export function FloatingCTA() {
  const [s, setS] = useState<Settings | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/site-settings").then((r) => r.json()).then(setS).catch(() => {});
  }, []);

  if (typeof window !== "undefined") {
    const p = window.location.pathname;
    if (p.startsWith("/admin") || p.startsWith("/dashboard")) return null;
  }
  if (!s) return null;

  const wa = digitsOnly(s.business_whatsapp);
  const tel = digitsOnly(s.business_phone);
  if (!wa && !tel && !s.business_email) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 print:hidden">
      {open && (
        <div className="flex flex-col gap-2">
          {wa && (
            <a
              href={`https://wa.me/${wa}?text=Hi%2C%20I%27d%20like%20academic%20support`}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-emerald-600/40 transition hover:bg-emerald-600"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon />
              <span>WhatsApp</span>
            </a>
          )}
          {tel && (
            <a
              href={`tel:${tel}`}
              className="flex items-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-brand-700/40 transition hover:bg-brand-700"
              aria-label="Call us"
            >
              <PhoneIcon />
              <span>Call</span>
            </a>
          )}
          {s.business_email && (
            <a
              href={`mailto:${s.business_email}`}
              className="flex items-center gap-2 rounded-full bg-ink-900 px-4 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-ink-800/40 transition hover:bg-ink-800"
              aria-label="Email us"
            >
              <MailIcon />
              <span>Email</span>
            </a>
          )}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-2xl ring-1 ring-emerald-700/40 transition hover:scale-105"
        aria-label={open ? "Close contact menu" : "Open contact menu"}
        aria-expanded={open}
      >
        {open ? <CloseIcon /> : <WhatsAppIcon />}
      </button>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <path d="M20.5 3.5A11 11 0 0 0 3 17l-1 5 5.1-1.3a11 11 0 0 0 13.4-17.2zM12 21a9 9 0 0 1-4.6-1.3l-.3-.2-3 .8.8-3-.2-.3A9 9 0 1 1 12 21zm5.2-6.4c-.3-.2-1.7-.8-2-.9s-.4 0-.6.2-.7.9-.9 1.1-.3.2-.6 0-1.2-.4-2.3-1.4a8.7 8.7 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5s0-.4 0-.6-.6-1.5-.8-2-.5-.5-.6-.5h-.6c-.2 0-.5.1-.7.3a3 3 0 0 0-1 2.3c0 1.4 1 2.7 1.2 2.9s2 3.1 4.9 4.3a16 16 0 0 0 1.6.6c.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.4s.3-1.2.2-1.4-.3-.2-.5-.3z"/>
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L8 9.5a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6A2 2 0 0 1 22 16.9z"/>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
      <path d="m22 7-10 6L2 7"/>
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
      <path d="M6 6l12 12M18 6 6 18"/>
    </svg>
  );
}
