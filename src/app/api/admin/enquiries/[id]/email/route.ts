import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { sendMail } from "@/lib/mailer";
import { getSiteSettings } from "@/lib/settings";

const schema = z.object({
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(8000),
  logToTimeline: z.boolean().optional(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin();
  if (!g.ok) return g.response;

  const { subject, message, logToTimeline } = schema.parse(await req.json());

  const enquiry = await prisma.enquiry.findUnique({ where: { id: params.id } });
  if (!enquiry) return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });

  const settings = await getSiteSettings();
  const safe = message.replace(/\n/g, "<br/>");
  const result = await sendMail({
    to: enquiry.email,
    subject,
    html: `<div style="font-family:Inter,system-ui,Arial,sans-serif;color:#0b1020">
             <p>Dear ${enquiry.name},</p>
             <div>${safe}</div>
             <p style="margin-top:16px">Kind regards,<br/>${settings.business_name}</p>
             <hr style="margin-top:16px;border:none;border-top:1px solid #e2e8f0"/>
             <p style="color:#64748b;font-size:12px">This message relates to your enquiry reference <code>${enquiry.id}</code>. We provide tutoring and learning support only.</p>
           </div>`,
  });

  if ("skipped" in result && result.skipped) {
    return NextResponse.json(
      { ok: false, error: "Email isn't configured (SMTP). Set SMTP_* env vars to send." },
      { status: 503 },
    );
  }

  // Optionally record it on the student's request timeline so they also see it
  // in their dashboard.
  if (logToTimeline) {
    await prisma.requestUpdate.create({
      data: {
        enquiryId: enquiry.id,
        authorId: g.session.user.id,
        authorRole: "ADMIN",
        message: `📧 Emailed: ${subject}\n\n${message}`,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
