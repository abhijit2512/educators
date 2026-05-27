import { prisma } from "./prisma";

const FALLBACKS: Record<string, string> = {
  business_name: process.env.BUSINESS_NAME ?? "Educators United Pvt Ltd",
  business_email: process.env.BUSINESS_EMAIL ?? "hello@educatorsunited.in",
  business_phone: process.env.BUSINESS_PHONE ?? "+44 0000 000000",
  business_whatsapp: process.env.BUSINESS_WHATSAPP ?? "+44 0000 000000",
  business_facebook: process.env.BUSINESS_FACEBOOK ?? "https://facebook.com/educatorsunited",
  business_address: "United Kingdom (worldwide online support)",
  logo_url: process.env.BUSINESS_LOGO_URL ?? "/logo.png",
  hero_headline: "Ethical academic support for UK and international students",
  hero_subheading:
    "Tutoring, research-method coaching, coding guidance, proofreading and learning support — delivered by qualified subject mentors. We help you learn; you submit your own work.",
  footer_text:
    "We provide academic coaching, tutoring and learning support. We do not complete assessed work on behalf of students.",
  integrity_disclaimer:
    "We do not complete assessed work on behalf of students. All support is provided for learning, guidance, editing, tutoring, research-method support, coding explanation, debugging, and reference purposes only. Students remain responsible for understanding, adapting, and submitting their own work according to their institution’s academic integrity rules.",
};

export type SiteSettings = typeof FALLBACKS;

/**
 * Load all site settings. Falls back gracefully when the database is
 * unavailable (e.g. during local build before `prisma migrate deploy`).
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await prisma.siteSetting.findMany();
    const map: Record<string, string> = { ...FALLBACKS };
    for (const r of rows) map[r.key] = r.value;
    return map as SiteSettings;
  } catch {
    return { ...FALLBACKS };
  }
}

export async function setSiteSetting(key: string, value: string) {
  return prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
