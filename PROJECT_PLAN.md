# PROJECT_PLAN.md

Academic support and student learning services website.
Target audience: UK students primarily, international students worldwide.

---

## 1. What currently exists in the repository

Before this work the repository contained only:

- `README.md` (placeholder, one line: `# educators`)
- `.git/` with two branches (`main`, `claude/eloquent-ptolemy-dPg06`)

There was **no** existing framework, package.json, environment file, database
setup, build script, deployment config, components, styling, or routing.
Everything in this project is being built fresh.

---

## 2. What will be built

A production-ready Next.js 14 (App Router) website with:

- A premium animated public website (Home, About, Services, Coding & Programming
  Support, Pricing, Samples, How It Works, Contact, FAQ, plus legal pages).
- A secure **Admin dashboard** at `/admin` for managing enquiries, services,
  pricing, samples, site settings, payments and invoices.
- A secure **Student dashboard** at `/dashboard` where students can submit
  support requests, view request history, invoices, and update their profile.
- An **enquiry system** with database persistence and email notifications.
- **CSV and Excel export** of enquiries for admin.
- **Stripe + PayPal** integration *structure* (no real keys committed).
- **Invoice generation** with admin/student visibility.
- Beginner-friendly **Hostinger deployment** documentation.

---

## 3. Tech stack decision

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 14 (App Router)** + TypeScript | Modern, deployable, SSR + API routes |
| Styling | **Tailwind CSS** + custom design tokens | Fast, premium look, fully responsive |
| UI primitives | Hand-built clean components (shadcn/ui style) | Avoids dependency churn on Hostinger |
| Animation | **Framer Motion** | Smooth, premium feel |
| Database | **MySQL** via **Prisma ORM** | Hostinger commonly supports MySQL |
| Auth | **NextAuth (Auth.js) Credentials provider** + bcrypt | Role-based ADMIN / STUDENT |
| Email | **Nodemailer** + SMTP env vars | Works with Hostinger SMTP or any provider |
| Payments | **Stripe** + **PayPal** integration scaffolding | Structure only — keys via env |
| Export | `papaparse` (CSV) + `exceljs` (XLSX) | Pure JS, no native deps |
| Validation | **zod** + react-hook-form | Type-safe forms |

If Hostinger plan cannot run Node.js / Next.js, we ship the same codebase as a
static export of public pages and host the dynamic API on a Node-supporting tier
or VPS — instructions in `HOSTINGER_DEPLOYMENT.md`.

---

## 4. Database design summary

Prisma models (MySQL):

- `User` — id, email, passwordHash, name, role (`ADMIN` | `STUDENT`), timestamps
- `StudentProfile` — userId (1-1), phone, country, university, level
- `Enquiry` — id, userId?, name, email, phone, country, university, serviceSlug,
  subject, academicLevel, deadline, wordCount?, programmingLanguage?,
  description, fileUrl?, consent, integrityAck, status (enum), createdAt
- `Service` — slug, title, summary, body (markdown), category, icon, visible, order
- `PricingPlan` — slug, title, summary, features (JSON), ctaLabel, visible, order
- `SamplePaper` — title, subject, description, fileUrl?, externalUrl?, visible, order
- `Payment` — id, enquiryId, amount, currency, provider (`STRIPE`|`PAYPAL`|`MANUAL`),
  providerRef?, status (`PENDING`|`PAID`|`FAILED`|`REFUNDED`), createdAt
- `Invoice` — id, number (unique), enquiryId, userId, amount, currency, status,
  issuedAt, dueAt?, lineItems (JSON)
- `SiteSetting` — `key` (unique), `value` (text) — single-table key/value CMS
- `RequestUpdate` — enquiryId, message, authorRole, createdAt
- `UploadedFile` — id, ownerId, enquiryId?, filename, mime, size, url, createdAt

Enums:
- `Role { ADMIN, STUDENT }`
- `EnquiryStatus { NEW, QUOTED, PAID, IN_PROGRESS, COMPLETED, CANCELLED }`
- `PaymentStatus { PENDING, PAID, FAILED, REFUNDED }`
- `PaymentProvider { STRIPE, PAYPAL, MANUAL }`

---

## 5. Page list (public)

1. `/` Home
2. `/about` About
3. `/services` Services index
4. `/services/coding-and-programming` Dedicated coding support page
5. `/pricing` Pricing (quote-based)
6. `/samples` Samples (with strong "reference only" disclaimer)
7. `/how-it-works` Process
8. `/contact` Contact form
9. `/faq` FAQ
10. `/legal/terms`
11. `/legal/privacy`
12. `/legal/refund`
13. `/legal/academic-integrity`
14. `/legal/cookies`

