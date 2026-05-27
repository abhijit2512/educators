/**
 * Lightweight in-memory rate limiter. Good enough for a single-instance
 * Hostinger Node deployment. If you scale across multiple Node processes
 * later, swap this for Redis / Upstash — keep the same `check()` signature.
 */

type Bucket = { count: number; resetAt: number };

const STORE = new Map<string, Bucket>();

export function check(
  key: string,
  opts: { limit: number; windowMs: number },
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = STORE.get(key);
  if (!existing || existing.resetAt < now) {
    const fresh = { count: 1, resetAt: now + opts.windowMs };
    STORE.set(key, fresh);
    return { ok: true, remaining: opts.limit - 1, resetAt: fresh.resetAt };
  }
  existing.count += 1;
  const ok = existing.count <= opts.limit;
  return { ok, remaining: Math.max(0, opts.limit - existing.count), resetAt: existing.resetAt };
}

/**
 * Best-effort client IP from headers Next sets on the Request, with
 * sensible fallbacks. Hostinger / Cloudflare style headers handled.
 */
export function clientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown"
  );
}

// Opportunistic cleanup so the map can't grow unbounded.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, b] of STORE) if (b.resetAt < now) STORE.delete(k);
  }, 5 * 60 * 1000).unref?.();
}
