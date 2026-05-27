import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EnquiryAdminPanel } from "@/components/enquiry-admin-panel";

export const dynamic = "force-dynamic";

export default async function AdminEnquiryDetail({ params }: { params: { id: string } }) {
  const enquiry = await prisma.enquiry.findUnique({
    where: { id: params.id },
    include: { updates: { orderBy: { createdAt: "asc" } }, payments: true, invoices: true, user: true },
  });
  if (!enquiry) notFound();
  return <EnquiryAdminPanel enquiry={enquiry as any} />;
}
