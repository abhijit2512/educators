import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://educatorsunited.in";

const STATIC_PATHS = [
  "", "/about", "/services", "/services/coding-and-programming",
  "/pricing", "/samples", "/how-it-works", "/contact", "/faq",
  "/legal/academic-integrity", "/legal/terms", "/legal/privacy",
  "/legal/refund", "/legal/cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1.0 : 0.7,
  }));

  // Pull every visible service so its detail page is indexable. Falls back
  // silently if the DB isn't reachable (e.g. during the very first build).
  try {
    const services = await prisma.service.findMany({
      where: { visible: true },
      select: { slug: true, updatedAt: true },
    });
    for (const s of services) {
      if (s.slug === "coding-and-programming") continue; // already in static list
      entries.push({
        url: `${BASE}/services/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    /* DB unavailable — static entries are still served */
  }

  return entries;
}
