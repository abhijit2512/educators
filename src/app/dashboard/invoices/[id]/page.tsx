import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { InvoiceView } from "@/components/invoice-view";

export const dynamic = "force-dynamic";

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { enquiry: true },
  });
  if (!invoice || invoice.userId !== session!.user.id) notFound();
  return <InvoiceView invoice={invoice as any} />;
}
