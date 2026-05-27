import { prisma } from "@/lib/prisma";
import { CrudList } from "@/components/admin/crud-list";

export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  const items = await prisma.pricingPlan.findMany({ orderBy: { order: "asc" } });
  return (
    <CrudList
      title="Pricing plans"
      entity="pricing"
      items={items as any}
      fields={[
        { name: "slug", label: "Slug", required: true },
        { name: "title", label: "Title", required: true },
        { name: "summary", label: "Summary", type: "textarea", required: true },
        { name: "features", label: "Features (one per line)", type: "textarea-list" },
        { name: "ctaLabel", label: "CTA label", placeholder: "Request a Custom Quote" },
        { name: "order", label: "Order", type: "number" },
        { name: "visible", label: "Visible", type: "checkbox" },
      ]}
    />
  );
}
