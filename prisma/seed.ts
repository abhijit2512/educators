/**
 * Seed script — creates the initial admin user, default services, pricing
 * plans, and site settings. Safe to re-run (uses upserts).
 *
 *   npm run seed
 */
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_SETTINGS: Record<string, string> = {
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

const SERVICES = [
  ["dissertation-guidance", "Dissertation guidance", "Research", "Structure, methodology and chapter-by-chapter coaching for undergraduate, Master’s and doctoral dissertations."],
  ["research-proposal-guidance", "Research proposal guidance", "Research", "Help shaping research questions, aims, objectives, literature scope and methodology for proposals."],
  ["literature-review-guidance", "Literature review guidance", "Research", "Coaching on searching, screening, synthesising and critically evaluating sources."],
  ["research-method-support", "Research-method support", "Research", "Guidance on qualitative, quantitative and mixed-methods design, sampling and ethics."],
  ["spss-tutoring", "SPSS and statistical analysis tutoring", "Data", "One-to-one tutoring on descriptive stats, t-tests, ANOVA, regression, factor analysis and reporting in SPSS."],
  ["nvivo-support", "NVivo qualitative analysis support", "Data", "Walk-through coaching on coding, themes and node structures in NVivo."],
  ["excel-accounting", "Excel and accounting guidance", "Data", "Spreadsheets, formulas, financial modelling, ratios and accounting fundamentals — taught step by step."],
  ["powerpoint-presentation", "PowerPoint presentation support", "Communication", "Slide design coaching, structure, narrative and speaker-note guidance."],
  ["academic-poster", "Academic poster design support", "Communication", "Layout, hierarchy and visual storytelling coaching for conference posters."],
  ["law-study-support", "Law study support", "Subject", "Case-law reading, IRAC framework coaching, OSCOLA referencing guidance."],
  ["humanities-support", "Humanities support", "Subject", "Essay-planning, critical-reading and argumentation coaching across humanities subjects."],
  ["computer-science-learning", "Computer science learning support", "Tech", "Algorithm walk-throughs, data-structure tutorials and concept explanations."],
  ["electronics-technical", "Electronics and technical-subject guidance", "Tech", "Concept tutoring across circuits, signals and other technical foundations."],
  ["proofreading-editing", "Proofreading, editing, formatting and referencing guidance", "Editing", "Clarity, grammar, style, Harvard/APA/MLA/OSCOLA referencing and formatting coaching."],
  ["coding-and-programming", "Coding and programming learning support", "Tech", "Tutoring, debugging walk-throughs, code review and explanation across popular languages."],
];

const PRICING_PLANS = [
  {
    slug: "basic-learning-support",
    title: "Basic Learning Support",
    summary: "Short coaching sessions, quick concept clarifications and study-planning help.",
    features: ["Up to 60 min mentor time", "Concept explanation", "Study-plan guidance", "Email follow-up"],
  },
  {
    slug: "standard-academic-guidance",
    title: "Standard Academic Guidance",
    summary: "Structured help for essays, reports and presentations — planning, feedback and revisions.",
    features: ["Topic brainstorming", "Structure and outline coaching", "Two rounds of feedback", "Referencing guidance"],
  },
  {
    slug: "advanced-research-guidance",
    title: "Advanced Research Guidance",
    summary: "In-depth coaching for dissertations, theses and research-method work.",
    features: ["Methodology coaching", "Data-analysis tutoring (SPSS/NVivo/Excel)", "Chapter-by-chapter feedback", "Referencing and formatting review"],
  },
  {
    slug: "coding-technical-support",
    title: "Coding and Technical Support",
    summary: "Programming tutoring, debugging walk-throughs and code-explanation sessions.",
    features: ["Language: Python / JS / Java / SQL and more", "Debugging walk-through", "Code review and explanation", "Concept and logic coaching"],
  },
  {
    slug: "custom-project-support",
    title: "Custom Project Support",
    summary: "Bespoke ongoing mentorship for larger projects or longer programmes.",
    features: ["Tailored plan", "Multiple mentor sessions", "Milestone reviews", "Priority email support"],
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@your-domain.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMeNow!123";
  const adminName = process.env.ADMIN_NAME ?? "Site Admin";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN, name: adminName },
    create: { email: adminEmail, passwordHash, role: Role.ADMIN, name: adminName },
  });
  console.log(`✓ Admin user ready: ${adminEmail}`);

  for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
    await prisma.siteSetting.upsert({
      where: { key: k },
      update: {}, // do not overwrite admin-edited values on re-seed
      create: { key: k, value: v },
    });
  }
  console.log(`✓ Site settings ready`);

  for (let i = 0; i < SERVICES.length; i++) {
    const [slug, title, category, summary] = SERVICES[i];
    await prisma.service.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title,
        summary,
        body: summary + "\n\nAll support is provided for learning, tutoring, guidance and reference purposes only. Students remain responsible for submitting their own work.",
        category,
        order: i,
      },
    });
  }
  console.log(`✓ ${SERVICES.length} services ready`);

  for (let i = 0; i < PRICING_PLANS.length; i++) {
    const p = PRICING_PLANS[i];
    await prisma.pricingPlan.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        features: JSON.stringify(p.features),
        ctaLabel: "Request a Custom Quote",
        order: i,
      },
    });
  }
  console.log(`✓ ${PRICING_PLANS.length} pricing plans ready`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
