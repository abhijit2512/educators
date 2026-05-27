import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { sendMail, getTransport } from "@/lib/mailer";
import { getSiteSettings } from "@/lib/settings";

export async function POST() {
  const g = await requireAdmin();
  if (!g.ok) return g.response;

  if (!getTransport()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        message:
          "SMTP isn't configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS in your environment, then redeploy.",
      },
      { status: 200 },
    );
  }

  const s = await getSiteSettings();
  const to = process.env.ADMIN_EMAIL || s.business_email;
  try {
    const result = await sendMail({
      to,
      subject: `Test email from ${s.business_name}`,
      html: `<p>This is a test email confirming your SMTP configuration is working.</p><p>Sent from your admin panel at ${new Date().toISOString()}.</p>`,
    });
    return NextResponse.json({
      ok: true,
      configured: true,
      to,
      messageId: "messageId" in result ? result.messageId : null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, configured: true, message: err?.message || "Send failed" },
      { status: 500 },
    );
  }
}
