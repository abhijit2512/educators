import nodemailer from "nodemailer";

/**
 * Returns a configured Nodemailer transport, or null if SMTP env vars are
 * not set. Callers should no-op when null is returned.
 */
export function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const tx = getTransport();
  if (!tx) {
    console.warn("[mailer] SMTP not configured — skipping email to", opts.to);
    return { skipped: true as const };
  }
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER!;
  const info = await tx.sendMail({ from, ...opts });
  return { skipped: false as const, messageId: info.messageId };
}