Auth:
- `/login`, `/register`

---

## 6. Admin dashboard features (`/admin`)

- Secure login, ADMIN role required
- Dashboard stats: total enquiries, by status, recent payments
- Enquiries list: search, filter by status, change status, view detail
- Export enquiries → CSV (`/api/admin/enquiries/export?format=csv`)
- Export enquiries → XLSX (`?format=xlsx`)
- Services CRUD (create, edit, delete, show/hide, reorder)
- Pricing plans CRUD
- Sample papers CRUD
- Site settings (business name, logo URL, phone, WhatsApp, email, Facebook link,
  hero headline, hero subheading, footer text, academic integrity disclaimer)
- Payments list, manual status update
- Invoices list + view + simple PDF-ready HTML
- Students list

---

## 7. Student dashboard features (`/dashboard`)

- Register / Login
- View profile, update phone/country/university
- Submit new support request (full enquiry form, pre-filled from profile)
- View previous requests + current status
- View invoices and their payment status
- View admin update messages per request

---

## 8. Payment plan

- Stripe Checkout structure: `/api/payments/stripe/create-session`,
  `/api/payments/stripe/webhook`. Real keys via env, never committed.
- PayPal Orders structure: `/api/payments/paypal/create-order`,
  `/api/payments/paypal/capture`.
- Manual mode: admin can mark `Payment.status = PAID` for offline transfers
  (bank, Wise, etc.).
- All payment flows update `Enquiry.status` → `PAID` and trigger an invoice.

---

## 9. Invoice plan

- Auto-generated invoice number: `INV-YYYYMM-NNNN`.
- Created on `Payment.status = PAID`.
- HTML invoice rendered server-side at `/dashboard/invoices/[id]` and
  `/admin/invoices/[id]`, print-friendly so it can be saved as PDF from browser.
- Optional emailed copy via Nodemailer.

---

## 10. Notification plan

- Email (Nodemailer + SMTP env vars) on:
  - New enquiry → ADMIN_EMAIL
  - New enquiry → confirmation to student
  - Status change → student
  - Invoice issued → student
- Placeholder modules for **Twilio SMS** and **WhatsApp Business API** that
  no-op silently unless `TWILIO_*` / `WHATSAPP_*` env vars are present.

---

## 11. Hostinger deployment plan

See `HOSTINGER_DEPLOYMENT.md`. Summary:

1. Create MySQL database in Hostinger hPanel.
2. Push this repo to GitHub (already connected).
3. On Hostinger Business / Cloud / VPS with Node.js support: enable Node app,
   point to repo, set Node 20+, build command `npm run build`, start command
   `npm start`.
4. Add all env vars from `.env.example`.
5. Run `npx prisma migrate deploy` and `npm run seed`.
6. Attach domain, enable free SSL.
7. Smoke test, then create real admin user via seed or `/api/admin/bootstrap`.

If the chosen Hostinger plan is **shared hosting only (no Node.js)**: deploy a
static export of marketing pages and host API on a Node-capable tier or move to
a VPS — fallback documented.

---

## 12. Security and compliance rules

- Never commit `.env`. Only `.env.example` ships.
- All passwords bcrypt-hashed (cost 12).
- Role-based middleware protects `/admin/**` and `/dashboard/**`.
- All form input validated server-side with zod.
- CSRF-safe: NextAuth session cookies, same-site lax.
- File uploads (if enabled) restricted by MIME + size, stored outside web root
  or on object storage.
- Academic integrity wording reviewed across every page — no essay-mill
  language; clear "guidance / tutoring / learning / reference only" framing.
- Cookies/consent banner placeholder + privacy policy.

---

## 13. Phase-by-phase implementation checklist

- [x] **Phase 0** — Inspect repo, write `PROJECT_PLAN.md`
- [x] **Phase 1** — Next.js scaffold, design system, public pages, nav, footer
- [x] **Phase 2** — Prisma schema, NextAuth, role-based access, login/register
- [x] **Phase 3** — Enquiry form + API + admin enquiry management + status updates
- [x] **Phase 4** — Services/pricing/samples/site-settings managed from admin
- [x] **Phase 5** — Nodemailer email notifications (admin + student)
- [x] **Phase 6** — CSV + XLSX export
- [x] **Phase 7** — Stripe + PayPal payment scaffolding + invoice system
- [x] **Phase 8** — Student dashboard (requests, invoices, profile)
- [x] **Phase 9** — QA: lint, build, responsive, security review
- [x] **Phase 10** — `HOSTINGER_DEPLOYMENT.md` and final production prep
