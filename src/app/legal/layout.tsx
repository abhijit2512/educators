export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="section">
      <div className="container max-w-3xl prose-academic">
        <article className="card">
          {children}
        </article>
      </div>
    </section>
  );
}
