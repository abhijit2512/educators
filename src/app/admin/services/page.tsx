import { prisma } from "@/lib/prisma";
import { CrudList } from "@/components/admin/crud-list";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return (
    <CrudList
      title="Services"
      entity="services"
      items={services as any}
      fields={[
        { name: "slug", label: "Slug", required: true },
        { name: "title", label: "Title", required: true },
        { name: "category", label: "Category", placeholder: "Research / Data / Tech / Editing / Subject / Communication" },
        { name: "summary", label: "Summary", type: "textarea", required: true },
        { name: "body", label: "Body", type: "textarea" },
        { name: "order", label: "Order", type: "number" },
        { name: "visible", label: "Visible", type: "checkbox" },
      ]}
    />
  );
}
