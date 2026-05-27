import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { sendMail } from "@/lib/mailer";

const schema = z.object({
  status: z.enum(["NEW", "QUOTED", "PAID", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin();
  if (!g.ok) return g.response;
  const { status } = schema.parse(await req.json());
  const enquiry = await prisma.enquiry.update({
    where: { id: params.id },
    data: { status },
  });

  // Notify student
  sendMail({
    to: enquiry.email,
    subject: `Your request status: ${status}`,
    html: `<p>Hi ${enquiry.name},</p><p>The status of your request <code>${enquiry.id}</code> has been updated to <strong>${status}</strong>.</p>`,
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
