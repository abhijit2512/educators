import { Reveal } from "@/components/reveal";
import { prisma } from "@/lib/prisma";
import { DEFAULT_FAQ } from "@/lib/content-defaults";

export const metadata = { title: "Frequently asked questions" };
export const dynamic = "force-dynamic";

async function safeFaq() {
  try {
    const rows = await prisma.faqItem.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    });
    if (rows.length) return rows.map((r) => [r.question, r.answer] as const);
  } catch {
    /* fall through to defaults */
  }
  return DEFAULT_FAQ;
}

export default async function FAQPage() {
  const faq = await safeFaq();
  return (
    <section className="section">
      <div className="container max-w-3xl">
        <div className="text-center">
          <span className="eyebrow">FAQ</span>
          <h1 className="h1 mt-2">Frequently asked questions</h1>
        </div>
        <div className="mt-10 space-y-3">
          {faq.map(([q, a], i) => (
            <Reveal key={i} delay={i * 0.02}>
              <details className="group rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 open:ring-brand-200">
                <summary className="cursor-pointer list-none text-base font-semibold text-ink-900 marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {q}
                    <span className="text-brand-600 transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-slate-700">{a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
