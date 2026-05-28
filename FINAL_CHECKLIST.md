# Final checklist — Educators United Pvt Ltd

This is the launch checklist for **educatorsunited.in**. Everything under
"Complete" is built and verified. Everything under "Needs your accounts /
values" requires real credentials only you can provide — no further coding
is needed to switch them on.

---

## ✅ Complete (built & verified)

### Public website
- [x] Home page (hero, services, coding highlight, how-it-works, why-us, testimonials placeholder, CTA, integrity banner)
- [x] About page
- [x] Services index + **a dedicated page for every service** (`/services/<slug>`)
- [x] Dedicated Coding & Programming Support page
- [x] Pricing (quote-based, 5 plans)
- [x] Samples page (seeded with 6 reference resources, strong "reference only" disclaimer)
- [x] How It Works
- [x] Contact page with full enquiry form
- [x] FAQ
- [x] Legal: Terms, Privacy, Refund, Academic Integrity, Cookie Policy
- [x] Branded 404 page + runtime error pages
- [x] Floating WhatsApp / Call / Email button
- [x] Cookie consent banner

### Branding
- [x] "Educators United Pvt Ltd" name and `educatorsunited.in` domain throughout
- [x] Logo in header, footer, favicon and social-share cards (SVG placeholder shipped; drop in `public/logo.png` to use the real one — see `LOGO.md`)

### Accounts & dashboards
- [x] Student registration + login (bcrypt-hashed passwords)
- [x] Password reset by email (forgot-password → emailed link → reset)
- [x] Role-based access (ADMIN / STUDENT) with route protection
- [x] Student dashboard: overview, requests list, request detail with admin updates, new request, invoices, invoice view, profile editing
- [x] Admin dashboard: stats, enquiries (search + status filter + workflow), enquiry detail (status / updates / invoice generation / payment marking), services CRUD, pricing CRUD, samples CRUD, payments, invoices, **user management (promote/demote/delete)**, site settings

### Enquiries & data
- [x] Validated enquiry form (zod) saving to database
- [x] File upload (10MB cap, MIME allowlist) attached to enquiries
- [x] Admin email alert + student confirmation email on submit
- [x] Spam protection: honeypot + per-IP rate limit
- [x] CSV export of enquiries
- [x] Excel (.xlsx) export of enquiries

### Payments & invoices
- [x] Auto-numbered invoices (`INV-YYYYMM-NNNN`), printable
- [x] Manual payment marking (PENDING/PAID/FAILED/REFUNDED) in admin
- [x] PayPal pay-now button on invoices (live once keys added)
- [x] Stripe Checkout + webhook scaffolding (1 install + uncomment to activate)

### Content management (no code needed)
- [x] Admin can edit business name, logo URL, phone, WhatsApp, email, Facebook, address, hero headline/subheading, footer text, academic-integrity disclaimer

### Notifications
- [x] Email via Nodemailer/SMTP (no-ops cleanly if unset)
- [x] Admin "send test email" button
- [x] Twilio SMS + WhatsApp Business API placeholder modules

### SEO & ops
- [x] Per-page metadata, Open Graph, Twitter cards
- [x] `EducationalOrganization` + `Service` JSON-LD structured data
- [x] Dynamic `sitemap.xml` (includes DB services) + `robots.txt`
- [x] `/api/health` endpoint for uptime checks

### Deployment readiness
- [x] Committed Prisma migration (`prisma migrate deploy` creates all tables)
- [x] Idempotent seed (admin user + services + pricing + samples + settings)
- [x] `.env.example`, `.nvmrc` (Node 20)
- [x] Build passes, lint clean

---

## 🔑 Needs your accounts / values (no coding required)

These are set as environment variables on Hostinger (see `.env.example`)
or edited in the admin panel after first login.

| Item | Where | Notes |
|---|---|---|
| **MySQL database** | `DATABASE_URL` | Create in Hostinger hPanel → Databases |
| **Auth secret** | `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| **Site URL** | `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL` | `https://educatorsunited.in` |
| **First admin** | `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Used by the seed; change password after first login |
| **Real logo** | `public/logo.png` or admin → settings | See `LOGO.md` |
| **Phone / WhatsApp / Facebook** | admin → settings | Currently placeholders |
| **Business email** | `BUSINESS_EMAIL` + admin → settings | |
| **Email sending** | `SMTP_HOST/PORT/USER/PASS/FROM` | Hostinger mailbox or any SMTP. Test with the admin button |
| **Stripe (optional)** | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `npm install stripe` + uncomment routes (see `PAYMENT_SETUP.md`) |
| **PayPal (optional)** | `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_ENV` | Pay button goes live automatically |
| **SMS/WhatsApp (optional)** | `TWILIO_*`, `WHATSAPP_*` | Placeholder modules already wired |

---

## 🚀 Go-live order

1. Create the MySQL database; set `DATABASE_URL`.
2. Set `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
3. `npm install && npm run build && npx prisma migrate deploy && npm run seed`.
4. Start with `npm start`; attach the domain; enable SSL.
5. Open `/api/health` — confirm `database: ok`.
6. Sign in at `/login`, change the admin password, fill in real contact details and logo in `/admin/settings`.
7. (Optional) Add SMTP, Stripe and PayPal keys, then redeploy.
8. Send a test enquiry from `/contact` to confirm the full flow.

Full step-by-step in `HOSTINGER_DEPLOYMENT.md`.
