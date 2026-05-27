import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin();
  if (!g.ok) return g.response;
  const d = await req.json();
  const item = await prisma.samplePaper.update({
    where: { id: params.id },
    data: {
      title: d.title,
      subject: d.subject ?? null,
      description: d.description,
      externalUrl: d.externalUrl ?? null,
      fileUrl: d.fileUrl ?? null,
      order: d.order ?? 0,
      visible: d.visible ?? true,
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin();
  if (!g.ok) return g.response;
  await prisma.samplePaper.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
