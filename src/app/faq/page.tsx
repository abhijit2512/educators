import { Reveal } from "@/components/reveal";

export const metadata = { title: "Frequently asked questions" };

const FAQ = [
  ["What services are offered?", "We offer academic coaching, dissertation guidance, research-method support, SPSS/NVivo tutoring, Excel and accounting guidance, coding and programming learning support, proofreading, editing, formatting, referencing, presentation and poster coaching, and subject coaching across humanities, law, computer science and technical disciplines."],
  ["Do you complete assignments?", "No. We do not write, complete or submit any assessed work on behalf of students. All support is for learning, tutoring, editing, debugging, walking-through, explaining and reference only."],
  ["Is the support ethical?", "Yes. Our mentors coach you through your own work. We follow strict academic-integrity guidelines and ask every student to acknowledge them on enquiry."],
  ["Do you support UK students?", "Yes — UK universities are our primary focus. We are familiar with UK academic conventions, OSCOLA, Harvard, APA and MLA referencing."],
  ["Do you support international students?", "Yes. We support students worldwide and are happy to schedule sessions in different time zones."],
  ["Do you provide coding help?", "Yes — we tutor Python, JavaScript, Java, HTML, CSS, React, Node.js, SQL, PHP, C, C++, Git and more. We help you understand the code; we do not submit code as your own work."],
  ["Can students upload files?", "Yes — the enquiry form supports a file upload, and we can also receive files by email or WhatsApp."],
  ["How does payment work?", "After your enquiry we send a quote. You can pay securely via Stripe, PayPal or bank transfer once you accept the quote."],
  ["How do invoices work?", "We issue a numbered invoice automatically when a payment is confirmed. You can view your invoices in your student dashboard."],
  ["How can students contact admin?", "Use the contact form, your dashboard ‘Request update’ feature, email, phone, or WhatsApp — all listed in the footer."],
  ["Can students see previous requests?", "Yes — sign in to your dashboard at /dashboard to see all requests, their status, and invoices."],
];

export default function FAQPage() {
  return (
    <section className="section">
      <div className="container max-w-3xl">
        <div className="text-center">
          <span className="eyebrow">FAQ</span>
          <h1 className="h1 mt-2">Frequently asked questions</h1>
        </div>
        <div className="mt-10 space-y-3">
          {FAQ.map(([q, a], i) => (
            <Reveal key={q} delay={i * 0.02}>
              <details className="group rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 open:ring-brand-200">
                <summary className="cursor-pointer list-none text-base font-semibold text-ink-900 marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {q}
                    <span className="text-brand-600 transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-slate-700">{a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
