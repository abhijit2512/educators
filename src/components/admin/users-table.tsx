"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Row = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "STUDENT";
  country: string | null;
  requests: number;
  joined: string;
};

export function UsersTable({ users }: { users: Row[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function setRole(id: string, role: "ADMIN" | "STUDENT") {
    setBusy(id);
    setError("");
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    setBusy(null);
    if (res.ok) router.refresh();
    else setError((await res.json().catch(() => ({}))).error || "Update failed");
  }

  async function remove(id: string) {
    if (!confirm("Delete this user? Their enquiries are kept but unlinked.")) return;
    setBusy(id);
    setError("");
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    setBusy(null);
    if (res.ok) router.refresh();
    else setError((await res.json().catch(() => ({}))).error || "Delete failed");
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-700">{error}</p>}
      <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Country</th>
              <th className="px-4 py-2">Requests</th>
              <th className="px-4 py-2">Joined</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-100">
                <td className="px-4 py-2">{u.name || "—"}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">
                  <span className={"rounded-full px-2 py-0.5 text-xs font-medium " + (u.role === "ADMIN" ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-700")}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-2">{u.country || "—"}</td>
                <td className="px-4 py-2">{u.requests}</td>
                <td className="px-4 py-2 text-slate-500">{u.joined}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    {u.role === "STUDENT" ? (
                      <button disabled={busy === u.id} onClick={() => setRole(u.id, "ADMIN")} className="rounded bg-slate-100 px-2 py-1 text-xs hover:bg-slate-200">
                        Make admin
                      </button>
                    ) : (
                      <button disabled={busy === u.id} onClick={() => setRole(u.id, "STUDENT")} className="rounded bg-slate-100 px-2 py-1 text-xs hover:bg-slate-200">
                        Make student
                      </button>
                    )}
                    <button disabled={busy === u.id} onClick={() => remove(u.id)} className="rounded bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
