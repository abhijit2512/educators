import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function POST(req: Request) {
  const g = await requireAdmin();
  if (!g.ok) return g.response;
  const d = await req.json();
  const item = await prisma.pricingPlan.create({
    data: {
      slug: d.slug,
      title: d.title,
      summary: d.summary,
      features: JSON.stringify(d.features ?? []),
      ctaLabel: d.ctaLabel ?? "Request a Custom Quote",
      order: d.order ?? 0,
      visible: d.visible ?? true,
    },
  });
  return NextResponse.json(item);
}
