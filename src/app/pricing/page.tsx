import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/reveal";

export const metadata = { title: "Pricing" };

async function safePlans() {
  try {
    return await prisma.pricingPlan.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function PricingPage() {
  const plans = await safePlans();

  return (
    <section className="section">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Pricing</span>
          <h1 className="h1 mt-2">Quote-based pricing</h1>
          <p className="lead mt-4">
            Final pricing depends on complexity, deadline, academic level, word count,
            data-analysis needs, coding-support needs, editing requirements and type
            of guidance requested.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(plans.length ? plans : FALLBACK_PLANS).map((p, i) => {
            let features: string[] = [];
            try {
              features = typeof (p as any).features === "string"
                ? JSON.parse((p as any).features)
                : (p as any).features;
            } catch {}
            return (
              <Reveal key={p.slug} delay={i * 0.05}>
                <div className="card flex h-full flex-col">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{p.summary}</p>
                  <ul className="mt-5 space-y-2 text-sm text-slate-700">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-0.5 text-brand-600">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <Link href="/contact" className="btn-primary w-full">
                      {(p as any).ctaLabel || "Request a Custom Quote"}
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-10 text-center text-sm text-slate-500">
          Prices are quoted in GBP by default; we accept payments via Stripe, PayPal and bank transfer.
        </div>
      </div>
    </section>
  );
}

const FALLBACK_PLANS = [
  { slug: "basic", title: "Basic Learning Support", summary: "Short coaching sessions.", features: JSON.stringify(["Up to 60 min mentor time","Concept explanation"]), ctaLabel: "Request a Custom Quote" },
  { slug: "standard", title: "Standard Academic Guidance", summary: "Essays and reports.", features: JSON.stringify(["Outline coaching","Two rounds of feedback"]), ctaLabel: "Request a Custom Quote" },
  { slug: "advanced", title: "Advanced Research Guidance", summary: "Dissertations.", features: JSON.stringify(["Methodology coaching","Chapter feedback"]), ctaLabel: "Request a Custom Quote" },
  { slug: "coding", title: "Coding and Technical Support", summary: "Programming tutoring.", features: JSON.stringify(["Debugging walk-through","Code review"]), ctaLabel: "Request a Custom Quote" },
  { slug: "custom", title: "Custom Project Support", summary: "Bespoke mentorship.", features: JSON.stringify(["Tailored plan","Milestone reviews"]), ctaLabel: "Request a Custom Quote" },
];
