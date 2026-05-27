# Payment setup

The platform supports three payment paths:

1. **Manual** — admin marks invoices as PAID after a bank transfer or other
   offline method. **Works out of the box.**
2. **Stripe Checkout** — requires the Stripe SDK + keys.
3. **PayPal Orders v2** — requires PayPal client ID/secret; the integration is
   wired in fully (no extra SDK install required).

No secret keys are committed to the repo. Everything is read from environment
variables — define them in `.env` (local) or your Hostinger Node app
environment screen (production).

---

## Stripe — activate

1. Create a Stripe account → https://dashboard.stripe.com/
2. Reveal your **publishable** and **secret** API keys
   (Developers → API keys).
3. Add to your environment:

   ```
   STRIPE_SECRET_KEY=sk_live_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
   ```

4. Install the SDK and uncomment the implementation in the route files:

   ```bash
   npm install stripe
   ```

   Then open these files and uncomment the marked sections:
   - `src/app/api/payments/stripe/create-session/route.ts`
   - `src/app/api/payments/stripe/webhook/route.ts`

5. In Stripe Dashboard → **Developers → Webhooks**, add an endpoint:
   ```
   https://educatorsunited.in/api/payments/stripe/webhook
   ```
   listening for `checkout.session.completed`. Copy the signing secret into
   `STRIPE_WEBHOOK_SECRET`.

6. Trigger a session from your app by POSTing to `/api/payments/stripe/create-session`
   with `{ amount, currency, invoiceId }`. Returns `{ url }` to redirect the
   student to.

---

## PayPal — activate

1. Create a developer account → https://developer.paypal.com/
2. Create an app under **Apps & Credentials** → Sandbox or Live.
3. Add to your environment:

   ```
   PAYPAL_CLIENT_ID=xxx
   PAYPAL_CLIENT_SECRET=xxx
   PAYPAL_ENV=sandbox    # or "live"
   ```

4. Two routes are ready:

   - `POST /api/payments/paypal/create-order`
     body: `{ amount, currency, invoiceId }` → returns PayPal order JSON.
   - `POST /api/payments/paypal/capture`
     body: `{ orderId, invoiceId }` → captures payment and updates invoice +
     payment + enquiry rows automatically.

5. Render the PayPal Buttons SDK on the invoice page (front-end snippet you can
   drop in once you have a Client ID) and call the two routes above from the
   `createOrder` / `onApprove` callbacks.

---

## Manual / bank transfer

No setup required. Workflow:

1. Admin creates an invoice from the enquiry detail page in `/admin`.
2. Send the student your bank details by email or WhatsApp.
3. When you receive the money, open the enquiry in `/admin`, find the
   matching payment row and click **PAID** — this also marks the invoice
   PAID and the enquiry status PAID.
