import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { sendWhatsApp } from "@/lib/notify";
import { getSiteSettings } from "@/lib/settings";
import { check as rateLimit, clientIp } from "@/lib/rate-limit";

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
  // Honeypot — real browsers leave this empty; bots fill it because it's
  // a field named like a real one. Never shown to humans (visually hidden).
  website: z.string().max(200).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  // Rate limit by IP — 5 submissions per hour. Sufficient for legitimate
  // students; meaningfully slows bots.
  const ip = clientIp(req);
  const rl = rateLimit(`enquiry:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many enquiries from this network. Please try again later or contact us directly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }
  const data = parsed.data;
  // Honeypot — if the hidden field is filled, silently accept and discard.
  // Returning 200 (instead of 400) prevents bots from learning the trap.
  if (data.website && data.website.trim().length > 0) {
    return NextResponse.json({ ok: true, id: "ignored" });
  }
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

  // Fire-and-forget notifications (email + optional WhatsApp). All of these
  // no-op gracefully when their env vars aren't configured.
  const settings = await getSiteSettings();
  const adminEmail = process.env.ADMIN_EMAIL || settings.business_email;
  const adminWhatsApp = (process.env.WHATSAPP_ADMIN_TO || settings.business_whatsapp || "").replace(/[^0-9]/g, "");

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
    adminWhatsApp
      ? sendWhatsApp(
          adminWhatsApp,
          `New enquiry on ${settings.business_name}\n` +
            `Service: ${data.serviceSlug}\nName: ${data.name}\nEmail: ${data.email}\n` +
            `Phone: ${data.phone || "—"}\nDeadline: ${data.deadline || "—"}`,
        )
      : Promise.resolve(),
  ]).catch((err) => console.error("[enquiry] notification error", err));

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
