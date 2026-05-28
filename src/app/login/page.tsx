"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) setError("Invalid email or password.");
    else router.push(callbackUrl);
  }

  return (
    <section className="section">
      <div className="container max-w-md">
        <h1 className="h2 text-center">Sign in</h1>
        <p className="mt-2 text-center text-sm text-slate-600">Access your dashboard, requests and invoices.</p>
        <form onSubmit={onSubmit} className="card mt-8 space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" name="email" required />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="label">Password</label>
              <Link href="/forgot-password" className="mb-1.5 text-xs font-medium text-brand-700 hover:underline">
                Forgot password?
              </Link>
            </div>
            <input className="input" type="password" name="password" required />
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-600">
          New here? <Link href="/register" className="font-semibold text-brand-700 hover:underline">Create an account</Link>
        </p>
      </div>
    </section>
  );
}
