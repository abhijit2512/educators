import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Stripe webhook. On checkout.session.completed it marks the invoice +
 * payment + enquiry as paid. Requires STRIPE_SECRET_KEY and
 * STRIPE_WEBHOOK_SECRET. Configure the endpoint URL in the Stripe dashboard:
 *   https://<your-domain>/api/payments/stripe/webhook
 */
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !whSecret) {
    return NextResponse.json({ ok: false, reason: "Stripe not configured" }, { status: 503 });
  }
  const stripe = new Stripe(key);

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, whSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const invoiceId = session.metadata?.invoiceId;
    if (invoiceId) {
      try {
        const invoice = await prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: "PAID" },
        });
        await prisma.payment.create({
          data: {
            enquiryId: invoice.enquiryId,
            amount: invoice.amount,
            currency: invoice.currency,
            provider: "STRIPE",
            providerRef: session.id,
            status: "PAID",
          },
        });
        await prisma.enquiry.update({
          where: { id: invoice.enquiryId },
          data: { status: "PAID" },
        });
      } catch (err) {
        console.error("[stripe webhook] db update failed", err);
        return new Response("DB error", { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
