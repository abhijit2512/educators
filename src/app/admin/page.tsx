import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [enquiries, students, payments, invoices, byStatus, serviceCount, settings] = await Promise.all([
    prisma.enquiry.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.payment.count({ where: { status: "PAID" } }),
    prisma.invoice.count(),
    prisma.enquiry.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.service.count({ where: { visible: true } }),
    getSiteSettings(),
  ]);
  const recent = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 6 });

  const phone = (settings.business_phone || "").replace(/[^0-9]/g, "");
  const checklist = [
    {
      done: !!settings.logo_url && settings.logo_url !== "/logo.png",
      label: "Upload your logo",
      href: "/admin/settings",
    },
    {
      done: phone.length > 0 && !phone.startsWith("44000000") && phone !== "440000000000",
      label: "Set your real phone & WhatsApp number",
      href: "/admin/settings",
    },
    {
      done: !!settings.business_email && !settings.business_email.includes("your-domain"),
      label: "Set your business email",
      href: "/admin/settings",
    },
    {
      done: !!settings.business_facebook && !settings.business_facebook.includes("your-page") && !settings.business_facebook.endsWith("/educatorsunited"),
      label: "Add your Facebook page link",
      href: "/admin/settings",
    },
    { done: serviceCount > 0, label: "Have at least one visible service", href: "/admin/services" },
    {
      done: !!process.env.SMTP_HOST && !!process.env.SMTP_USER,
      label: "Configure email sending (SMTP) and send a test",
      href: "/admin/settings",
    },
    {
      done: !!process.env.STRIPE_SECRET_KEY || !!process.env.PAYPAL_CLIENT_ID,
      label: "Connect a payment method (Stripe or PayPal)",
      href: "/admin/settings",
    },
  ];
  const doneCount = checklist.filter((c) => c.done).length;

  return (
    <div className="space-y-6">
      <h1 className="h2">Admin overview</h1>

      <section className="card">
        <div className="flex items-center justify-between">
          <h2 className="h3">Getting started</h2>
          <span className="text-sm font-medium text-slate-500">{doneCount}/{checklist.length} complete</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${(doneCount / checklist.length) * 100}%` }} />
        </div>
        <ul className="mt-4 space-y-2">
          {checklist.map((c) => (
            <li key={c.label} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-2.5 text-sm">
              <span className="flex items-center gap-2">
                <span className={"flex h-5 w-5 items-center justify-center rounded-full text-xs " + (c.done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500")}>
                  {c.done ? "✓" : ""}
                </span>
                <span className={c.done ? "text-slate-500 line-through" : "text-ink-900"}>{c.label}</span>
              </span>
              {!c.done && <Link href={c.href} className="font-medium text-brand-700 hover:underline">Fix →</Link>}
            </li>
          ))}
        </ul>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total enquiries" value={enquiries} />
        <Stat label="Students registered" value={students} />
        <Stat label="Paid payments" value={payments} />
        <Stat label="Invoices issued" value={invoices} />
      </div>

      <section>
        <h2 className="h3">Enquiries by status</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {byStatus.map((b) => (
            <span key={b.status} className="rounded-full bg-slate-100 px-3 py-1">
              {b.status.replaceAll("_", " ")}: <strong>{b._count._all}</strong>
            </span>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="h3">Recent enquiries</h2>
          <Link href="/admin/enquiries" className="text-sm text-brand-700 hover:underline">See all →</Link>
        </div>
        <div className="mt-3 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr><th className="px-4 py-2">Name</th><th className="px-4 py-2">Service</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Created</th></tr>
            </thead>
            <tbody>
              {recent.map((e) => (
                <tr key={e.id} className="border-t border-slate-100">
                  <td className="px-4 py-2"><Link href={`/admin/enquiries/${e.id}`} className="text-brand-700 hover:underline">{e.name}</Link></td>
                  <td className="px-4 py-2">{e.serviceSlug}</td>
                  <td className="px-4 py-2">{e.status}</td>
                  <td className="px-4 py-2 text-slate-500">{e.createdAt.toLocaleString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-ink-900">{value}</div>
    </div>
  );
}
