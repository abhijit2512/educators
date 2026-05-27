import { NextResponse } from "next/server";

const PAYPAL_BASE = (env = "sandbox") =>
  env === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

async function paypalAccessToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENV } = process.env;
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) return null;
  const basic = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${PAYPAL_BASE(PAYPAL_ENV)}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) return null;
  const j = await res.json();
  return j.access_token as string;
}

export async function POST(req: Request) {
  const token = await paypalAccessToken();
  if (!token) return NextResponse.json({ error: "PayPal not configured" }, { status: 503 });
  const { amount, currency = "GBP", invoiceId } = await req.json();
  const res = await fetch(`${PAYPAL_BASE(process.env.PAYPAL_ENV)}/v2/checkout/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: currency, value: amount.toFixed(2) }, custom_id: invoiceId }],
    }),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
