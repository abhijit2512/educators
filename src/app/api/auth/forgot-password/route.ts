import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { getSiteSettings } from "@/lib/settings";
import { check as rateLimit, clientIp } from "@/lib/rate-limit";

const schema = z.object({ email: z.string().email().max(180) });

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`forgot:${ip}`, { limit: 5, windowMs: 30 * 60 * 1000 });
  if (!rl.ok) {
    return NextResponse.json({ ok: true }); // don't reveal rate-limit state
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  // Always return ok so we never disclose whether an email is registered.
  if (!parsed.success) return NextResponse.json({ ok: true });

  const email = parsed.data.email.toLowerCase().trim();
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.passwordResetToken.create({
        data: { userId: user.id, tokenHash, expiresAt },
      });

      const base = process.env.NEXT_PUBLIC_SITE_URL || "https://educatorsunited.in";
      const link = `${base}/reset-password?token=${token}`;
      const settings = await getSiteSettings();
      await sendMail({
        to: email,
        subject: `Reset your password — ${settings.business_name}`,
        html: `<p>We received a request to reset your password.</p>
               <p><a href="${link}">Click here to choose a new password</a>. This link expires in 1 hour.</p>
               <p>If you didn't request this, you can safely ignore this email.</p>`,
      }).catch((e) => console.error("[forgot-password] email error", e));
    }
  } catch (e) {
    // Never reveal internal errors on this endpoint — always respond ok.
    console.error("[forgot-password] error", e);
  }

  return NextResponse.json({ ok: true });
}
