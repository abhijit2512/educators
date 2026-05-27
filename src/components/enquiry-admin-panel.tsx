"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["NEW", "QUOTED", "PAID", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;
type Status = (typeof STATUSES)[number];

type Props = { enquiry: any };

export function EnquiryAdminPanel({ enquiry }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(enquiry.status);
  const [message, setMessage] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [saving, setSaving] = useState(false);

  async function updateStatus(next: Status) {
    setSaving(true);
    await fetch(`/api/admin/enquiries/${enquiry.id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setStatus(next);
    setSaving(false);
    router.refresh();
  }

  async function postUpdate() {
    if (!message.trim()) return;
    setSaving(true);
    await fetch(`/api/admin/enquiries/${enquiry.id}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    setMessage("");
    setSaving(false);
    router.refresh();
  }

  async function createInvoice() {
    const amt = parseFloat(invoiceAmount);
    if (!amt || amt <= 0) return;
    setSaving(true);
    await fetch(`/api/admin/enquiries/${enquiry.id}/invoice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amt, currency: "GBP" }),
    });
    setInvoiceAmount("");
    setSaving(false);
    router.refresh();
  }

  async function markPayment(paymentId: string, next: string) {
    await fetch(`/api/admin/payments/${paymentId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h2">{enquiry.name}</h1>
        <p className="text-sm text-slate-500">{enquiry.email} · {enquiry.phone || "no phone"} · {enquiry.country || "—"}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h3 className="h3">Request</h3>
          <dl className="mt-3 grid grid-cols-2 gap-y-1 text-sm">
            <dt className="text-slate-500">Service</dt><dd>{enquiry.serviceSlug}</dd>
            <dt className="text-slate-500">Subject</dt><dd>{enquiry.subject || "—"}</dd>
            <dt className="text-slate-500">Level</dt><dd>{enquiry.academicLevel || "—"}</dd>
            <dt className="text-slate-500">Deadline</dt><dd>{enquiry.deadline ? new Date(enquiry.deadline).toLocaleDateString("en-GB") : "—"}</dd>
            <dt className="text-slate-500">Word count</dt><dd>{enquiry.wordCount || "—"}</dd>
            <dt className="text-slate-500">Coding lang</dt><dd>{enquiry.programmingLanguage || "—"}</dd>
            <dt className="text-slate-500">University</dt><dd>{enquiry.university || "—"}</dd>
          </dl>
          <h4 className="mt-4 text-sm font-semibold">Description</h4>
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{enquiry.description}</p>
          {enquiry.fileUrl && (
            <p className="mt-3 text-sm">
              <a className="text-brand-700 hover:underline" href={enquiry.fileUrl} target="_blank" rel="noreferrer">
                📎 Download uploaded file
              </a>
            </p>
          )}
        </div>

        <div className="card space-y-4">
          <div>
            <h3 className="h3">Status</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={saving || s === status}
                  className={"rounded-full px-3 py-1 text-xs font-medium " + (s === status ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200")}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="h3">Post update to student</h3>
            <textarea className="input mt-2" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g. We've shared the quote — please review and confirm." />
            <button onClick={postUpdate} disabled={saving || !message.trim()} className="btn-primary mt-2">
              Post update
            </button>
          </div>

          <div>
            <h3 className="h3">Generate invoice</h3>
            <div className="mt-2 flex gap-2">
              <input className="input" type="number" min="1" step="0.01" placeholder="Amount in GBP" value={invoiceAmount} onChange={(e) => setInvoiceAmount(e.target.value)} />
              <button className="btn-primary" onClick={createInvoice} disabled={saving || !invoiceAmount}>Create</button>
            </div>
          </div>
        </div>
      </div>

      {enquiry.updates?.length > 0 && (
        <div className="card">
          <h3 className="h3">Update history</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {enquiry.updates.map((u: any) => (
              <li key={u.id} className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs text-slate-500">{u.authorRole} · {new Date(u.createdAt).toLocaleString("en-GB")}</div>
                <div className="mt-1 whitespace-pre-wrap">{u.message}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {enquiry.payments?.length > 0 && (
        <div className="card">
          <h3 className="h3">Payments</h3>
          <table className="mt-3 w-full text-sm">
            <thead className="text-left text-xs uppercase text-slate-500">
              <tr><th>Amount</th><th>Provider</th><th>Status</th><th>Created</th><th></th></tr>
            </thead>
            <tbody>
              {enquiry.payments.map((p: any) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="py-2">{p.currency} {p.amount.toString()}</td>
                  <td>{p.provider}</td>
                  <td>{p.status}</td>
                  <td className="text-slate-500">{new Date(p.createdAt).toLocaleString("en-GB")}</td>
                  <td className="space-x-1">
                    {["PENDING","PAID","FAILED","REFUNDED"].map((s) => (
                      <button key={s} onClick={() => markPayment(p.id, s)} className="rounded bg-slate-100 px-2 py-1 text-xs hover:bg-slate-200">{s}</button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {enquiry.invoices?.length > 0 && (
        <div className="card">
          <h3 className="h3">Invoices</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {enquiry.invoices.map((i: any) => (
              <li key={i.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span>{i.number} · {i.currency} {i.amount.toString()} · {i.status}</span>
                <a className="text-brand-700 hover:underline" href={`/admin/invoices/${i.id}`}>View →</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
