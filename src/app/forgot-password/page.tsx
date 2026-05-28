"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: String(fd.get("email") || "") }),
    });
    setLoading(false);
    setSent(true);
  }

  return (
    <section className="section">
      <div className="container max-w-md">
        <h1 className="h2 text-center">Reset your password</h1>
        {sent ? (
          <div className="card mt-8 border border-emerald-200 bg-emerald-50">
            <p className="text-sm text-emerald-900">
              If an account exists for that email, we&apos;ve sent a password-reset
              link. Please check your inbox (and spam folder). The link expires
              in one hour.
            </p>
            <Link href="/login" className="btn-primary mt-4">Back to sign in</Link>
          </div>
        ) : (
          <>
            <p className="mt-2 text-center text-sm text-slate-600">
              Enter your email and we&apos;ll send you a link to set a new password.
            </p>
            <form onSubmit={onSubmit} className="card mt-8 space-y-4">
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" name="email" required />
              </div>
              <button className="btn-primary w-full" disabled={loading}>
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
            <p className="mt-5 text-center text-sm text-slate-600">
              Remembered it? <Link href="/login" className="font-semibold text-brand-700 hover:underline">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
