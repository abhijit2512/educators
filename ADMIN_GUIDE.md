# Admin guide

Day-to-day workflows for the admin user.

## Sign in

- Go to `/login`. Use the email + password you set as `ADMIN_EMAIL` /
  `ADMIN_PASSWORD` in the environment (and seeded with `npm run seed`).
- The admin dashboard lives at `/admin`. The header shows an **Admin**
  shortcut when you're signed in.

## Edit the website

Visit `/admin/settings`. You can edit:

- Business name, logo URL
- Phone, WhatsApp, email, Facebook link, address
- Hero headline & subheading on the home page
- Footer text
- Academic integrity disclaimer (shows in the footer and home page)

Click **Save settings**. The change is live immediately.

## Manage services

`/admin/services` → click **+ New** to add a service, or **Edit** /
**Delete** on a row.

Fields:
- **Slug** — URL-safe identifier (used in `/services#slug` anchors)
- **Title**, **Category**, **Summary** — shown on /services
- **Body** — long-form description (optional)
- **Order** — lower number shows first
- **Visible** — uncheck to hide without deleting

Use ethical wording only (tutoring, guidance, coaching, debugging, review,
explanation, walk-through, reference). Avoid "complete", "submit-ready",
"guaranteed marks".

## Manage pricing & samples

Same UI pattern under `/admin/pricing` and `/admin/samples`.

## Process enquiries

`/admin/enquiries` — list all enquiries with search and status filter.

Click a name to open the detail page. From there you can:

- **Change status**: New → Quoted → Paid → In Progress → Completed (or Cancelled).
- **Post update to student**: a free-text message they see in their
  dashboard at `/dashboard/requests/<id>`.
- **Generate invoice**: enter an amount in GBP; this creates an invoice
  with a number `INV-YYYYMM-NNNN` and a matching pending Payment row.
- **Mark payments**: PENDING / PAID / FAILED / REFUNDED. Marking PAID also
  marks the invoice and the enquiry as PAID.

## Export enquiries

On `/admin/enquiries`, the **Export CSV** and **Export Excel** buttons
respect whatever filter/search is currently applied.

## Users

`/admin/users` lists registered users with role, country, request count and
join date.

## Invoices

`/admin/invoices` lists everything. Click **View** to see the printable
invoice page — use your browser's "Print → Save as PDF" to download it.
