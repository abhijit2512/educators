import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Stripe webhook receiver. Requires `stripe` package and STRIPE_WEBHOOK_SECRET.
 * Below is the production-ready skeleton — fill in after installing the SDK.
 */
export async function POST(req: Request) {
  const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = process.env;
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, reason: "Stripe not configured" }, { status: 503 });
  }

  // const Stripe = (await import("stripe")).default;
  // const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
  // const sig = req.headers.get("stripe-signature")!;
  // const buf = Buffer.from(await req.arrayBuffer());
  // let event;
  // try {
  //   event = stripe.webhooks.constructEvent(buf, sig, STRIPE_WEBHOOK_SECRET);
  // } catch (err: any) {
  //   return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  // }
  // if (event.type === "checkout.session.completed") {
  //   const session = event.data.object as any;
  //   const invoiceId = session.metadata?.invoiceId;
  //   if (invoiceId) {
  //     const invoice = await prisma.invoice.update({
  //       where: { id: invoiceId },
  //       data: { status: "PAID" },
  //     });
  //     await prisma.payment.create({
  //       data: {
  //         enquiryId: invoice.enquiryId,
  //         amount: invoice.amount,
  //         currency: invoice.currency,
  //         provider: "STRIPE",
  //         providerRef: session.id,
  //         status: "PAID",
  //       },
  //     });
  //   }
  // }
  // return NextResponse.json({ received: true });

  // No-op placeholder until SDK is installed:
  void prisma;
  return NextResponse.json({ ok: true, placeholder: true });
}
