import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/reveal";
import { iconFor } from "@/components/service-icons";
import { IntegrityBanner } from "@/components/integrity-banner";
import { getSiteSettings } from "@/lib/settings";

export const metadata = { title: "Services" };

async function safeServices() {
  try {
    return await prisma.service.findMany({
      where: { visible: true },
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await safeServices();
  const settings = await getSiteSettings();
  const grouped = services.reduce<Record<string, typeof services>>((acc, s) => {
    const k = s.category || "Other";
    (acc[k] = acc[k] || []).push(s);
    return acc;
  }, {});

  return (
    <section className="section">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Services</span>
          <h1 className="h1 mt-2">Academic coaching and learning support</h1>
          <p className="lead mt-4">
            Every service below is delivered for tutoring, learning and guidance
            purposes only. Students remain responsible for their own submitted
            work.
          </p>
        </div>

        {services.length === 0 ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            Services will appear here once the database is set up and seeded.
          </p>
        ) : (
          <div className="mt-12 space-y-12">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h2 className="h3">{category}</h2>
                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((s, i) => (
                    <Reveal key={s.slug} delay={i * 0.03}>
                      <article id={s.slug} className="card h-full transition hover:-translate-y-1 hover:shadow-glow">
                        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                          {iconFor(s.category)}
                        </div>
                        <h3 className="text-base font-semibold">{s.title}</h3>
                        <p className="mt-1.5 text-sm text-slate-600 line-clamp-4">{s.summary}</p>
                        <div className="mt-4 flex gap-2 text-sm">
                          <Link href={`/contact?service=${encodeURIComponent(s.slug)}`} className="font-medium text-brand-700 hover:underline">
                            Request a Quote →
                          </Link>
                        </div>
                      </article>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-14">
          <IntegrityBanner text={settings.integrity_disclaimer} />
        </div>
      </div>
    </section>
  );
}
