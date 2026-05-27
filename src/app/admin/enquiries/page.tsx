import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { EnquiryStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUSES: EnquiryStatus[] = ["NEW", "QUOTED", "PAID", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default async function AdminEnquiries({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  const status = STATUSES.includes(searchParams.status as EnquiryStatus)
    ? (searchParams.status as EnquiryStatus)
    : undefined;
  const q = (searchParams.q || "").trim();

  const enquiries = await prisma.enquiry.findMany({
    where: {
      status,
      ...(q && {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
          { subject: { contains: q } },
          { serviceSlug: { contains: q } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="h2">Enquiries</h1>
        <div className="flex gap-2">
          <a href={`/api/admin/enquiries/export?format=csv${status ? `&status=${status}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`} className="btn-ghost">Export CSV</a>
          <a href={`/api/admin/enquiries/export?format=xlsx${status ? `&status=${status}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`} className="btn-primary">Export Excel</a>
        </div>
      </div>

      <form className="flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Search name, email, subject…" className="input max-w-xs" />
        <select name="status" defaultValue={status || ""} className="input max-w-[180px]">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="btn-primary">Filter</button>
      </form>

      <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Level</th>
              <th className="px-4 py-2">Deadline</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center text-slate-500">No enquiries found.</td></tr>
            ) : enquiries.map((e) => (
              <tr key={e.id} className="border-t border-slate-100">
                <td className="px-4 py-2"><Link href={`/admin/enquiries/${e.id}`} className="text-brand-700 hover:underline">{e.name}</Link></td>
                <td className="px-4 py-2">{e.email}</td>
                <td className="px-4 py-2">{e.serviceSlug}</td>
                <td className="px-4 py-2">{e.academicLevel || "—"}</td>
                <td className="px-4 py-2">{e.deadline ? new Date(e.deadline).toLocaleDateString("en-GB") : "—"}</td>
                <td className="px-4 py-2">{e.status}</td>
                <td className="px-4 py-2 text-slate-500">{e.createdAt.toLocaleString("en-GB")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
