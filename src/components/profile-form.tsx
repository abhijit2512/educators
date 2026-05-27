"use client";
import { useState } from "react";

export function ProfileForm({
  initial,
}: {
  initial: { name: string; email: string; phone: string; country: string; university: string; level: string };
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd.entries())),
    });
    setStatus(res.ok ? "ok" : "err");
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label">Full name</label><input className="input" name="name" defaultValue={initial.name} required /></div>
        <div><label className="label">Email</label><input className="input" defaultValue={initial.email} disabled /></div>
        <div><label className="label">Phone</label><input className="input" name="phone" defaultValue={initial.phone} /></div>
        <div><label className="label">Country</label><input className="input" name="country" defaultValue={initial.country} /></div>
        <div><label className="label">University</label><input className="input" name="university" defaultValue={initial.university} /></div>
        <div><label className="label">Level</label><input className="input" name="level" defaultValue={initial.level} /></div>
      </div>
      <button className="btn-primary" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : status === "ok" ? "Saved ✓" : "Save changes"}
      </button>
      {status === "err" && <p className="text-sm text-red-700">Could not save changes.</p>}
    </form>
  );
}
