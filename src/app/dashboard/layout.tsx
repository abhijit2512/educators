import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/requests", label: "My requests" },
  { href: "/dashboard/requests/new", label: "New request" },
  { href: "/dashboard/invoices", label: "Invoices" },
  { href: "/dashboard/profile", label: "Profile" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");
  return (
    <section className="section">
      <div className="container grid gap-8 lg:grid-cols-[220px,1fr]">
        <aside className="space-y-1">
          <div className="mb-4 text-xs uppercase tracking-wider text-slate-500">Student</div>
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-ink-900"
            >
              {n.label}
            </Link>
          ))}
        </aside>
        <div>{children}</div>
      </div>
    </section>
  );
}
