"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "checkbox" | "number" | "textarea-list";
  required?: boolean;
  placeholder?: string;
};

export function CrudList({
  title,
  entity,
  items,
  fields,
}: {
  title: string;
  entity: "services" | "pricing" | "samples";
  items: any[];
  fields: Field[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);

  async function save(form: HTMLFormElement, id?: string) {
    const fd = new FormData(form);
    const data: any = {};
    for (const f of fields) {
      const raw = fd.get(f.name);
      if (f.type === "checkbox") data[f.name] = raw === "on";
      else if (f.type === "number") data[f.name] = raw ? Number(raw) : 0;
      else if (f.type === "textarea-list") data[f.name] = String(raw || "").split("\n").map((s) => s.trim()).filter(Boolean);
      else data[f.name] = raw ? String(raw) : null;
    }
    const url = id ? `/api/admin/${entity}/${id}` : `/api/admin/${entity}`;
    const method = id ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setEditing(null);
      setCreating(false);
      router.refresh();
    } else {
      alert("Save failed: " + (await res.text()));
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`/api/admin/${entity}/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="h2">{title}</h1>
        <button onClick={() => { setCreating(true); setEditing({}); }} className="btn-primary">+ New</button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
        {items.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No items yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>{fields.slice(0, 3).map((f) => (<th key={f.name} className="px-4 py-2">{f.label}</th>))}<th className="px-4 py-2">Visible</th><th className="px-4 py-2"></th></tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t border-slate-100">
                  {fields.slice(0, 3).map((f) => (
                    <td key={f.name} className="px-4 py-2 align-top">{String(it[f.name] ?? "").slice(0, 80)}</td>
                  ))}
                  <td className="px-4 py-2 align-top">{it.visible ? "✓" : "—"}</td>
                  <td className="px-4 py-2 align-top">
                    <button className="text-brand-700 hover:underline" onClick={() => { setEditing(it); setCreating(false); }}>Edit</button>
                    <button className="ml-3 text-red-600 hover:underline" onClick={() => remove(it.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/40 p-4">
          <form
            className="card w-full max-w-2xl"
            onSubmit={(e) => { e.preventDefault(); save(e.currentTarget, creating ? undefined : editing.id); }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="h3">{creating ? "Create" : "Edit"}</h3>
              <button type="button" className="text-slate-500" onClick={() => { setEditing(null); setCreating(false); }}>✕</button>
            </div>
            <div className="space-y-3">
              {fields.map((f) => {
                const val = editing[f.name];
                if (f.type === "textarea") {
                  return (
                    <div key={f.name}>
                      <label className="label">{f.label}</label>
                      <textarea className="input" name={f.name} rows={4} defaultValue={val ?? ""} required={f.required} />
                    </div>
                  );
                }
                if (f.type === "textarea-list") {
                  let list: string[] = [];
                  try { list = typeof val === "string" ? JSON.parse(val) : val || []; } catch {}
                  return (
                    <div key={f.name}>
                      <label className="label">{f.label}</label>
                      <textarea className="input" name={f.name} rows={4} defaultValue={Array.isArray(list) ? list.join("\n") : ""} />
                    </div>
                  );
                }
                if (f.type === "checkbox") {
                  return (
                    <label key={f.name} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name={f.name} defaultChecked={val !== false && val !== undefined ? !!val : true} />
                      {f.label}
                    </label>
                  );
                }
                return (
                  <div key={f.name}>
                    <label className="label">{f.label}</label>
                    <input
                      className="input"
                      type={f.type || "text"}
                      name={f.name}
                      defaultValue={val ?? ""}
                      required={f.required}
                      placeholder={f.placeholder}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="btn-ghost" onClick={() => { setEditing(null); setCreating(false); }}>Cancel</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
