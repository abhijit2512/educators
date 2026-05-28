import { prisma } from "./prisma";
import { EXTENDED_DEFAULTS } from "./content-defaults";

const FALLBACKS: Record<string, string> = {
  ...EXTENDED_DEFAULTS,
  business_name: process.env.BUSINESS_NAME ?? "Educators United Pvt Ltd",
  business_email: process.env.BUSINESS_EMAIL ?? "hello@educatorsunited.in",
  business_phone: process.env.BUSINESS_PHONE ?? "+44 0000 000000",
  business_whatsapp: process.env.BUSINESS_WHATSAPP ?? "+44 0000 000000",
  business_facebook: process.env.BUSINESS_FACEBOOK ?? "https://facebook.com/educatorsunited",
  business_address: "United Kingdom (worldwide online support)",
  logo_url: process.env.BUSINESS_LOGO_URL ?? "/logo.svg",
  hero_headline: "Ethical academic support for UK and international students",
  hero_subheading:
    "Tutoring, research-method coaching, coding guidance, proofreading and learning support — delivered by qualified subject mentors. We help you learn; you submit your own work.",
  about_intro:
    "We are an academic learning-support service for UK and international students. We provide tutoring, research-method coaching, data-analysis walk-throughs, coding learning support, proofreading and referencing guidance.",
  about_mission:
    "Help every student understand their subject and produce their own work confidently, ethically and to a high academic standard.",
  about_approach:
    "One-to-one mentor sessions, written feedback, walk-through tutorials and reference examples — adapted to the student’s level and goals.",
  about_focus:
    "Familiar with UK university conventions and international academic standards; comfortable working across all major referencing styles.",
  services_intro:
    "Every service below is delivered for tutoring, learning and guidance purposes only. Students remain responsible for their own submitted work.",
  pricing_intro:
    "Final pricing depends on complexity, deadline, academic level, word count, data-analysis needs, coding-support needs, editing requirements and type of guidance requested.",
  pricing_note:
    "Prices are quoted in GBP by default; we accept payments via Stripe, PayPal and bank transfer.",
  why_heading: "Why students choose us",
  why_1_title: "Ethical by design",
  why_1_text: "We coach, tutor and review. We never complete assessed work for students.",
  why_2_title: "UK academic standards",
  why_2_text: "Mentors familiar with UK university conventions, OSCOLA, Harvard and APA.",
  why_3_title: "Worldwide students",
  why_3_text: "Online support for UK, EU, US, Middle East, Africa and Asia time zones.",
  how_heading: "From enquiry to learning, in 4 simple steps",
  how_1_title: "Submit your enquiry",
  how_1_text: "Tell us your subject, level and what you need help with.",
  how_2_title: "Get an ethical plan",
  how_2_text: "We recommend the right type of coaching, tutoring or guidance.",
  how_3_title: "Confirm and pay",
  how_3_text: "Secure payment via Stripe, PayPal or bank transfer.",
  how_4_title: "Learn with your mentor",
  how_4_text: "Sessions, feedback or walk-throughs — and you submit your own work.",
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
