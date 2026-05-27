import { prisma } from "@/lib/prisma";
import { CrudList } from "@/components/admin/crud-list";

export const dynamic = "force-dynamic";

export default async function AdminSamplesPage() {
  const items = await prisma.samplePaper.findMany({ orderBy: { order: "asc" } });
  return (
    <CrudList
      title="Sample papers"
      entity="samples"
      items={items as any}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "subject", label: "Subject" },
        { name: "description", label: "Description", type: "textarea", required: true },
        { name: "externalUrl", label: "External URL (preferred)" },
        { name: "fileUrl", label: "Uploaded file URL" },
        { name: "order", label: "Order", type: "number" },
        { name: "visible", label: "Visible", type: "checkbox" },
      ]}
    />
  );
}
