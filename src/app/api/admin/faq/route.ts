import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function POST(req: Request) {
  const g = await requireAdmin();
  if (!g.ok) return g.response;
  const d = await req.json();
  const item = await prisma.faqItem.create({
    data: {
      question: d.question,
      answer: d.answer,
      order: d.order ?? 0,
      visible: d.visible ?? true,
    },
  });
  return NextResponse.json(item);
}
