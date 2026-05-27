import { getSiteSettings } from "@/lib/settings";

export const metadata = { title: "Terms & Conditions" };

export default async function TermsPage() {
  const s = await getSiteSettings();
  return (
    <>
      <h1 className="h2">Terms & Conditions</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: {new Date().toLocaleDateString("en-GB")}</p>

      <h2 className="h3 mt-8">1. Service</h2>
      <p>{s.business_name} provides academic coaching, tutoring, research-method guidance, data-analysis tutoring, coding learning support, proofreading, editing and reference materials.</p>

      <h2 className="h3 mt-6">2. Scope</h2>
      <p>All output is for the student’s learning, guidance and reference. We do not complete or submit assessed work on the student’s behalf.</p>

      <h2 className="h3 mt-6">3. Fees and payment</h2>
      <p>Pricing is quote-based. Once a quote is accepted, payment is due before the support session or material is delivered, unless otherwise agreed in writing.</p>

      <h2 className="h3 mt-6">4. Student responsibilities</h2>
      <p>The student is responsible for ensuring that any use of our coaching, tutoring or reference materials complies with their institution’s academic integrity policy.</p>

      <h2 className="h3 mt-6">5. Limitation of liability</h2>
      <p>We provide tutoring and guidance in good faith and do not guarantee any particular grade or outcome. Our liability is limited to the value of the fees paid for the relevant service.</p>

      <h2 className="h3 mt-6">6. Changes</h2>
      <p>We may update these terms from time to time. The latest version will always be available on this page.</p>
    </>
  );
}
