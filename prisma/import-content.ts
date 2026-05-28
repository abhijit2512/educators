/**
 * Import editable CONTENT from a JSON file produced by `content:export`.
 * Use this to copy content from your local copy to the live site (or back).
 *
 *   npm run content:import                 -> reads content-export.json
 *   npm run content:import my-backup.json  -> reads a custom path
 *
 * Upserts settings (by key), services and pricing plans (by slug), and
 * samples (by title). It never touches users, enquiries, payments or
 * invoices. Existing items with the same key/slug/title are updated;
 * new ones are created. Nothing is deleted.
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";

const prisma = new PrismaClient();

async function main() {
  const inPath = process.argv[2] || "content-export.json";
  const raw = readFileSync(inPath, "utf8");
  const data = JSON.parse(raw);

  let settingsCount = 0;
  for (const s of data.settings ?? []) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
    settingsCount++;
  }

  let serviceCount = 0;
  for (const s of data.services ?? []) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
    serviceCount++;
  }

  let planCount = 0;
  for (const p of data.pricingPlans ?? []) {
    await prisma.pricingPlan.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
    planCount++;
  }

  // Samples have no unique key — match by title (update) else create.
  let sampleCount = 0;
  for (const sp of data.samples ?? []) {
    const existing = await prisma.samplePaper.findFirst({ where: { title: sp.title } });
    if (existing) {
      await prisma.samplePaper.update({ where: { id: existing.id }, data: sp });
    } else {
      await prisma.samplePaper.create({ data: sp });
    }
    sampleCount++;
  }

  console.log(
    `✓ Imported from ${inPath}\n  - ${settingsCount} settings\n  - ${serviceCount} services\n  - ${planCount} pricing plans\n  - ${sampleCount} samples`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
