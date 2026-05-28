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
          <h1 className="h1 mt-2">{s.about_title}</h1>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="lead mt-5">{s.about_intro}</p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Card title="Our mission">{s.about_mission}</Card>
          <Card title="Our approach">{s.about_approach}</Card>
          <Card title="UK and international focus">{s.about_focus}</Card>
          <Card title="Academic integrity">{s.about_integrity_card}</Card>
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
