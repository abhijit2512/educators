import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const patchSchema = z.object({ role: z.enum(["ADMIN", "STUDENT"]) });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin();
  if (!g.ok) return g.response;

  const { role } = patchSchema.parse(await req.json());

  // Guard: don't allow removing the last remaining admin.
  if (role === "STUDENT") {
    const target = await prisma.user.findUnique({ where: { id: params.id } });
    if (target?.role === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot demote the last admin. Promote another admin first." },
          { status: 400 },
        );
      }
    }
  }

  await prisma.user.update({ where: { id: params.id }, data: { role } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin();
  if (!g.ok) return g.response;

  if (params.id === g.session.user.id) {
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  }
  const target = await prisma.user.findUnique({ where: { id: params.id } });
  if (target?.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return NextResponse.json({ error: "Cannot delete the last admin." }, { status: 400 });
    }
  }

  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
