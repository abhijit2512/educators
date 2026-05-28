import { getSiteSettings } from "@/lib/settings";
import { RichText } from "@/components/rich-text";

export const metadata = { title: "Refund Policy" };

export default async function RefundPage() {
  const s = await getSiteSettings();
  return (
    <>
      <h1 className="h2">Refund Policy</h1>
      <RichText text={s.legal_refund} className="prose-academic" />
    </>
  );
}
