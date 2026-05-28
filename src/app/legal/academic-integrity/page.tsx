import { getSiteSettings } from "@/lib/settings";
import { RichText } from "@/components/rich-text";

export const metadata = { title: "Academic Integrity Policy" };

export default async function AcademicIntegrityPage() {
  const s = await getSiteSettings();
  return (
    <>
      <h1 className="h2">Academic Integrity Policy</h1>
      <p className="mt-3 text-base">{s.integrity_disclaimer}</p>
      <RichText text={s.legal_academic_integrity} className="prose-academic" />
    </>
  );
}
