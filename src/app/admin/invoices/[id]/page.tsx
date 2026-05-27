import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { InvoiceView } from "@/components/invoice-view";

export const dynamic = "force-dynamic";

export default async function AdminInvoicePage({ params }: { params: { id: string } }) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { enquiry: true },
  });
  if (!invoice) notFound();
  return <InvoiceView invoice={invoice as any} />;
}
