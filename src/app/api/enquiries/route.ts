import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { getSiteSettings } from "@/lib/settings";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  phone: z.string().max(40).optional().or(z.literal("")),
  country: z.string().max(80).optional().or(z.literal("")),
  university: z.string().max(160).optional().or(z.literal("")),
  serviceSlug: z.string().min(1).max(120),
  subject: z.string().max(160).optional().or(z.literal("")),
  academicLevel: z.string().max(80).optional().or(z.literal("")),
  deadline: z.string().optional().or(z.literal("")),
  wordCount: z.union([z.string(), z.number()]).optional(),
  programmingLanguage: z.string().max(80).optional().or(z.literal("")),
  description: z.string().min(10).max(8000),
  fileUrl: z.string().max(500).optional().or(z.literal("")),
  consent: z.boolean(),
  integrityAck: z.boolean(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }
  const data = parsed.data;
  if (!data.consent || !data.integrityAck) {
    return NextResponse.json({ error: "Please accept both consent boxes." }, { status: 400 });
  }
  const session = await getServerSession(authOptions);

  const deadline = data.deadline ? new Date(data.deadline) : null;
  const wordCount = data.wordCount
    ? Number(typeof data.wordCount === "string" ? data.wordCount.replace(/\D/g, "") : data.wordCount) || null
    : null;

  const enquiry = await prisma.enquiry.create({
    data: {
      userId: session?.user?.id ?? null,
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      country: data.country || null,
      university: data.university || null,
      serviceSlug: data.serviceSlug,
      subject: data.subject || null,
      academicLevel: data.academicLevel || null,
      deadline,
      wordCount: wordCount || null,
      programmingLanguage: data.programmingLanguage || null,
      description: data.description,
      fileUrl: data.fileUrl || null,
      consent: data.consent,
      integrityAck: data.integrityAck,
    },
  });

  // Fire-and-forget emails
  const settings = await getSiteSettings();
  const adminEmail = process.env.ADMIN_EMAIL || settings.business_email;
  Promise.all([
    sendMail({
      to: adminEmail,
      subject: `New enquiry: ${data.serviceSlug} — ${data.name}`,
      html: adminEmailHtml(enquiry.id, data),
    }),
    sendMail({
      to: data.email,
      subject: `We received your enquiry — ${settings.business_name}`,
      html: studentEmailHtml(settings.business_name, data),
    }),
  ]).catch((err) => console.error("[enquiry] email error", err));

  return NextResponse.json({ ok: true, id: enquiry.id });
}

function row(k: string, v?: string | null) {
  if (!v) return "";
  return `<tr><td style="padding:4px 8px;color:#475569;font-size:13px">${k}</td><td style="padding:4px 8px;font-size:13px"><strong>${escapeHtml(v)}</strong></td></tr>`;
}
function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string),
  );
}
function adminEmailHtml(id: string, d: z.infer<typeof schema>) {
  return `
  <div style="font-family:Inter,system-ui,Arial,sans-serif;color:#0b1020">
    <h2 style="margin:0 0 8px">New enquiry received</h2>
    <p style="color:#475569;margin:0 0 16px">Enquiry ID: <code>${id}</code></p>
    <table style="border-collapse:collapse;width:100%;background:#f8fafc;border-radius:8px;overflow:hidden">
      ${row("Name", d.name)}
      ${row("Email", d.email)}
      ${row("Phone", d.phone)}
      ${row("Country", d.country)}
      ${row("University", d.university)}
      ${row("Service", d.serviceSlug)}
      ${row("Subject", d.subject)}
      ${row("Level", d.academicLevel)}
      ${row("Deadline", d.deadline)}
      ${row("Word count", String(d.wordCount || ""))}
      ${row("Programming language", d.programmingLanguage)}
    </table>
    <h3 style="margin:16px 0 8px">Description</h3>
    <p style="white-space:pre-wrap;background:#f8fafc;padding:12px;border-radius:8px">${escapeHtml(d.description)}</p>
  </div>`;
}
function studentEmailHtml(business: string, d: z.infer<typeof schema>) {
  return `
  <div style="font-family:Inter,system-ui,Arial,sans-serif;color:#0b1020">
    <h2 style="margin:0 0 8px">Thank you, ${escapeHtml(d.name)} — we received your enquiry.</h2>
    <p>A mentor from <strong>${escapeHtml(business)}</strong> will review your request for <em>${escapeHtml(d.serviceSlug)}</em> and respond within one working day.</p>
    <p style="margin-top:16px;color:#475569">Reminder: we provide tutoring, coaching and learning support only. You remain responsible for submitting your own work in line with your institution’s academic integrity rules.</p>
  </div>`;
}
