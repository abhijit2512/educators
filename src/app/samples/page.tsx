import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/reveal";
import { IntegrityBanner } from "@/components/integrity-banner";

export const metadata = { title: "Samples" };

async function safeSamples() {
  try {
    return await prisma.samplePaper.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function SamplesPage() {
  const samples = await safeSamples();
  return (
    <section className="section">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Samples</span>
          <h1 className="h1 mt-2">Sample resources and learning materials</h1>
        </div>

        <div className="mt-8">
          <IntegrityBanner text="Samples are for learning and reference only. They must not be submitted as student work." />
        </div>

        {samples.length === 0 ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            Samples will appear here once added from the admin dashboard.
          </p>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {samples.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.03}>
                <article className="card h-full">
                  {s.subject && <div className="badge mb-2">{s.subject}</div>}
                  <h3 className="text-base font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 line-clamp-4">{s.description}</p>
                  {(s.fileUrl || s.externalUrl) && (
                    <a
                      href={s.fileUrl || s.externalUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-block text-sm font-medium text-brand-700 hover:underline"
                    >
                      View sample →
                    </a>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
