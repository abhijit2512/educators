"use client";
import { useState } from "react";

/**
 * Image field for the admin: shows a live preview, lets you either pick an
 * image (embedded directly as a data URL so it works on any host without a
 * writable uploads folder) or paste an image URL. The chosen value is kept in
 * a real input named `name` so it submits with the surrounding form exactly
 * like a normal text field.
 */
export function ImageUpload({ name, initialUrl }: { name: string; initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    // Keep the embedded image small — logos should be well under this.
    if (file.size > 1.5 * 1024 * 1024) {
      setError("Please use an image under 1.5 MB (logos are usually much smaller).");
      return;
    }
    setBusy(true);
    const reader = new FileReader();
    reader.onload = () => {
      setUrl(String(reader.result || ""));
      setBusy(false);
    };
    reader.onerror = () => {
      setError("Could not read that image. Try a different file.");
      setBusy(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 flex-none items-center justify-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Logo preview" className="h-full w-full object-contain" />
          ) : (
            <span className="text-xs text-slate-400">No image</span>
          )}
        </div>
        <div className="flex-1">
          <label className="btn-ghost cursor-pointer text-sm">
            {busy ? "Uploading…" : "Upload image"}
            <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={onFile} disabled={busy} />
          </label>
          <p className="mt-1 text-xs text-slate-500">PNG, JPG, SVG or WebP. Max 10MB.</p>
        </div>
      </div>
      <input
        className="input"
        type="text"
        name={name}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="…or paste an image URL"
      />
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
