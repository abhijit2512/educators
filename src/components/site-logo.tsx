"use client";
import { useState } from "react";
import Link from "next/link";

/**
 * Brand mark used in the header and footer.
 *
 * Tries `settings.logo_url` first (defaults to `/logo.png`). If that image
 * 404s — e.g. the PNG hasn't been uploaded yet — it transparently falls back
 * to the SVG placeholder at `/logo.svg`, then to a coloured "EU" monogram if
 * neither exists.
 */
export function SiteLogo({
  logoUrl,
  businessName,
  href = "/",
  size = 36,
  showWordmark = true,
}: {
  logoUrl?: string;
  businessName: string;
  href?: string;
  size?: number;
  showWordmark?: boolean;
}) {
  const sources = [logoUrl || "/logo.svg", "/logo.svg"].filter(Boolean) as string[];
  const [idx, setIdx] = useState(0);
  const [broken, setBroken] = useState(false);

  return (
    <Link href={href} className="flex items-center gap-2 font-bold text-ink-900">
      {broken ? (
        <span
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 text-white"
          style={{ height: size, width: size }}
        >
          <span className="text-sm font-extrabold tracking-tight">EU</span>
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sources[idx]}
          alt={businessName}
          width={size}
          height={size}
          className="rounded-xl object-contain"
          onError={() => {
            if (idx + 1 < sources.length) setIdx(idx + 1);
            else setBroken(true);
          }}
        />
      )}
      {showWordmark && <span className="hidden sm:inline">{businessName}</span>}
    </Link>
  );
}
