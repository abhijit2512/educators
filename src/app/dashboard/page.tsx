import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;
  const [count, recent, invoices] = await Promise.all([
    prisma.enquiry.count({ where: { userId } }),
    prisma.enquiry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.invoice.findMany({
      where: { userId },
      orderBy: { issuedAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="h2">Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}</h1>
        <Link href="/dashboard/requests/new" className="btn-primary">New request</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total requests" value={String(count)} />
        <Stat label="Invoices" value={String(invoices.length)} />
        <Stat label="Account" value={session?.user?.email || ""} />
      </div>

      <section>
        <h2 className="h3">Recent requests</h2>
        <div className="mt-3 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
          {recent.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No requests yet. <Link className="text-brand-700 hover:underline" href="/dashboard/requests/new">Submit your first request →</Link></p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr><th className="px-4 py-2">Service</th><th className="px-4 py-2">Subject</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Created</th></tr>
              </thead>
              <tbody>
                {recent.map((e) => (
                  <tr key={e.id} className="border-t border-slate-100">
                    <td className="px-4 py-2">{e.serviceSlug}</td>
                    <td className="px-4 py-2">{e.subject || "—"}</td>
                    <td className="px-4 py-2"><StatusBadge status={e.status} /></td>
                    <td className="px-4 py-2 text-slate-500">{e.createdAt.toLocaleDateString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-ink-900">{value}</div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const m: Record<string, string> = {
    NEW: "bg-slate-100 text-slate-700",
    QUOTED: "bg-blue-50 text-blue-700",
    PAID: "bg-emerald-50 text-emerald-700",
    IN_PROGRESS: "bg-amber-50 text-amber-700",
    COMPLETED: "bg-emerald-50 text-emerald-700",
    CANCELLED: "bg-red-50 text-red-700",
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${m[status] || "bg-slate-100"}`}>{status.replaceAll("_", " ")}</span>;
}
