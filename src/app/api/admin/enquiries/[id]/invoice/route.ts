import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { generateInvoiceNumber } from "@/lib/invoice";
import { sendMail } from "@/lib/mailer";

const schema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("GBP"),
  lineItems: z.array(z.object({ label: z.string(), amount: z.number() })).optional(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin();
  if (!g.ok) return g.response;
  const data = schema.parse(await req.json());

  const enquiry = await prisma.enquiry.findUnique({ where: { id: params.id } });
  if (!enquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const number = await generateInvoiceNumber();
  const invoice = await prisma.invoice.create({
    data: {
      number,
      enquiryId: enquiry.id,
      userId: enquiry.userId,
      amount: data.amount as any,
      currency: data.currency,
      status: "PENDING",
      lineItems: JSON.stringify(data.lineItems ?? [{ label: `Service: ${enquiry.serviceSlug}`, amount: data.amount }]),
    },
  });

  // Also create a matching pending Payment record for tracking
  await prisma.payment.create({
    data: {
      enquiryId: enquiry.id,
      amount: data.amount as any,
      currency: data.currency,
      provider: "MANUAL",
      status: "PENDING",
    },
  });

  sendMail({
    to: enquiry.email,
    subject: `Invoice ${number} from ${process.env.BUSINESS_NAME ?? "Academic Support"}`,
    html: `<p>Hi ${enquiry.name},</p><p>Your invoice <strong>${number}</strong> for <strong>${data.currency} ${data.amount.toFixed(2)}</strong> is ready.</p><p>You can view it in your dashboard.</p>`,
  }).catch(() => {});

  return NextResponse.json({ ok: true, invoice });
}
