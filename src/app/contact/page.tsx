import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { Reveal } from "@/components/reveal";
import { EnquiryForm } from "@/components/enquiry-form";

export const metadata = { title: "Contact" };
export const dynamic = "force-dynamic";

async function safeServices() {
  try {
    return await prisma.service.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      select: { slug: true, title: true },
    });
  } catch {
    return [
      { slug: "dissertation-guidance", title: "Dissertation guidance" },
      { slug: "spss-tutoring", title: "SPSS tutoring" },
      { slug: "coding-and-programming", title: "Coding & programming" },
      { slug: "proofreading-editing", title: "Proofreading & editing" },
    ];
  }
}

export default async function ContactPage() {
  const [s, services] = await Promise.all([getSiteSettings(), safeServices()]);
  return (
    <section className="section">
      <div className="container grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Reveal>
            <span className="eyebrow">Contact</span>
            <h1 className="h1 mt-2">Talk to a mentor</h1>
            <p className="lead mt-4">
              Tell us what you need help with. We typically respond within one
              working day.
            </p>
          </Reveal>
          <div className="mt-8 space-y-3 text-sm text-slate-700">
            <p><strong>Email:</strong> <a href={`mailto:${s.business_email}`}>{s.business_email}</a></p>
            <p><strong>Phone:</strong> <a href={`tel:${s.business_phone}`}>{s.business_phone}</a></p>
            <p><strong>WhatsApp:</strong> <a href={`https://wa.me/${s.business_whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">{s.business_whatsapp}</a></p>
            <p><strong>Facebook:</strong> <a href={s.business_facebook} target="_blank" rel="noreferrer">Page</a></p>
            <p><strong>Address:</strong> {s.business_address}</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Suspense fallback={<div className="card">Loading form…</div>}>
            <EnquiryForm services={services} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
