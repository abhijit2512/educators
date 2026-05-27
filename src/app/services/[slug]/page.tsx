import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { Reveal } from "@/components/reveal";
import { IntegrityBanner } from "@/components/integrity-banner";
import { iconFor } from "@/components/service-icons";

export const dynamic = "force-dynamic";

async function loadService(slug: string) {
  try {
    return await prisma.service.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

async function loadRelated(slug: string, category: string | null) {
  try {
    return await prisma.service.findMany({
      where: {
        visible: true,
        slug: { not: slug },
        ...(category ? { category } : {}),
      },
      orderBy: { order: "asc" },
      take: 3,
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const svc = await loadService(params.slug);
  if (!svc) return { title: "Service not found" };
  const desc = svc.summary?.slice(0, 160) ?? "";
  return {
    title: svc.title,
    description: desc,
    openGraph: { title: svc.title, description: desc, type: "article" },
    alternates: { canonical: `/services/${svc.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const svc = await loadService(params.slug);
  if (!svc) notFound();
  const [settings, related] = await Promise.all([
    getSiteSettings(),
    loadRelated(svc.slug, svc.category),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc.title,
    description: svc.summary,
    provider: {
      "@type": "Organization",
      name: settings.business_name,
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://educatorsunited.in",
    },
    areaServed: ["United Kingdom", "Worldwide"],
    category: svc.category ?? "Academic support",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-hero-radial" />
        <div className="container relative pt-12 pb-10">
          <nav className="mb-4 text-xs text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:underline">Services</Link>
            <span className="mx-2">/</span>
            <span className="text-ink-900">{svc.title}</span>
          </nav>
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                {iconFor(svc.category)}
              </span>
              {svc.category && <span className="badge">{svc.category}</span>}
            </div>
            <h1 className="h1 mt-4 max-w-3xl">{svc.title}</h1>
            <p className="lead mt-4 max-w-3xl">{svc.summary}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/contact?service=${encodeURIComponent(svc.slug)}`} className="btn-primary">
                Request a Quote
              </Link>
              <Link href="/pricing" className="btn-ghost">See pricing</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section pt-6">
        <div className="container grid gap-10 lg:grid-cols-[1fr,320px]">
          <article className="prose-academic max-w-none">
            <div className="card">
              <h2 className="h3">What this support looks like</h2>
              <div className="mt-3 whitespace-pre-wrap text-slate-700">{svc.body || svc.summary}</div>

              <h2 className="h3 mt-8">How sessions work</h2>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li>Initial enquiry — you tell us your subject, level and what you need help with.</li>
                <li>An ethical learning plan and a transparent quote.</li>
                <li>One-to-one mentor sessions, written feedback, or walk-throughs (your choice).</li>
                <li>You produce your own work; we help you understand it.</li>
                <li>Follow-up questions and review available after each session.</li>
              </ul>

              <h2 className="h3 mt-8">Who this is for</h2>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-700">
                <li>UK undergraduate, postgraduate and doctoral students.</li>
                <li>International students studying online or on UK campuses.</li>
                <li>Professional learners returning to academia.</li>
              </ul>
            </div>

            <div className="mt-6">
              <IntegrityBanner text={settings.integrity_disclaimer} />
            </div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="card">
              <h3 className="text-base font-semibold">Talk to a mentor</h3>
              <p className="mt-1 text-sm text-slate-600">
                Tell us about your topic, deadline and goals. We typically reply within one working day.
              </p>
              <Link href={`/contact?service=${encodeURIComponent(svc.slug)}`} className="btn-primary mt-4 w-full">
                Start an enquiry
              </Link>
              <div className="mt-4 space-y-1 text-sm text-slate-700">
                <p>📧 <a className="hover:underline" href={`mailto:${settings.business_email}`}>{settings.business_email}</a></p>
                <p>📞 <a className="hover:underline" href={`tel:${settings.business_phone}`}>{settings.business_phone}</a></p>
                <p>💬 <a className="hover:underline" target="_blank" rel="noreferrer" href={`https://wa.me/${settings.business_whatsapp.replace(/[^0-9]/g, "")}`}>WhatsApp us</a></p>
              </div>
            </div>

            {related.length > 0 && (
              <div className="card">
                <h3 className="text-base font-semibold">Related services</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/services/${r.slug}`} className="font-medium text-brand-700 hover:underline">
                        {r.title}
                      </Link>
                      <p className="mt-0.5 text-slate-600 line-clamp-2">{r.summary}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
