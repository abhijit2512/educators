import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminInvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { issuedAt: "desc" },
    include: { enquiry: true },
    take: 200,
  });
  return (
    <div className="space-y-4">
      <h1 className="h2">Invoices</h1>
      <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
        {invoices.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No invoices yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr><th className="px-4 py-2">Number</th><th className="px-4 py-2">For</th><th className="px-4 py-2">Amount</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Issued</th><th className="px-4 py-2"></th></tr>
            </thead>
            <tbody>
              {invoices.map((i) => (
                <tr key={i.id} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-mono">{i.number}</td>
                  <td className="px-4 py-2">{i.enquiry.name}</td>
                  <td className="px-4 py-2">{i.currency} {i.amount.toString()}</td>
                  <td className="px-4 py-2">{i.status}</td>
                  <td className="px-4 py-2 text-slate-500">{i.issuedAt.toLocaleDateString("en-GB")}</td>
                  <td className="px-4 py-2"><Link className="text-brand-700 hover:underline" href={`/admin/invoices/${i.id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
