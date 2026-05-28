/**
 * Export editable CONTENT (not user/enquiry/payment data) to a JSON file so
 * you can move it between your local copy and the live site.
 *
 *   npm run content:export                 -> writes content-export.json
 *   npm run content:export my-backup.json  -> writes to a custom path
 *
 * Exports: site settings, services, pricing plans, sample resources.
 * Deliberately EXCLUDES users, enquiries, payments and invoices — those are
 * real operational records that should never be overwritten by a sync.
 */
import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "node:fs";

const prisma = new PrismaClient();

async function main() {
  const outPath = process.argv[2] || "content-export.json";

  const [settings, services, pricingPlans, samples] = await Promise.all([
    prisma.siteSetting.findMany(),
    prisma.service.findMany({ orderBy: { order: "asc" } }),
    prisma.pricingPlan.findMany({ orderBy: { order: "asc" } }),
    prisma.samplePaper.findMany({ orderBy: { order: "asc" } }),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    version: 1,
    settings: settings.map((s) => ({ key: s.key, value: s.value })),
    services: services.map(({ id, createdAt, updatedAt, ...rest }) => rest),
    pricingPlans: pricingPlans.map(({ id, createdAt, updatedAt, ...rest }) => rest),
    samples: samples.map(({ id, createdAt, updatedAt, ...rest }) => rest),
  };

  writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(
    `✓ Exported to ${outPath}\n  - ${payload.settings.length} settings\n  - ${payload.services.length} services\n  - ${payload.pricingPlans.length} pricing plans\n  - ${payload.samples.length} samples`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
