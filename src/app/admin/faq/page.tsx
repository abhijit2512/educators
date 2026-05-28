import { prisma } from "@/lib/prisma";
import { CrudList } from "@/components/admin/crud-list";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  const items = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });
  return (
    <CrudList
      title="FAQ"
      entity="faq"
      items={items as any}
      fields={[
        { name: "question", label: "Question", required: true },
        { name: "answer", label: "Answer", type: "textarea", required: true },
        { name: "order", label: "Order", type: "number" },
        { name: "visible", label: "Visible", type: "checkbox" },
      ]}
    />
  );
}
