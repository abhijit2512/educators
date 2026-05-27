import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().max(40).optional().or(z.literal("")),
  country: z.string().max(80).optional().or(z.literal("")),
  university: z.string().max(160).optional().or(z.literal("")),
  level: z.string().max(80).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = schema.parse(await req.json());
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      profile: {
        upsert: {
          create: { phone: data.phone, country: data.country, university: data.university, level: data.level },
          update: { phone: data.phone, country: data.country, university: data.university, level: data.level },
        },
      },
    },
  });
  return NextResponse.json({ ok: true });
}
