import { prisma } from "./prisma";

export async function generateInvoiceNumber(): Promise<string> {
  const now = new Date();
  const ym = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const prefix = `INV-${ym}-`;
  const last = await prisma.invoice.findFirst({
    where: { number: { startsWith: prefix } },
    orderBy: { number: "desc" },
  });
  const lastSeq = last ? parseInt(last.number.slice(prefix.length), 10) || 0 : 0;
  const next = String(lastSeq + 1).padStart(4, "0");
  return prefix + next;
}
