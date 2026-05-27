import { getSiteSettings } from "@/lib/settings";
export const metadata = { title: "Privacy Policy" };

export default async function PrivacyPage() {
  const s = await getSiteSettings();
  return (
    <>
      <h1 className="h2">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {new Date().toLocaleDateString("en-GB")}</p>
      <p>{s.business_name} (“we”, “us”) respects your privacy. This page explains what personal data we collect, how we use it, and your rights under UK GDPR.</p>

      <h2 className="h3 mt-6">Data we collect</h2>
      <ul className="list-disc pl-6">
        <li>Contact details you submit through enquiry or registration forms (name, email, phone, country, university).</li>
        <li>Details of the support you ask for (subject, level, deadline, description, optional file).</li>
        <li>Account, payment and invoice records.</li>
        <li>Basic site analytics (anonymous usage data).</li>
      </ul>

      <h2 className="h3 mt-6">How we use it</h2>
      <ul className="list-disc pl-6">
        <li>To respond to your enquiry and deliver the support you requested.</li>
        <li>To process payments and issue invoices.</li>
        <li>To communicate updates about your request.</li>
        <li>To comply with legal and accounting obligations.</li>
      </ul>

      <h2 className="h3 mt-6">Sharing</h2>
      <p>We do not sell your data. We share it only with the payment processor (Stripe / PayPal) and email service provider strictly to deliver the service.</p>

      <h2 className="h3 mt-6">Your rights</h2>
      <p>You can request access, correction or deletion of your data at any time by emailing {s.business_email}.</p>
    </>
  );
}
