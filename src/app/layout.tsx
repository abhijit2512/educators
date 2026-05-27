import "./globals.css";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FloatingCTA } from "@/components/floating-cta";
import { Providers } from "./providers";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const title = `${s.business_name} — Ethical academic support & tutoring`;
  const description =
    "Academic coaching, dissertation guidance, research-method support, SPSS/NVivo tutoring, coding learning support, proofreading and referencing guidance for UK and international students.";
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://educatorsunited.in";
  const logo = s.logo_url || "/logo.png";
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
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Providers>
          <SiteHeader settings={settings} />
          <main className="min-h-[60vh]">{children}</main>
          <SiteFooter settings={settings} />
          <FloatingCTA />
        </Providers>
      </body>
    </html>
  );
}
