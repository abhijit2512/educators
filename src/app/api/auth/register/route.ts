import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  password: z.string().min(8).max(200),
  phone: z.string().min(6, "A valid mobile number is required").max(40),
  country: z.string().max(80).optional(),
  university: z.string().max(160).optional(),
  level: z.string().max(80).optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { name, email, password, phone, country, university, level } = parsed.data;
  const lower = email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: lower } });
  if (existing) {
    return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email: lower,
      passwordHash,
      name,
      role: Role.STUDENT,
      profile: {
        create: { phone, country, university, level },
      },
    },
  });
  return NextResponse.json({ ok: true, id: user.id });
}
