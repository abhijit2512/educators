import { getSiteSettings } from "@/lib/settings";
import { LegalForm } from "@/components/admin/legal-form";

export const dynamic = "force-dynamic";

export default async function AdminLegalPage() {
  const s = await getSiteSettings();
  return (
    <div className="space-y-4">
      <h1 className="h2">Legal pages</h1>
      <p className="text-sm text-slate-600">
        Edit the body of each legal page. Use <code>## Heading</code> on its own
        line for a sub-heading, <code>- item</code> for a bullet, and a blank
        line to separate paragraphs.
      </p>
      <LegalForm
        initial={{
          legal_terms: s.legal_terms,
          legal_privacy: s.legal_privacy,
          legal_refund: s.legal_refund,
          legal_cookies: s.legal_cookies,
          legal_academic_integrity: s.legal_academic_integrity,
          integrity_disclaimer: s.integrity_disclaimer,
        }}
      />
    </div>
  );
}
