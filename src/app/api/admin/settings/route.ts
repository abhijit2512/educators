import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { setSiteSetting } from "@/lib/settings";

export async function POST(req: Request) {
  const g = await requireAdmin();
  if (!g.ok) return g.response;
  const data = (await req.json()) as Record<string, string>;
  for (const [k, v] of Object.entries(data)) {
    if (typeof v !== "string") continue;
    await setSiteSetting(k, v);
  }
  return NextResponse.json({ ok: true });
}
