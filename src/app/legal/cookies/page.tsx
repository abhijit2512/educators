export const metadata = { title: "Cookie Policy" };
export default function CookiesPage() {
  return (
    <>
      <h1 className="h2">Cookie Policy</h1>
      <p className="mt-3">We use only essential cookies to keep you signed in and to remember your preferences. We do not use third-party advertising cookies.</p>
      <h2 className="h3 mt-6">Essential cookies</h2>
      <p>Used for authentication (NextAuth session) and CSRF protection. Required for the site to function.</p>
      <h2 className="h3 mt-6">Analytics</h2>
      <p>If we enable analytics in the future (e.g. Plausible or self-hosted), this page will be updated and a banner will be shown.</p>
    </>
  );
}
