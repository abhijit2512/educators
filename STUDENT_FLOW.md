# Student journey

End-to-end story of how a student uses the platform.

## 1. Discovery

The student lands on the home page (or any service page), reads the
ethical learning-support framing, and clicks **Request a Quote**.

## 2. Enquiry

`/contact` shows the enquiry form with:

- Name, email, phone, country, university (optional)
- Service required (dropdown — pulled from the database)
- Subject area, academic level, deadline, word count
- Programming language (if it's a coding-support enquiry)
- Description (free text)
- File upload (optional)
- Consent + academic-integrity acknowledgement (required)

On submit the API:
1. Validates with zod.
2. Saves an `Enquiry` row.
3. Emails the admin with the details.
4. Emails the student a confirmation.
5. Shows a green success card.

## 3. Account creation (optional but recommended)

The student can create an account at `/register` to track requests over
time. Without an account they still receive emails — but the dashboard is
for registered students only.

## 4. Dashboard

`/dashboard` shows:

- Overview stats (request count, invoices, account email)
- Recent requests with status
- Side nav to **Requests**, **Invoices**, **Profile**

The student can:

- Submit a new request from `/dashboard/requests/new`
- View status updates the admin posts (`/dashboard/requests/<id>`)
- View and print invoices (`/dashboard/invoices/<id>`)
- Update phone / country / university / level in `/dashboard/profile`

## 5. Quote & payment

Admin sets the enquiry status to **Quoted** and (optionally) posts an
update with the proposed plan. When the student accepts, admin generates
an invoice. The student pays via:

- **Stripe** — checkout link
- **PayPal** — order capture
- **Bank transfer** — manual; admin marks PAID when the funds arrive

## 6. Delivery

Status changes to **In Progress** while sessions/feedback are delivered,
then **Completed**.

## 7. Follow-up

Students can return to their dashboard anytime to re-read updates,
download invoices, or start a new request.
