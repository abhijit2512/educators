"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

type Service = { slug: string; title: string };

export function EnquiryForm({ services }: { services: Service[] }) {
  const params = useSearchParams();
  const preselected = params.get("service") || "";
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: Record<string, any> = Object.fromEntries(fd.entries());
    payload.consent = fd.get("consent") === "on";
    payload.integrityAck = fd.get("integrityAck") === "on";

    // Upload the file (if any) first, then attach its URL to the enquiry.
    const file = fd.get("file");
    if (file instanceof File && file.size > 0) {
      const upFd = new FormData();
      upFd.append("file", file);
      const up = await fetch("/api/upload", { method: "POST", body: upFd });
      if (!up.ok) {
        const j = await up.json().catch(() => ({}));
        setErrorMsg(j.error || "File upload failed. Please try a smaller file or different format.");
        setStatus("error");
        return;
      }
      const j = await up.json();
      payload.fileUrl = j.url;
    }
    delete payload.file;

    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setStatus("ok");
      form.reset();
    } else {
      const j = await res.json().catch(() => ({}));
      setErrorMsg(j.error || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="card border border-emerald-200 bg-emerald-50">
        <h3 className="text-lg font-semibold text-emerald-900">Thank you — your enquiry is received.</h3>
        <p className="mt-2 text-sm text-emerald-800">
          A mentor will respond by email within one working day. If urgent, please WhatsApp us using the link in the footer.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone / WhatsApp" name="phone" />
        <Field label="Country" name="country" placeholder="United Kingdom" />
        <Field label="University (optional)" name="university" />
        <div>
          <label className="label">Service required</label>
          <select className="input" name="serviceSlug" defaultValue={preselected} required>
            <option value="">Select a service…</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>{s.title}</option>
            ))}
          </select>
        </div>
        <Field label="Subject area" name="subject" placeholder="e.g. Marketing, Law, Computer Science" />
        <div>
          <label className="label">Academic level</label>
          <select className="input" name="academicLevel">
            <option value="">Select level…</option>
            <option>Foundation / A-Level</option>
            <option>Undergraduate</option>
            <option>Postgraduate / Master’s</option>
            <option>PhD / Doctoral</option>
            <option>Professional</option>
          </select>
        </div>
        <Field label="Deadline" name="deadline" type="date" />
        <Field label="Word count or project size (optional)" name="wordCount" type="number" />
        <Field label="Programming language (if coding support)" name="programmingLanguage" placeholder="e.g. Python, JavaScript" />
      </div>

      <div>
        <label className="label">Describe the support you need</label>
        <textarea
          name="description"
          rows={5}
          required
          className="input"
          placeholder="Tell us about the topic, what you’ve done so far, and the kind of guidance you need."
        />
      </div>

      <div>
        <label className="label">File upload (optional)</label>
        <input
          type="file"
          name="file"
          className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-brand-700 hover:file:bg-brand-100"
        />
        <p className="mt-1 text-xs text-slate-500">PDF, DOCX or images. Max 10MB. (Upload handler is wired in — please mention file in your message if upload fails.)</p>
      </div>

      <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
        <label className="flex items-start gap-2">
          <input type="checkbox" name="consent" required className="mt-1" />
          <span>
            I agree to {`${process.env.NEXT_PUBLIC_SITE_NAME || "the service"}`} processing my details to respond to my enquiry, in accordance with the privacy policy.
          </span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" name="integrityAck" required className="mt-1" />
          <span>
            I understand that the service provides tutoring, coaching and learning support only — and that I am responsible for submitting my own work in line with my institution’s academic integrity rules.
          </span>
        </label>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-700">{errorMsg}</p>
      )}

      <button type="submit" className="btn-primary w-full" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}

function Field({
  label, name, type = "text", required, placeholder,
}: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" type={type} name={name} required={required} placeholder={placeholder} />
    </div>
  );
}
