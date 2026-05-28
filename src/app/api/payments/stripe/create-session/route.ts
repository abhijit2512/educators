import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

/**
 * Creates a Stripe Checkout session for an invoice. Returns { url } to
 * redirect the student to. Inert (503) until STRIPE_SECRET_KEY is set.
 */
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Stripe not configured. Set STRIPE_SECRET_KEY in environment." },
      { status: 503 },
    );
  }
  const stripe = new Stripe(key);
  const { invoiceId } = await req.json().catch(() => ({}));
  if (!invoiceId) {
    return NextResponse.json({ error: "invoiceId is required" }, { status: 400 });
  }

  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  if (invoice.status === "PAID") {
    return NextResponse.json({ error: "Invoice already paid" }, { status: 400 });
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://educatorsunited.in";
  const amount = Math.round(Number(invoice.amount) * 100);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: invoice.currency.toLowerCase(),
          product_data: { name: `Invoice ${invoice.number}` },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${base}/dashboard/invoices/${invoice.id}?paid=1`,
    cancel_url: `${base}/dashboard/invoices/${invoice.id}?canceled=1`,
    metadata: { invoiceId: invoice.id },
  });

  return NextResponse.json({ url: session.url });
}
