# Educators — academic support platform

A production-ready, ethically-worded academic learning-support website for
UK and international students, built with **Next.js 14 (App Router) +
TypeScript + Tailwind CSS + Prisma (MySQL) + NextAuth + Framer Motion**.

> We do **not** complete assessed work on behalf of students. The platform
> markets tutoring, coaching, debugging, walk-throughs and reference
> materials only.

---

## What you get

- **Public website**: Home, About, Services, Coding & Programming Support,
  Pricing, Samples, How It Works, Contact, FAQ, plus Terms / Privacy /
  Refund / Academic Integrity / Cookies.
- **Enquiry form** with validation, file mention, email confirmation to
  student + admin alert.
- **Auth**: register, login, role-based access (STUDENT / ADMIN).
- **Student dashboard**: requests, request status, updates, invoices, profile.
- **Admin dashboard**: enquiries with search/filter, status workflow,
  per-enquiry updates and invoice creation, CSV + Excel export, full CRUD
  for services / pricing plans / samples, payments + invoices, users,
  site-wide settings (logo, business name, contact, hero copy, footer text,
  integrity disclaimer).
- **Payments**: Stripe + PayPal scaffolding wired in (keys from env), with
  manual payment marking always available.
- **Invoices**: auto-numbered, printable HTML, viewable by student + admin.
- **Email**: Nodemailer + SMTP env vars (no-op if not configured).
- **SMS / WhatsApp** placeholder integrations.

---

## Quick start (local)

```bash
# 1. install deps
npm install

# 2. copy environment
cp .env.example .env
# then edit .env — at minimum set DATABASE_URL, NEXTAUTH_SECRET,
# ADMIN_EMAIL, ADMIN_PASSWORD

# 3. create the database schema
npx prisma migrate dev --name init

# 4. seed admin user + default services + pricing + settings
npm run seed

# 5. start the dev server
npm run dev
```

Open http://localhost:3000 — and sign in at `/login` with the admin email +
password you set in `.env`.

---

## Project layout

```
src/
  app/
    (public pages)         Home, About, Services, Pricing, …
    admin/                 Admin dashboard (ADMIN only)
    dashboard/             Student dashboard (logged-in)
    api/                   API routes (enquiries, auth, admin, payments)
    legal/                 Legal pages
  components/              Header, footer, forms, admin widgets
  lib/                     prisma, auth, settings, mailer, notify, invoice
prisma/
  schema.prisma            Database schema
  seed.ts                  Seed script (admin + services + settings)
```

---

## Environment variables

See `.env.example`. The minimum to run is:

- `DATABASE_URL` — MySQL connection string
- `NEXTAUTH_SECRET` — `openssl rand -base64 32`
- `NEXTAUTH_URL` — public URL of the site
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` — used by the seed script

Email, payments and SMS / WhatsApp are all optional — features no-op
gracefully when their env vars are missing.

---

## Deployment

See **`HOSTINGER_DEPLOYMENT.md`** for the full Hostinger guide.

### Production commands

```bash
npm install
npm run build          # runs prisma generate then next build
npx prisma migrate deploy
npm run seed           # optional — only the first time, or to re-add defaults
npm start              # serves on PORT (default 3000)
```

---

## Editing the website (no code)

After deployment, log in as ADMIN and visit:

- `/admin/settings` — business name, logo, phone, WhatsApp, email,
  Facebook, hero text, footer text, academic integrity disclaimer
- `/admin/services` — add / edit / hide / delete services
- `/admin/pricing` — manage pricing plans
- `/admin/samples` — upload / link / hide / delete sample resources
- `/admin/enquiries` — process new student enquiries, update status,
  create invoices, export CSV / Excel

---

## Documentation

- `PROJECT_PLAN.md` — what was built and why
- `HOSTINGER_DEPLOYMENT.md` — beginner-friendly Hostinger deploy guide
- `PAYMENT_SETUP.md` — Stripe + PayPal activation steps
- `ADMIN_GUIDE.md` — day-to-day admin workflows
- `STUDENT_FLOW.md` — student journey from enquiry to invoice

---

## Compliance & wording

This codebase has been reviewed to avoid essay-mill / contract-cheating
language. Every page references coaching, tutoring, guidance, debugging,
walk-throughs and reference materials — never "completing", "submit-ready"
or "guaranteed grades". An academic-integrity disclaimer appears in the
footer, on the home page, on the services page, on the coding page, on
contact form submission, and in every confirmation email.
