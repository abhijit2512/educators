import Link from "next/link";
import { Reveal } from "@/components/reveal";

export const metadata = { title: "How it works" };

const STEPS = [
  ["Submit enquiry", "Tell us what you need help with — subject, level, deadline, format."],
  ["Choose support type", "Pick tutoring, coaching, editing, coding help or research-method support."],
  ["Receive ethical support recommendation", "We propose a learning plan that suits your goals and university’s rules."],
  ["Confirm the quote", "Transparent quote based on scope, complexity and deadline."],
  ["Make payment", "Secure payment via Stripe, PayPal or bank transfer."],
  ["Receive support", "Sessions, written feedback, walk-throughs or reference materials."],
  ["Review and follow up", "We answer follow-up questions and review your own work for further coaching."],
];

export default function HowItWorksPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Process</span>
          <h1 className="h1 mt-2">How it works</h1>
          <p className="lead mt-4">A simple, transparent process from first enquiry to follow-up.</p>
        </div>

        <ol className="mx-auto mt-12 grid max-w-4xl gap-4">
          {STEPS.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.03}>
              <li className="flex gap-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-base font-semibold">{t}</h3>
                  <p className="mt-1 text-sm text-slate-600">{d}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <Link href="/contact" className="btn-primary">Start your enquiry</Link>
        </div>
      </div>
    </section>
  );
}
