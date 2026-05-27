import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { enquiry: true },
    take: 200,
  });
  return (
    <div className="space-y-4">
      <h1 className="h2">Payments</h1>
      <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
        {payments.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No payments yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr><th className="px-4 py-2">Enquiry</th><th className="px-4 py-2">Amount</th><th className="px-4 py-2">Provider</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Created</th></tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-4 py-2"><Link className="text-brand-700 hover:underline" href={`/admin/enquiries/${p.enquiryId}`}>{p.enquiry.name}</Link></td>
                  <td className="px-4 py-2">{p.currency} {p.amount.toString()}</td>
                  <td className="px-4 py-2">{p.provider}</td>
                  <td className="px-4 py-2">{p.status}</td>
                  <td className="px-4 py-2 text-slate-500">{p.createdAt.toLocaleString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
