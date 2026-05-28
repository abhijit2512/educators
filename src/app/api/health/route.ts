import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = { app: "ok" };
  let healthy = true;

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch {
    checks.database = "unreachable";
    healthy = false;
  }

  checks.smtp =
    process.env.SMTP_HOST && process.env.SMTP_USER ? "configured" : "not-configured";
  checks.stripe = process.env.STRIPE_SECRET_KEY ? "configured" : "not-configured";
  checks.paypal = process.env.PAYPAL_CLIENT_ID ? "configured" : "not-configured";

  return NextResponse.json(
    { status: healthy ? "ok" : "degraded", time: new Date().toISOString(), checks },
    { status: healthy ? 200 : 503 },
  );
}
