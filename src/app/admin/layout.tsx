import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/pricing", label: "Pricing" },
  { href: "/admin/samples", label: "Samples" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/settings", label: "Site settings" },
  { href: "/admin/legal", label: "Legal pages" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");
  return (
    <section className="section">
      <div className="container grid gap-8 lg:grid-cols-[220px,1fr]">
        <aside className="space-y-1">
          <div className="mb-4 text-xs uppercase tracking-wider text-slate-500">Admin</div>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-ink-900">
              {n.label}
            </Link>
          ))}
        </aside>
        <div>{children}</div>
      </div>
    </section>
  );
}
