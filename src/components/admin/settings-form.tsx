"use client";
import { useState } from "react";

function TestEmailButton() {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "warn" | "err">("idle");
  const [message, setMessage] = useState("");

  async function send() {
    setState("sending");
    setMessage("");
    const res = await fetch("/api/admin/test-email", { method: "POST" });
    const j = await res.json().catch(() => ({}));
    if (j.ok) {
      setState("ok");
      setMessage(`Sent to ${j.to}. Check that inbox.`);
    } else if (j.configured === false) {
      setState("warn");
      setMessage(j.message);
    } else {
      setState("err");
      setMessage(j.message || "Could not send. Check server logs.");
    }
  }

  return (
    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink-900">Test email delivery</p>
          <p className="mt-1 text-xs text-slate-600">
            Sends a test email to your ADMIN_EMAIL using the configured SMTP settings.
          </p>
        </div>
        <button type="button" onClick={send} disabled={state === "sending"} className="btn-ghost text-sm">
          {state === "sending" ? "Sending…" : "Send test"}
        </button>
      </div>
      {message && (
        <p
          className={
            "mt-2 text-sm " +
            (state === "ok" ? "text-emerald-700" : state === "warn" ? "text-amber-700" : "text-red-700")
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}

const FIELDS: Array<{ key: string; label: string; type?: "text" | "textarea" | "url" }> = [
  { key: "business_name", label: "Business name" },
  { key: "logo_url", label: "Logo URL", type: "url" },
  { key: "business_email", label: "Email" },
  { key: "business_phone", label: "Phone" },
  { key: "business_whatsapp", label: "WhatsApp" },
  { key: "business_facebook", label: "Facebook link", type: "url" },
  { key: "business_address", label: "Address" },
  { key: "hero_headline", label: "Hero headline" },
  { key: "hero_subheading", label: "Hero subheading", type: "textarea" },
  { key: "about_intro", label: "About — intro paragraph", type: "textarea" },
  { key: "about_mission", label: "About — our mission", type: "textarea" },
  { key: "about_approach", label: "About — our approach", type: "textarea" },
  { key: "about_focus", label: "About — UK & international focus", type: "textarea" },
  { key: "footer_text", label: "Footer text", type: "textarea" },
  { key: "integrity_disclaimer", label: "Academic integrity disclaimer", type: "textarea" },
];

export function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    for (const f of FIELDS) data[f.key] = String(fd.get(f.key) || "");
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setStatus(res.ok ? "ok" : "err");
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      {FIELDS.map((f) => (
        <div key={f.key}>
          <label className="label">{f.label}</label>
          {f.type === "textarea" ? (
            <textarea className="input" name={f.key} rows={3} defaultValue={initial[f.key] || ""} />
          ) : (
            <input className="input" name={f.key} type={f.type || "text"} defaultValue={initial[f.key] || ""} />
          )}
        </div>
      ))}
      <button className="btn-primary" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : status === "ok" ? "Saved ✓" : "Save settings"}
      </button>
      {status === "err" && <p className="text-sm text-red-700">Could not save.</p>}

      <hr className="my-6 border-slate-100" />
      <TestEmailButton />
    </form>
  );
}
