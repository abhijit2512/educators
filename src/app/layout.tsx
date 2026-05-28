import "./globals.css";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FloatingCTA } from "@/components/floating-cta";
import { CookieConsent } from "@/components/cookie-consent";
import { Providers } from "./providers";

// Render every route dynamically so admin content edits (services, pricing,
// settings, logo, header/footer) appear on the live site immediately instead
// of being frozen into a static build.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const title = `${s.business_name} — Ethical academic support & tutoring`;
  const description =
    "Academic coaching, dissertation guidance, research-method support, SPSS/NVivo tutoring, coding learning support, proofreading and referencing guidance for UK and international students.";
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://educatorsunited.in";
  const logo = s.logo_url || "/logo.svg";
  return {
    metadataBase: new URL(site),
    title: { default: title, template: `%s · ${s.business_name}` },
    description,
    icons: {
      icon: [{ url: logo }, { url: "/logo.svg", type: "image/svg+xml" }],
      apple: logo,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: site,
      siteName: s.business_name,
      images: [{ url: logo }],
    },
    twitter: { card: "summary_large_image", title, description, images: [logo] },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://educatorsunited.in";
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: settings.business_name,
    url: site,
    logo: settings.logo_url?.startsWith("http") ? settings.logo_url : `${site}${settings.logo_url || "/logo.svg"}`,
    email: settings.business_email,
    telephone: settings.business_phone,
    sameAs: [settings.business_facebook].filter(Boolean),
    areaServed: ["United Kingdom", "Worldwide"],
  };
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Providers>
          <SiteHeader settings={settings} />
          <main className="min-h-[60vh]">{children}</main>
          <SiteFooter settings={settings} />
          <FloatingCTA />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
