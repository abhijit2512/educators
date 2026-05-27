"use client";
import { useState } from "react";

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
    </form>
  );
}
