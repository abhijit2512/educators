"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") || "");
    const confirm = String(fd.get("confirm") || "");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);
    if (res.ok) {
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Could not reset password.");
    }
  }

  if (!token) {
    return (
      <section className="section">
        <div className="container max-w-md text-center">
          <h1 className="h2">Invalid reset link</h1>
          <p className="mt-2 text-sm text-slate-600">This link is missing its token.</p>
          <Link href="/forgot-password" className="btn-primary mt-6">Request a new link</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container max-w-md">
        <h1 className="h2 text-center">Choose a new password</h1>
        {done ? (
          <div className="card mt-8 border border-emerald-200 bg-emerald-50">
            <p className="text-sm text-emerald-900">
              Your password has been updated. Redirecting you to sign in…
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="card mt-8 space-y-4">
            <div>
              <label className="label">New password (min 8 chars)</label>
              <input className="input" type="password" name="password" required minLength={8} />
            </div>
            <div>
              <label className="label">Confirm password</label>
              <input className="input" type="password" name="confirm" required minLength={8} />
            </div>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
