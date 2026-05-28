"use client";
import { useState } from "react";

const FIELDS: Array<{ key: string; label: string }> = [
  { key: "integrity_disclaimer", label: "Academic integrity disclaimer (shown in footer & banners)" },
  { key: "legal_academic_integrity", label: "Academic Integrity page body" },
  { key: "legal_terms", label: "Terms & Conditions body" },
  { key: "legal_privacy", label: "Privacy Policy body" },
  { key: "legal_refund", label: "Refund Policy body" },
  { key: "legal_cookies", label: "Cookie Policy body" },
];

export function LegalForm({ initial }: { initial: Record<string, string> }) {
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
          <textarea className="input font-mono text-xs" name={f.key} rows={10} defaultValue={initial[f.key] || ""} />
        </div>
      ))}
      <div className="sticky bottom-4 flex items-center gap-3 rounded-xl bg-white/90 p-2 backdrop-blur">
        <button className="btn-primary" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : status === "ok" ? "Saved ✓" : "Save legal pages"}
        </button>
        {status === "err" && <p className="text-sm text-red-700">Could not save.</p>}
      </div>
    </form>
  );
}
