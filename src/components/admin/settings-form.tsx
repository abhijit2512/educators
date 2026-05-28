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

type Field = { key: string; label: string; type?: "text" | "textarea" | "url" };
type Group = { title: string; fields: Field[] };

const GROUPS: Group[] = [
  {
    title: "Business & contact",
    fields: [
      { key: "business_name", label: "Business name" },
      { key: "logo_url", label: "Logo URL", type: "url" },
      { key: "business_email", label: "Email" },
      { key: "business_phone", label: "Phone" },
      { key: "business_whatsapp", label: "WhatsApp" },
      { key: "business_facebook", label: "Facebook link", type: "url" },
      { key: "business_address", label: "Address" },
    ],
  },
  {
    title: "Homepage — hero",
    fields: [
      { key: "hero_headline", label: "Hero headline" },
      { key: "hero_subheading", label: "Hero subheading", type: "textarea" },
    ],
  },
  {
    title: "Homepage — how it works (4 steps)",
    fields: [
      { key: "how_heading", label: "Section heading" },
      { key: "how_1_title", label: "Step 1 title" },
      { key: "how_1_text", label: "Step 1 text", type: "textarea" },
      { key: "how_2_title", label: "Step 2 title" },
      { key: "how_2_text", label: "Step 2 text", type: "textarea" },
      { key: "how_3_title", label: "Step 3 title" },
      { key: "how_3_text", label: "Step 3 text", type: "textarea" },
      { key: "how_4_title", label: "Step 4 title" },
      { key: "how_4_text", label: "Step 4 text", type: "textarea" },
    ],
  },
  {
    title: "Homepage — why choose us (3 cards)",
    fields: [
      { key: "why_heading", label: "Section heading" },
      { key: "why_1_title", label: "Card 1 title" },
      { key: "why_1_text", label: "Card 1 text", type: "textarea" },
      { key: "why_2_title", label: "Card 2 title" },
      { key: "why_2_text", label: "Card 2 text", type: "textarea" },
      { key: "why_3_title", label: "Card 3 title" },
      { key: "why_3_text", label: "Card 3 text", type: "textarea" },
    ],
  },
  {
    title: "About page",
    fields: [
      { key: "about_intro", label: "Intro paragraph", type: "textarea" },
      { key: "about_mission", label: "Our mission", type: "textarea" },
      { key: "about_approach", label: "Our approach", type: "textarea" },
      { key: "about_focus", label: "UK & international focus", type: "textarea" },
    ],
  },
  {
    title: "Services & pricing pages",
    fields: [
      { key: "services_intro", label: "Services page intro", type: "textarea" },
      { key: "pricing_intro", label: "Pricing page intro", type: "textarea" },
      { key: "pricing_note", label: "Pricing footnote", type: "textarea" },
    ],
  },
  {
    title: "Footer & legal",
    fields: [
      { key: "footer_text", label: "Footer text", type: "textarea" },
      { key: "integrity_disclaimer", label: "Academic integrity disclaimer", type: "textarea" },
    ],
  },
];

const ALL_FIELDS = GROUPS.flatMap((g) => g.fields);

export function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    for (const f of ALL_FIELDS) data[f.key] = String(fd.get(f.key) || "");
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setStatus(res.ok ? "ok" : "err");
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-6">
      {GROUPS.map((group) => (
        <fieldset key={group.title} className="space-y-3">
          <legend className="text-sm font-semibold uppercase tracking-wider text-brand-700">
            {group.title}
          </legend>
          {group.fields.map((f) => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              {f.type === "textarea" ? (
                <textarea className="input" name={f.key} rows={3} defaultValue={initial[f.key] || ""} />
              ) : (
                <input className="input" name={f.key} type={f.type || "text"} defaultValue={initial[f.key] || ""} />
              )}
            </div>
          ))}
        </fieldset>
      ))}

      <div className="sticky bottom-4 flex items-center gap-3 rounded-xl bg-white/90 p-2 backdrop-blur">
        <button className="btn-primary" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : status === "ok" ? "Saved ✓" : "Save settings"}
        </button>
        {status === "err" && <p className="text-sm text-red-700">Could not save.</p>}
      </div>

      <hr className="my-6 border-slate-100" />
      <TestEmailButton />
    </form>
  );
}
