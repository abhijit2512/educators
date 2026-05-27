import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [enquiries, students, payments, invoices, byStatus] = await Promise.all([
    prisma.enquiry.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.payment.count({ where: { status: "PAID" } }),
    prisma.invoice.count(),
    prisma.enquiry.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const recent = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 6 });

  return (
    <div className="space-y-6">
      <h1 className="h2">Admin overview</h1>
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
