import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const schema = z.object({
  status: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin();
  if (!g.ok) return g.response;
  const { status } = schema.parse(await req.json());
  const payment = await prisma.payment.update({
    where: { id: params.id },
    data: { status },
  });

  // If paid, also mark related invoice paid and enquiry status PAID
  if (status === "PAID") {
    await prisma.invoice.updateMany({
      where: { enquiryId: payment.enquiryId, status: "PENDING" },
      data: { status: "PAID" },
    });
    await prisma.enquiry.update({
      where: { id: payment.enquiryId },
      data: { status: "PAID" },
    });
  }
  return NextResponse.json({ ok: true });
}
