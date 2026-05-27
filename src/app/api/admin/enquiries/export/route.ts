import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import Papa from "papaparse";
import ExcelJS from "exceljs";
import type { EnquiryStatus } from "@prisma/client";

const STATUSES: EnquiryStatus[] = ["NEW", "QUOTED", "PAID", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export async function GET(req: Request) {
  const g = await requireAdmin();
  if (!g.ok) return g.response;

  const url = new URL(req.url);
  const format = (url.searchParams.get("format") || "csv").toLowerCase();
  const status = url.searchParams.get("status");
  const q = (url.searchParams.get("q") || "").trim();

  const enquiries = await prisma.enquiry.findMany({
    where: {
      status: status && STATUSES.includes(status as EnquiryStatus) ? (status as EnquiryStatus) : undefined,
      ...(q && {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
          { subject: { contains: q } },
          { serviceSlug: { contains: q } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = enquiries.map((e) => ({
    Name: e.name,
    Email: e.email,
    Phone: e.phone || "",
    Country: e.country || "",
    Service: e.serviceSlug,
    Subject: e.subject || "",
    "Academic Level": e.academicLevel || "",
    Deadline: e.deadline ? e.deadline.toISOString().slice(0, 10) : "",
    "Programming Language": e.programmingLanguage || "",
    Status: e.status,
    "Created (UTC)": e.createdAt.toISOString(),
    Description: (e.description || "").slice(0, 500),
  }));

  if (format === "xlsx") {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Enquiries");
    if (rows.length > 0) {
      ws.columns = Object.keys(rows[0]).map((k) => ({ header: k, key: k, width: 22 }));
      ws.addRows(rows);
      ws.getRow(1).font = { bold: true };
    } else {
      ws.addRow(["No enquiries"]);
    }
    const buf = await wb.xlsx.writeBuffer();
    return new Response(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="enquiries-${Date.now()}.xlsx"`,
      },
    });
  }

  const csv = Papa.unparse(rows);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="enquiries-${Date.now()}.csv"`,
    },
  });
}
