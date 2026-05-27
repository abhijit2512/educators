import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { IntegrityBanner } from "@/components/integrity-banner";
import { getSiteSettings } from "@/lib/settings";

export const metadata = { title: "Coding and programming learning support" };

const LANGUAGES = [
  "Python", "JavaScript", "Java", "HTML", "CSS", "React", "Node.js",
  "SQL", "PHP", "C", "C++", "GitHub & version control",
];

const SUPPORT_AREAS = [
  ["Concept tutoring", "One-to-one walk-throughs of language fundamentals, libraries and frameworks."],
  ["Debugging help", "We work through errors together so you understand the cause and the fix."],
  ["Code review & explanation", "Mentors review code you wrote and explain how to improve it."],
  ["Programming logic & algorithms", "Step-by-step coaching on algorithms, data structures and problem-solving patterns."],
  ["Web development guidance", "HTML, CSS, JavaScript, React and Node.js project guidance."],
  ["Basic app development guidance", "Project structure, libraries to use, and how to approach features."],
  ["GitHub & version control", "Branches, pull requests, merging and collaboration walk-throughs."],
  ["SQL and databases", "Schema design, queries, joins and reporting fundamentals."],
];

export default async function CodingPage() {
  const s = await getSiteSettings();
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ink-900 via-ink-800 to-brand-900" />
        <div className="container py-20 text-white sm:py-28">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-white/20">
              Coding · Programming
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Coding and programming learning support
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/85">
              We help students understand coding concepts, fix errors, improve programming logic,
              review code, and learn how to approach technical tasks. Support is provided for
              learning and guidance purposes only.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contact?service=coding-and-programming" className="btn-primary">
                Request coding help
              </Link>
              <Link href="/pricing" className="btn-outline">See pricing</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Languages we tutor</span>
            <h2 className="h2 mt-2">Popular languages and tools</h2>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {LANGUAGES.map((l) => (
              <span key={l} className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-ink-900 ring-1 ring-slate-200">
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">What we support</span>
            <h2 className="h2 mt-2">Mentorship across the coding learning journey</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SUPPORT_AREAS.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.03}>
                <div className="card h-full">
                  <h3 className="text-base font-semibold">{t}</h3>
                  <p className="mt-1.5 text-sm text-slate-600">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-3xl">
          <IntegrityBanner
            text="All coding support is provided for educational guidance, tutoring, debugging, and learning purposes only. Students must understand, adapt, and submit their own work according to their institution’s academic integrity rules."
          />
          <p className="mt-6 text-sm text-slate-600">{s.integrity_disclaimer}</p>
        </div>
      </section>
    </>
  );
}
