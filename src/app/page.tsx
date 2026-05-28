import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/reveal";
import { IntegrityBanner } from "@/components/integrity-banner";
import { iconFor } from "@/components/service-icons";
import { Hero3DLoader } from "@/components/hero-3d-loader";

async function safeServices() {
  try {
    return await prisma.service.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      take: 8,
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const s = await getSiteSettings();
  const services = await safeServices();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-hero-radial" />
        <div className="pointer-events-none absolute inset-0 bg-grid-soft [background-size:36px_36px] opacity-30" />
        <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 opacity-90 lg:block">
          <Hero3DLoader />
        </div>
        <div className="container relative grid gap-12 pt-16 pb-20 sm:pt-24 lg:grid-cols-2 lg:pt-28 lg:pb-28">
          <div>
            <Reveal>
              <span className="eyebrow">Ethical academic support · UK & worldwide</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="h1 mt-2">{s.hero_headline}</h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lead mt-5 max-w-xl">{s.hero_subheading}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary">Request a Quote</Link>
                <Link href="/services" className="btn-ghost">View Services</Link>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                {s.hero_badges.split("|").map((b) => b.trim()).filter(Boolean).map((b) => (
                  <Badge key={b}>{b}</Badge>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-brand-200/50 via-accent-400/20 to-transparent blur-2xl" />
              <div className="card relative overflow-hidden">
                <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Mentor online
                </div>
                <div className="space-y-3 text-sm">
                  <ChatBubble who="You">Can you help me understand SPSS regression for my dissertation?</ChatBubble>
                  <ChatBubble who="Mentor" them>
                    Of course — let’s walk through your model assumptions and how to interpret coefficients in your own words.
                  </ChatBubble>
                  <ChatBubble who="You">And could you review my Python data-cleaning script too?</ChatBubble>
                  <ChatBubble who="Mentor" them>
                    Yes — I’ll explain each step and suggest improvements so you can rewrite it yourself.
                  </ChatBubble>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                  <Stat label="Subjects" value="40+" />
                  <Stat label="Languages" value="12+" />
                  <Stat label="Response" value="<24h" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">What we help with</span>
            <h2 className="h2 mt-2">Coaching across every stage of academic life</h2>
            <p className="lead mt-3">
              Research-method tutoring, data-analysis support, coding learning, proofreading and subject coaching — for UK and international students.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(services.length ? services : FALLBACK_SERVICES).map((svc, i) => (
              <Reveal key={svc.slug} delay={i * 0.04}>
                <Link href={`/services/${svc.slug}`} className="group card h-full transition hover:-translate-y-1 hover:shadow-glow">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    {iconFor(svc.category)}
                  </div>
                  <h3 className="text-base font-semibold text-ink-900 group-hover:text-brand-700">{svc.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 line-clamp-3">{svc.summary}</p>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/services" className="btn-ghost">See all services →</Link>
          </div>
        </div>
      </section>

      {/* Coding highlight */}
      <section className="section">
        <div className="container">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-800 to-brand-900 p-10 text-white sm:p-14">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <Reveal>
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 ring-1 ring-white/20">
                    Coding · Programming
                  </span>
                  <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{s.home_coding_heading}</h2>
                  <p className="mt-4 text-white/80">{s.home_coding_text}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/services/coding-and-programming" className="btn-primary">Explore coding support</Link>
                    <Link href="/contact" className="btn-outline">Request coding help</Link>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {["Python","JavaScript","Java","HTML","CSS","React","Node.js","SQL","PHP","C","C++","Git"].map(l => (
                    <span key={l} className="rounded-xl bg-white/10 px-3 py-2 text-center text-white ring-1 ring-white/15">
                      {l}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* How it works preview */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">How it works</span>
            <h2 className="h2 mt-2">{s.how_heading}</h2>
          </div>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [s.how_1_title, s.how_1_text],
              [s.how_2_title, s.how_2_text],
              [s.how_3_title, s.how_3_text],
              [s.how_4_title, s.how_4_text],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.05}>
                <div className="card h-full">
                  <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <h3 className="text-base font-semibold">{t}</h3>
                  <p className="mt-1.5 text-sm text-slate-600">{d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Why us */}
      <section className="section">
        <div className="container">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="eyebrow">Why us</span>
            <h2 className="h2 mt-2">{s.why_heading}</h2>
          </div>
          <div className="grid gap-10 lg:grid-cols-3">
            {[
              [s.why_1_title, s.why_1_text],
              [s.why_2_title, s.why_2_text],
              [s.why_3_title, s.why_3_text],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.05}>
                <div className="card h-full">
                  <h3 className="h3">{t}</h3>
                  <p className="prose-academic mt-2">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (clearly marked as placeholder copy) */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Student voices</span>
            <h2 className="h2 mt-2">What students say about our mentoring</h2>
            <p className="mt-3 text-xs uppercase tracking-wider text-slate-500">
              Sample copy — replace with real student feedback in the admin panel
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote: "My mentor walked me through SPSS regression step by step. I finally understood what the numbers meant — and wrote the analysis chapter myself.",
                name: "Sample student",
                meta: "MSc, UK university",
              },
              {
                quote: "I was stuck on a Python data-cleaning script for days. One session and a clear explanation later, I knew exactly how to fix it on my own.",
                name: "Sample student",
                meta: "Undergraduate, Computer Science",
              },
              {
                quote: "The literature-review coaching helped me see how to structure my argument. The proofreading round caught issues I'd missed.",
                name: "Sample student",
                meta: "Postgraduate, Humanities",
              },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <figure className="card flex h-full flex-col">
                  <div className="text-brand-600" aria-hidden="true">
                    <svg width="28" height="20" viewBox="0 0 28 20" fill="currentColor">
                      <path d="M0 20V11.4C0 7.8 0.8 4.9 2.4 2.9 4 0.9 6.3 0 9.3 0v4.6c-1.4 0-2.5 0.4-3.3 1.3-0.8 0.9-1.1 2-1.1 3.5h4.4V20H0zm17.6 0V11.4c0-3.6 0.8-6.5 2.4-8.5C21.6 0.9 23.9 0 26.9 0v4.6c-1.4 0-2.5 0.4-3.3 1.3-0.8 0.9-1.1 2-1.1 3.5h4.4V20h-9.3z"/>
                    </svg>
                  </div>
                  <blockquote className="mt-3 text-sm text-slate-700">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 border-t border-slate-100 pt-3 text-xs">
                    <div className="font-semibold text-ink-900">{t.name}</div>
                    <div className="text-slate-500">{t.meta}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-slate-500">
            We don&apos;t publish unverified testimonials. The text above is illustrative
            until real student feedback (with permission) replaces it.
          </p>
        </div>
      </section>

      {/* CTA + integrity */}
      <section className="section">
        <div className="container grid gap-8 lg:grid-cols-3">
          <div className="card lg:col-span-2 bg-gradient-to-br from-brand-600 to-accent-500 text-white">
            <h2 className="text-3xl font-bold">{s.cta_heading}</h2>
            <p className="mt-2 text-white/90">{s.cta_text}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/contact" className="btn bg-white text-brand-700 hover:bg-brand-50">Request a Quote</Link>
              <Link href="/pricing" className="btn-outline">See pricing</Link>
            </div>
          </div>
          <IntegrityBanner text={s.integrity_disclaimer} />
        </div>
      </section>
    </>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
      {children}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
      <div className="text-lg font-bold text-ink-900">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

function ChatBubble({
  children,
  who,
  them = false,
}: {
  children: React.ReactNode;
  who: string;
  them?: boolean;
}) {
  return (
    <div className={them ? "flex justify-start" : "flex justify-end"}>
      <div
        className={
          (them
            ? "bg-slate-100 text-ink-900 rounded-bl-sm"
            : "bg-brand-600 text-white rounded-br-sm") +
          " max-w-[85%] rounded-2xl px-3.5 py-2.5"
        }
      >
        <div className={"mb-0.5 text-[10px] uppercase tracking-wider " + (them ? "text-slate-500" : "text-white/70")}>
          {who}
        </div>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}

const FALLBACK_SERVICES = [
  { slug: "dissertation-guidance", title: "Dissertation guidance", category: "Research", summary: "Structure, methodology and chapter-by-chapter coaching." },
  { slug: "spss-tutoring", title: "SPSS tutoring", category: "Data", summary: "Descriptive stats, regression, factor analysis — explained." },
  { slug: "coding-and-programming", title: "Coding & programming", category: "Tech", summary: "Tutoring, debugging walk-throughs and code review." },
  { slug: "proofreading-editing", title: "Proofreading & editing", category: "Editing", summary: "Clarity, grammar, style and referencing coaching." },
  { slug: "nvivo-support", title: "NVivo support", category: "Data", summary: "Coding, themes and node structures walk-throughs." },
  { slug: "law-study-support", title: "Law study support", category: "Subject", summary: "IRAC framework coaching and OSCOLA referencing." },
  { slug: "academic-poster", title: "Academic poster design", category: "Communication", summary: "Layout and visual storytelling coaching." },
  { slug: "research-method-support", title: "Research-method support", category: "Research", summary: "Qualitative, quantitative and mixed-methods coaching." },
];
