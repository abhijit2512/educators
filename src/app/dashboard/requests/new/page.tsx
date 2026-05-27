import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { EnquiryForm } from "@/components/enquiry-form";

export const dynamic = "force-dynamic";

async function safeServices() {
  try {
    return await prisma.service.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      select: { slug: true, title: true },
    });
  } catch {
    return [];
  }
}

export default async function NewRequestPage() {
  const services = await safeServices();
  return (
    <div className="space-y-4">
      <h1 className="h2">Submit a new request</h1>
      <p className="text-sm text-slate-600">
        Tell us what you need help with. We&apos;ll reply with an ethical
        learning plan and a quote.
      </p>
      <Suspense>
        <EnquiryForm services={services} />
      </Suspense>
    </div>
  );
}
