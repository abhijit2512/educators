import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAYPAL_BASE = (env = "sandbox") =>
  env === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

async function token() {
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENV } = process.env;
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) return null;
  const basic = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  const r = await fetch(`${PAYPAL_BASE(PAYPAL_ENV)}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  return r.ok ? ((await r.json()).access_token as string) : null;
}

export async function POST(req: Request) {
  const t = await token();
  if (!t) return NextResponse.json({ error: "PayPal not configured" }, { status: 503 });
  const { orderId, invoiceId } = await req.json();
  const res = await fetch(`${PAYPAL_BASE(process.env.PAYPAL_ENV)}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
  });
  const data = await res.json();
  if (res.ok && data.status === "COMPLETED" && invoiceId) {
    const invoice = await prisma.invoice.update({ where: { id: invoiceId }, data: { status: "PAID" } });
    await prisma.payment.create({
      data: {
        enquiryId: invoice.enquiryId,
        amount: invoice.amount,
        currency: invoice.currency,
        provider: "PAYPAL",
        providerRef: orderId,
        status: "PAID",
      },
    });
    await prisma.enquiry.update({ where: { id: invoice.enquiryId }, data: { status: "PAID" } });
  }
  return NextResponse.json(data, { status: res.status });
}
