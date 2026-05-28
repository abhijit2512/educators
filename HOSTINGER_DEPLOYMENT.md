# Hostinger deployment guide

Beginner-friendly steps to deploy this Next.js + MySQL app on Hostinger.

> **Important:** Next.js needs Node.js. On Hostinger this means a
> **Business**, **Cloud Startup / Cloud Pro**, or **VPS** plan with
> Node.js support. Shared web hosting (PHP-only) cannot run this app
> directly — see the fallback at the bottom.

---

## 1. Create the MySQL database

1. Log into Hostinger hPanel.
2. Go to **Databases → MySQL Databases**.
3. Click **Create new MySQL database**.
4. Note the values:
   - **Database name**: e.g. `u123456789_educators`
   - **User**: e.g. `u123456789_admin`
   - **Password**: pick a strong one
   - **Host**: usually `localhost` or the value shown on screen
   - **Port**: 3306

Your `DATABASE_URL` will look like:
```
mysql://u123456789_admin:YOUR_PASSWORD@localhost:3306/u123456789_educators
```

---

## 2. Push the code to GitHub

This repository is already on GitHub. Make sure your **production**
branch (`main`) has the latest changes.

```bash
git checkout main
git pull
```

---

## 3. Create the Node.js app on Hostinger

1. In hPanel, go to **Websites → Node.js**.
2. Click **Create application** and choose:
   - **Node version**: 20 LTS or newer (≥ 18.18 is required).
   - **Application mode**: Production.
   - **Application root**: `/home/<user>/htdocs/<domain>` (default).
   - **Application URL**: your domain.
   - **Application start file**: leave blank (we use `npm start`).
3. Connect the GitHub repo or upload via File Manager / Git deploy.

---

## 4. Add environment variables

In the Node app screen, add these (matching `.env.example`):

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_SITE_URL` | `https://educatorsunited.in` |
| `NEXTAUTH_URL` | `https://educatorsunited.in` |
| `NEXTAUTH_SECRET` | a long random string (`openssl rand -base64 32`) |
| `DATABASE_URL` | the MySQL URL from step 1 |
| `ADMIN_EMAIL` | your admin email |
| `ADMIN_PASSWORD` | a strong first-time admin password |
| `BUSINESS_*` | your business contact placeholders |
| `SMTP_*` | optional — to enable email |
| `STRIPE_*` / `PAYPAL_*` | optional — to enable payments |

---

## 5. Build & migrate

Open the **Hostinger SSH terminal** (or Node app shell) and run:

```bash
npm install
npm run build               # runs prisma generate + next build
npx prisma migrate deploy   # applies prisma/migrations/* — creates all tables
npm run seed                # creates admin user + default services + samples + settings
```

> The repository ships a committed baseline migration at
> `prisma/migrations/0_init/`, so `prisma migrate deploy` creates every
> table (User, Enquiry, Service, PricingPlan, SamplePaper, Payment,
> Invoice, SiteSetting, RequestUpdate, UploadedFile, PasswordResetToken)
> on a fresh database with no extra steps.

---

## 6. Start the app

In the Node app screen:

- **Start command**: `npm start`
- **Listen port**: the port Hostinger shows you (often automatic).

Click **Start application**. Visit `https://educatorsunited.in` to confirm.

---

## 7. Connect your domain & enable SSL

1. **Domains → Manage** → point the domain at the Node app.
2. **SSL / TLS** → Issue free Let's Encrypt certificate.
3. Force HTTPS.

---

## 7b. Verify the deployment

Visit `https://educatorsunited.in/api/health`. You should see JSON like:

```json
{ "status": "ok", "checks": { "app": "ok", "database": "ok", "smtp": "configured" } }
```

If `database` shows `unreachable`, re-check `DATABASE_URL`. The `smtp`,
`stripe` and `paypal` flags simply report whether those optional
integrations have their env vars set.

## 8. First-time admin checks

- Sign in at `https://educatorsunited.in/login` with your admin email and password.
- Visit `/admin/settings` and update business name, contact details, hero text and footer text.
- Visit `/admin/services` and `/admin/pricing` to fine-tune what you want to display.
- Send a test enquiry from `/contact` to confirm email delivery (if SMTP configured).

---

## Required Node version

```
node ≥ 18.18 (recommended 20 LTS)
npm ≥ 9
```

## Build & start commands

```
build:  npm run build
start:  npm start
```

---

## Troubleshooting

**Build fails: "Cannot find module 'prisma'"**
Run `npm install` first. The build runs `prisma generate` automatically via `postinstall`.

**Login works but admin pages redirect to /login**
Make sure your admin user has `role = ADMIN`. The seed script sets this. If
in doubt: re-run `npm run seed` with the correct `ADMIN_EMAIL`.

**"Can't reach database server"**
Check `DATABASE_URL`, especially the user prefix (Hostinger usernames begin
with `u…`). Confirm the database user has full privileges on the database.

**Emails are not arriving**
Configure SMTP env vars (Hostinger provides one for each mailbox). Without
SMTP, the app logs a warning and continues silently.

**Stripe / PayPal not working**
The integration is wired but inert until you add the keys. See
`PAYMENT_SETUP.md`.

---

## Fallback if your plan has no Node.js

1. Export only the marketing pages as static HTML:
   ```bash
   # In next.config.mjs, set `output: 'export'` temporarily, then:
   npm run build
   # The static site is in `out/` — upload to public_html via File Manager.
   ```
2. Host the API + auth on a separate Node-capable service (Render, Railway,
   Fly.io, Hostinger VPS) and update `NEXT_PUBLIC_SITE_URL` accordingly.

Long-term, upgrading to a Hostinger plan that supports Node.js is the
simplest path — it keeps everything in one place.
