import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin();
  if (!g.ok) return g.response;
  const d = await req.json();
  const item = await prisma.pricingPlan.update({
    where: { id: params.id },
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

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin();
  if (!g.ok) return g.response;
  await prisma.pricingPlan.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
