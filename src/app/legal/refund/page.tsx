export const metadata = { title: "Refund Policy" };
export default function RefundPage() {
  return (
    <>
      <h1 className="h2">Refund Policy</h1>
      <p className="mt-3">We aim to provide every student with high-quality coaching. If you are not satisfied with a session or piece of feedback, please contact us within 7 days of delivery and we will review the case fairly.</p>
      <h2 className="h3 mt-6">Eligible for a refund</h2>
      <ul className="list-disc pl-6">
        <li>Session or material not delivered.</li>
        <li>Duplicate payment.</li>
        <li>Service materially different from the agreed scope.</li>
      </ul>
      <h2 className="h3 mt-6">Not eligible for a refund</h2>
      <ul className="list-disc pl-6">
        <li>Dissatisfaction with academic outcome (we cannot guarantee grades).</li>
        <li>Refunds requested after the support was delivered and accepted.</li>
      </ul>
      <p className="mt-4">Approved refunds are returned via the original payment method within 10 working days.</p>
    </>
  );
}
