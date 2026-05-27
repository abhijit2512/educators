import { getSiteSettings } from "@/lib/settings";
import { IntegrityBanner } from "@/components/integrity-banner";
import { Reveal } from "@/components/reveal";

export const metadata = { title: "About us" };

export default async function AboutPage() {
  const s = await getSiteSettings();
  return (
    <section className="section">
      <div className="container max-w-4xl">
        <Reveal>
          <span className="eyebrow">About</span>
          <h1 className="h1 mt-2">Coaching students — never replacing them</h1>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="lead mt-5">
            {s.business_name} is an academic learning-support service for UK and
            international students. We provide tutoring, research-method coaching,
            data-analysis walk-throughs, coding learning support, proofreading
            and referencing guidance.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Card title="Our mission">
            Help every student understand their subject and produce their own
            work confidently, ethically and to a high academic standard.
          </Card>
          <Card title="Our approach">
            One-to-one mentor sessions, written feedback, walk-through tutorials
            and reference examples — adapted to the student’s level and goals.
          </Card>
          <Card title="UK and international focus">
            Familiar with UK university conventions and international academic
            standards; comfortable working across all major referencing styles.
          </Card>
          <Card title="Academic integrity">
            We do not write or submit assessed work for students. All output is
            for learning, guidance, editing and reference only.
          </Card>
        </div>

        <div className="mt-12">
          <IntegrityBanner text={s.integrity_disclaimer} />
        </div>
      </div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card h-full">
      <h3 className="h3">{title}</h3>
      <p className="prose-academic mt-2">{children}</p>
    </div>
  );
}
