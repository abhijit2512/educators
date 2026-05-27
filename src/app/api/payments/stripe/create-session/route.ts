import { NextResponse } from "next/server";

/**
 * Stripe Checkout session creator. This is a scaffold — it requires the
 * `stripe` npm package and the STRIPE_SECRET_KEY env var. To activate:
 *   npm install stripe
 * and uncomment the implementation below.
 */
export async function POST(req: Request) {
  const { STRIPE_SECRET_KEY } = process.env;
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe not configured. Set STRIPE_SECRET_KEY in environment." },
      { status: 503 },
    );
  }

  // Example implementation (uncomment after `npm install stripe`):
  //
  // const Stripe = (await import("stripe")).default;
  // const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
  // const { amount, currency = "gbp", invoiceId } = await req.json();
  // const session = await stripe.checkout.sessions.create({
  //   mode: "payment",
  //   line_items: [{
  //     price_data: {
  //       currency,
  //       product_data: { name: `Invoice ${invoiceId}` },
  //       unit_amount: Math.round(amount * 100),
  //     },
  //     quantity: 1,
  //   }],
  //   success_url: `${process.env.NEXTAUTH_URL}/dashboard/invoices/${invoiceId}?paid=1`,
  //   cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/invoices/${invoiceId}?canceled=1`,
  //   metadata: { invoiceId },
  // });
  // return NextResponse.json({ url: session.url });

  return NextResponse.json(
    { error: "Stripe SDK not installed. See PAYMENT_SETUP.md." },
    { status: 501 },
  );
}
