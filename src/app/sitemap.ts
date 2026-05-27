import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://educatorsunited.in";
  const paths = [
    "", "/about", "/services", "/services/coding-and-programming",
    "/pricing", "/samples", "/how-it-works", "/contact", "/faq",
    "/legal/academic-integrity", "/legal/terms", "/legal/privacy",
    "/legal/refund", "/legal/cookies",
  ];
  return paths.map((p) => ({ url: `${base}${p}`, lastModified: new Date() }));
}
