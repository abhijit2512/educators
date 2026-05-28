"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import type { SiteSettings } from "@/lib/settings";
import { SiteLogo } from "./site-logo";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/services/coding-and-programming", label: "Coding Support" },
  { href: "/pricing", label: "Pricing" },
  { href: "/samples", label: "Samples" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const headerPy = Number(settings.header_padding_y) || 12;
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div
        className="container flex items-center justify-between gap-3"
        style={{ paddingTop: headerPy, paddingBottom: headerPy }}
      >
        <SiteLogo logoUrl={settings.logo_url} businessName={settings.business_name} size={40} />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-ink-900"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {session?.user ? (
            <>
              {session.user.role === "ADMIN" && (
                <Link href="/admin" className="btn-ghost">Admin</Link>
              )}
              <Link href="/dashboard" className="btn-ghost">Dashboard</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-primary">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">Sign in</Link>
              <Link href="/contact" className="btn-primary">Request a Quote</Link>
            </>
          )}
        </div>

        <button
          aria-label="Toggle menu"
          className="rounded-lg p-2 ring-1 ring-slate-200 lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 bg-white lg:hidden"
          >
            <div className="container flex flex-col gap-1 py-3">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2">
                {session?.user ? (
                  <>
                    <Link href="/dashboard" className="btn-ghost flex-1" onClick={() => setOpen(false)}>
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="btn-primary flex-1"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="btn-ghost flex-1" onClick={() => setOpen(false)}>
                      Sign in
                    </Link>
                    <Link href="/contact" className="btn-primary flex-1" onClick={() => setOpen(false)}>
                      Request a Quote
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
