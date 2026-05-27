import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";
import { SiteLogo } from "./site-logo";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3">
            <SiteLogo logoUrl={settings.logo_url} businessName={settings.business_name} size={36} />
          </div>
          <p className="text-sm text-slate-600">{settings.footer_text}</p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-ink-900">Explore</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/services/coding-and-programming">Coding & Programming</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/samples">Samples</Link></li>
            <li><Link href="/how-it-works">How it works</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-ink-900">Legal</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/legal/academic-integrity">Academic Integrity</Link></li>
            <li><Link href="/legal/terms">Terms & Conditions</Link></li>
            <li><Link href="/legal/privacy">Privacy Policy</Link></li>
            <li><Link href="/legal/refund">Refund Policy</Link></li>
            <li><Link href="/legal/cookies">Cookie Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-ink-900">Contact</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Email: <a href={`mailto:${settings.business_email}`}>{settings.business_email}</a></li>
            <li>Phone: <a href={`tel:${settings.business_phone}`}>{settings.business_phone}</a></li>
            <li>WhatsApp: <a href={`https://wa.me/${settings.business_whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">{settings.business_whatsapp}</a></li>
            <li>Facebook: <a href={settings.business_facebook} target="_blank" rel="noreferrer">Page</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <div className="container flex flex-col gap-3 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {settings.business_name}. All rights reserved.</p>
          <p className="max-w-2xl text-right">
            {settings.integrity_disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
