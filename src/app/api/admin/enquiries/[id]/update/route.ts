import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const schema = z.object({ message: z.string().min(1).max(4000) });

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const g = await requireAdmin();
  if (!g.ok) return g.response;
  const { message } = schema.parse(await req.json());
  await prisma.requestUpdate.create({
    data: {
      enquiryId: params.id,
      authorId: g.session.user.id,
      authorRole: "ADMIN",
      message,
    },
  });
  return NextResponse.json({ ok: true });
}
