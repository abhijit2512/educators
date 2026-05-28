/**
 * Default values for the editable content that was previously hardcoded.
 * Shared by the runtime settings fallbacks (src/lib/settings.ts) and the
 * database seed (prisma/seed.ts) so there's a single source of truth.
 *
 * Long-form fields (legal pages, coding page) use a tiny markdown-lite
 * format rendered by <RichText>: a line starting with "## " becomes a
 * heading, a line starting with "- " becomes a bullet, blank lines separate
 * paragraphs. Admins can edit these as plain text from the dashboard.
 */
export const EXTENDED_DEFAULTS: Record<string, string> = {
  // Homepage hero
  hero_badges: "1-to-1 mentors|UK academic standards|Confidential|Email & WhatsApp support",
  home_coding_heading: "Coding and programming learning support",
  home_coding_text:
    "We help students understand coding concepts, fix errors, improve programming logic, review code, and learn how to approach technical tasks. Support is provided for learning and guidance purposes only.",
  cta_heading: "Ready to start learning with a mentor?",
  cta_text: "Tell us what you need help with — we’ll respond within one working day.",

  // About page
  about_title: "Coaching students — never replacing them",
  about_integrity_card:
    "We do not write or submit assessed work for students. All output is for learning, guidance, editing and reference only.",

  // Coding & Programming page
  coding_heading: "Coding and programming learning support",
  coding_subheading:
    "We help students understand coding concepts, fix errors, improve programming logic, review code, and learn how to approach technical tasks. Support is provided for learning and guidance purposes only.",
  coding_languages:
    "Python|JavaScript|Java|HTML|CSS|React|Node.js|SQL|PHP|C|C++|GitHub & version control",
  coding_disclaimer:
    "All coding support is provided for educational guidance, tutoring, debugging, and learning purposes only. Students must understand, adapt, and submit their own work according to their institution’s academic integrity rules.",

  // Legal pages (markdown-lite; rendered by <RichText>)
  legal_terms: [
    "## 1. Service",
    "We provide academic coaching, tutoring, research-method guidance, data-analysis tutoring, coding learning support, proofreading, editing and reference materials.",
    "",
    "## 2. Scope",
    "All output is for the student’s learning, guidance and reference. We do not complete or submit assessed work on the student’s behalf.",
    "",
    "## 3. Fees and payment",
    "Pricing is quote-based. Once a quote is accepted, payment is due before the support session or material is delivered, unless otherwise agreed in writing.",
    "",
    "## 4. Student responsibilities",
    "The student is responsible for ensuring that any use of our coaching, tutoring or reference materials complies with their institution’s academic integrity policy.",
    "",
    "## 5. Limitation of liability",
    "We provide tutoring and guidance in good faith and do not guarantee any particular grade or outcome. Our liability is limited to the value of the fees paid for the relevant service.",
    "",
    "## 6. Changes",
    "We may update these terms from time to time. The latest version will always be available on this page.",
  ].join("\n"),

  legal_privacy: [
    "We respect your privacy. This page explains what personal data we collect, how we use it, and your rights under UK GDPR.",
    "",
    "## Data we collect",
    "- Contact details you submit through enquiry or registration forms (name, email, phone, country, university).",
    "- Details of the support you ask for (subject, level, deadline, description, optional file).",
    "- Account, payment and invoice records.",
    "- Basic site analytics (anonymous usage data).",
    "",
    "## How we use it",
    "- To respond to your enquiry and deliver the support you requested.",
    "- To process payments and issue invoices.",
    "- To communicate updates about your request.",
    "- To comply with legal and accounting obligations.",
    "",
    "## Sharing",
    "We do not sell your data. We share it only with the payment processor (Stripe / PayPal) and email service provider strictly to deliver the service.",
    "",
    "## Your rights",
    "You can request access, correction or deletion of your data at any time by emailing us.",
  ].join("\n"),

  legal_refund: [
    "We aim to provide every student with high-quality coaching. If you are not satisfied with a session or piece of feedback, please contact us within 7 days of delivery and we will review the case fairly.",
    "",
    "## Eligible for a refund",
    "- Session or material not delivered.",
    "- Duplicate payment.",
    "- Service materially different from the agreed scope.",
    "",
    "## Not eligible for a refund",
    "- Dissatisfaction with academic outcome (we cannot guarantee grades).",
    "- Refunds requested after the support was delivered and accepted.",
    "",
    "Approved refunds are returned via the original payment method within 10 working days.",
  ].join("\n"),

  legal_cookies: [
    "We use only essential cookies to keep you signed in and to remember your preferences. We do not use third-party advertising cookies.",
    "",
    "## Essential cookies",
    "Used for authentication (sign-in session) and security. Required for the site to function.",
    "",
    "## Analytics",
    "If we enable analytics in the future, this page will be updated and a banner will be shown.",
  ].join("\n"),

  legal_academic_integrity: [
    "## What we do",
    "- One-to-one tutoring, coaching and mentoring.",
    "- Research-method guidance and methodology discussions.",
    "- Data-analysis walk-throughs (SPSS, NVivo, Excel).",
    "- Coding tutoring, debugging support and code review for learning.",
    "- Proofreading, editing, formatting and referencing guidance.",
    "- Reference examples and model materials for learning purposes only.",
    "",
    "## What we do not do",
    "- We do not write or submit assessed work on behalf of any student.",
    "- We do not guarantee marks, grades or distinctions.",
    "- We do not provide “submit-ready” assignments or coursework.",
    "- We do not encourage breach of any university’s academic regulations.",
    "",
    "## Student responsibility",
    "Students remain fully responsible for understanding, adapting and submitting their own work. Before submitting, students should always check their institution’s rules on acceptable use of external academic support.",
  ].join("\n"),

  // Layout spacing — vertical padding in pixels (top & bottom), admin-editable
  header_padding_y: "12",
  footer_padding_y: "56",
  section_padding_y: "80",
};

export const DEFAULT_FAQ: Array<[string, string]> = [
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
