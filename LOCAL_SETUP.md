# Run the website on your own computer (local preview)

This guide is written for a non-coder. By the end you'll have the **exact
same website** running at `http://localhost:3000` on your machine, with a
working admin login, where you can change anything and see it instantly.

> **Important concept — please read once.**
> Your computer (local) and Hostinger (live) are **two separate copies**,
> each with its **own database**.
> - Editing content in the **local** admin panel changes only your local copy.
> - Editing content on the **live** site changes only the live site.
> - **Code/design** changes travel through Git and appear live only after a
>   redeploy.
> This is a good thing: you can safely experiment locally without touching
> the real site. (If you want local to show the *real live data*, see
> "Option 3" below.)

---

## Step 1 — Install the basics (one time)

1. **Node.js 20** — download the "LTS" installer from <https://nodejs.org> and install it.
2. **Git** — from <https://git-scm.com> (so you can pull the code).
3. A code folder — open a terminal (Command Prompt / PowerShell on Windows,
   Terminal on Mac) and run:
   ```bash
   git clone https://github.com/abhijit2512/educators.git
   cd educators
   npm install
   ```

---

## Step 2 — Get a database (pick ONE option)

The site needs a MySQL database. Choose whichever is easiest for you.

### Option 1 — Docker (easiest, recommended)
If you install **Docker Desktop** (<https://www.docker.com/products/docker-desktop/>):
```bash
npm run db:up
```
That's it — a local MySQL is now running. Your database URL will be:
```
mysql://educators:educators@localhost:3306/educators
```

### Option 2 — Install MySQL yourself
Install **MySQL Community Server** (<https://dev.mysql.com/downloads/>) or
**XAMPP** (<https://www.apachefriends.org>, includes MySQL/phpMyAdmin).
Create a database called `educators` and note your username/password. Your
URL looks like:
```
mysql://USERNAME:PASSWORD@localhost:3306/educators
```

### Option 3 — Use your real Hostinger database (local mirrors live data)
In Hostinger hPanel → **Databases → Remote MySQL**, allow your home IP
address (or "Any host" temporarily). Then use the Hostinger connection
string. ⚠️ With this option, anything you change locally changes the **live**
data too, because it's the same database. Use only if you specifically want
a live mirror.

---

## Step 3 — Create your settings file

Copy the example file to `.env`:
```bash
cp .env.example .env
```
Open `.env` in any text editor and set at least these four lines (the rest
can stay as-is for local testing):

```env
DATABASE_URL="mysql://educators:educators@localhost:3306/educators"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-long-random-text-you-like-1234567890"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Your local admin login — choose anything you'll remember:
ADMIN_EMAIL="admin@educatorsunited.in"
ADMIN_PASSWORD="Admin@12345"
```
(If you used Option 2 or 3, paste that database URL into `DATABASE_URL`.)

---

## Step 4 — Build the database tables and create the admin

```bash
npm run setup
```
This creates all tables and your admin account. It prints a box like:

```
========================================
  ADMIN LOGIN (use these at /login)
  Email:    admin@educatorsunited.in
  Password: (the ADMIN_PASSWORD you set in .env)
========================================
```

**That is your admin login.** It's whatever you put in `.env` as
`ADMIN_EMAIL` / `ADMIN_PASSWORD`. If you didn't set them, the defaults are
`admin@educatorsunited.in` / `Admin@12345`.

---

## Step 5 — Start the website

```bash
npm run dev
```
Open <http://localhost:3000> in your browser. To log in as admin go to
<http://localhost:3000/login> and use the email/password from Step 4. The
admin dashboard is at <http://localhost:3000/admin>.

While `npm run dev` is running, **any change you make to the code shows up
instantly** when you refresh the browser. Content you edit in the admin
panel is saved to your local database and shows immediately too.

---

## Can I modify everything locally, exactly like the live site?

**Yes — it's identical software.** Locally you can:
- Log into `/admin` and edit business details, hero text, About, services,
  pricing, samples, FAQ-style content, "why choose us", "how it works", etc.
- Create test enquiries, change their status, generate invoices.
- Promote/demote users, export CSV/Excel.

Everything you can do on the live site, you can do locally.

---

## Bonus — view the database directly

```bash
npm run studio
```
Opens **Prisma Studio** at <http://localhost:5555> — a friendly table viewer
where you can browse and edit every row in your local database.

---

## Going from local → live

1. Commit and push your **code** changes:
   ```bash
   git add -A
   git commit -m "my changes"
   git push
   ```
2. Redeploy on Hostinger (see `HOSTINGER_DEPLOYMENT.md`).
3. **Content** (text/services/pricing edited in the admin panel) is per-site,
   so re-enter important content on the live admin panel, or copy the
   database if you want them identical.

---

## Common problems

| Problem | Fix |
|---|---|
| `Can't reach database server` | Is the DB running? For Docker: `npm run db:up`. Check `DATABASE_URL` in `.env`. |
| `Environment variable not found: DATABASE_URL` | You haven't created `.env` (Step 3). |
| Login says "invalid" | Run `npm run seed` again; use the exact email/password it prints. |
| Port 3000 in use | Run `PORT=3001 npm run dev` and open `http://localhost:3001`. |
| Changes don't show | Make sure `npm run dev` is still running; hard-refresh the browser. |
