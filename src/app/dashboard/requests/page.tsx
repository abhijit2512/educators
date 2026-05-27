import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "../page";

export const dynamic = "force-dynamic";

export default async function MyRequests() {
  const session = await getServerSession(authOptions);
  const enquiries = await prisma.enquiry.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="h2">My requests</h1>
        <Link href="/dashboard/requests/new" className="btn-primary">New request</Link>
      </div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
        {enquiries.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No requests yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Service</th>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Deadline</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e.id} className="border-t border-slate-100">
                  <td className="px-4 py-2">{e.serviceSlug}</td>
                  <td className="px-4 py-2">{e.subject || "—"}</td>
                  <td className="px-4 py-2">{e.deadline ? new Date(e.deadline).toLocaleDateString("en-GB") : "—"}</td>
                  <td className="px-4 py-2"><StatusBadge status={e.status} /></td>
                  <td className="px-4 py-2 text-slate-500">{e.createdAt.toLocaleDateString("en-GB")}</td>
                  <td className="px-4 py-2"><Link className="text-brand-700 hover:underline" href={`/dashboard/requests/${e.id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
