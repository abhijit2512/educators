import { getSiteSettings } from "@/lib/settings";
import { RichText } from "@/components/rich-text";

export const metadata = { title: "Cookie Policy" };

export default async function CookiesPage() {
  const s = await getSiteSettings();
  return (
    <>
      <h1 className="h2">Cookie Policy</h1>
      <RichText text={s.legal_cookies} className="prose-academic" />
    </>
  );
}
