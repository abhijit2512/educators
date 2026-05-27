import { getSiteSettings } from "@/lib/settings";
export const metadata = { title: "Academic Integrity Policy" };

export default async function AcademicIntegrityPage() {
  const s = await getSiteSettings();
  return (
    <>
      <h1 className="h2">Academic Integrity Policy</h1>
      <p className="mt-3 text-base">{s.integrity_disclaimer}</p>

      <h2 className="h3 mt-8">What we do</h2>
      <ul className="list-disc pl-6">
        <li>One-to-one tutoring, coaching and mentoring.</li>
        <li>Research-method guidance and methodology discussions.</li>
        <li>Data-analysis walk-throughs (SPSS, NVivo, Excel).</li>
        <li>Coding tutoring, debugging support and code review for learning.</li>
        <li>Proofreading, editing, formatting and referencing guidance.</li>
        <li>Reference examples and model materials for learning purposes only.</li>
      </ul>

      <h2 className="h3 mt-6">What we do not do</h2>
      <ul className="list-disc pl-6">
        <li>We do not write or submit assessed work on behalf of any student.</li>
        <li>We do not guarantee marks, grades or distinctions.</li>
        <li>We do not provide “submit-ready” assignments or coursework.</li>
        <li>We do not encourage breach of any university’s academic regulations.</li>
      </ul>

      <h2 className="h3 mt-6">Student responsibility</h2>
      <p>Students remain fully responsible for understanding, adapting and submitting their own work. Before submitting, students should always check their institution’s rules on acceptable use of external academic support.</p>
    </>
  );
}
