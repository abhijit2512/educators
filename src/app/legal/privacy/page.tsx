import { getSiteSettings } from "@/lib/settings";
import { RichText } from "@/components/rich-text";

export const metadata = { title: "Privacy Policy" };

export default async function PrivacyPage() {
  const s = await getSiteSettings();
  return (
    <>
      <h1 className="h2">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {new Date().toLocaleDateString("en-GB")}</p>
      <RichText text={s.legal_privacy} className="prose-academic" />
    </>
  );
}
