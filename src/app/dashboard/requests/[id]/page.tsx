import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "../../page";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RequestDetail({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const enquiry = await prisma.enquiry.findUnique({
    where: { id: params.id },
    include: { updates: { orderBy: { createdAt: "asc" } }, invoices: true, payments: true },
  });
  if (!enquiry || enquiry.userId !== session!.user.id) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="h2">{enquiry.serviceSlug}</h1>
        <StatusBadge status={enquiry.status} />
      </div>
      <div className="card">
        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-slate-500">Subject</dt><dd>{enquiry.subject || "—"}</dd>
          <dt className="text-slate-500">Level</dt><dd>{enquiry.academicLevel || "—"}</dd>
          <dt className="text-slate-500">Deadline</dt><dd>{enquiry.deadline ? new Date(enquiry.deadline).toLocaleDateString("en-GB") : "—"}</dd>
          <dt className="text-slate-500">Word count</dt><dd>{enquiry.wordCount || "—"}</dd>
          <dt className="text-slate-500">Programming language</dt><dd>{enquiry.programmingLanguage || "—"}</dd>
          <dt className="text-slate-500">Created</dt><dd>{enquiry.createdAt.toLocaleString("en-GB")}</dd>
        </dl>
        <h3 className="h3 mt-6">Description</h3>
        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{enquiry.description}</p>
      </div>

      {enquiry.updates.length > 0 && (
        <div className="card">
          <h3 className="h3">Updates</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {enquiry.updates.map((u) => (
              <li key={u.id} className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs text-slate-500">{u.authorRole} · {u.createdAt.toLocaleString("en-GB")}</div>
                <div className="mt-1 whitespace-pre-wrap">{u.message}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {enquiry.invoices.length > 0 && (
        <div className="card">
          <h3 className="h3">Invoices</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {enquiry.invoices.map((i) => (
              <li key={i.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span>{i.number} · {i.currency} {i.amount.toString()}</span>
                <a className="text-brand-700 hover:underline" href={`/dashboard/invoices/${i.id}`}>View →</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
