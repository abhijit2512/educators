import { getSiteSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const s = await getSiteSettings();
  return (
    <div className="space-y-4">
      <h1 className="h2">Site settings</h1>
      <p className="text-sm text-slate-600">These values appear across the public site, in emails and on invoices.</p>
      <SettingsForm initial={s} />
    </div>
  );
}
