"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Could not create account.");
      setLoading(false);
      return;
    }
    await signIn("credentials", {
      email: String(payload.email),
      password: String(payload.password),
      redirect: false,
    });
    router.push("/dashboard");
  }

  return (
    <section className="section">
      <div className="container max-w-md">
        <h1 className="h2 text-center">Create your account</h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          Submit requests, track status and download invoices.
        </p>
        <form onSubmit={onSubmit} className="card mt-8 space-y-4">
          <div>
            <label className="label">Full name</label>
            <input className="input" name="name" required minLength={2} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" name="email" type="email" required />
          </div>
          <div>
            <label className="label">Password (min 8 chars)</label>
            <input className="input" name="password" type="password" required minLength={8} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label">Mobile number</label><input className="input" name="phone" type="tel" required minLength={6} placeholder="+44 …" /></div>
            <div><label className="label">Country</label><input className="input" name="country" placeholder="United Kingdom" /></div>
            <div><label className="label">University</label><input className="input" name="university" /></div>
            <div><label className="label">Level</label><input className="input" name="level" placeholder="Undergraduate / PG" /></div>
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account? <Link href="/login" className="font-semibold text-brand-700 hover:underline">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
