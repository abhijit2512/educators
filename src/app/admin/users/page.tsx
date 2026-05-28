import { prisma } from "@/lib/prisma";
import { UsersTable } from "@/components/admin/users-table";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { profile: true, _count: { select: { enquiries: true } } },
    take: 500,
  });

  const rows = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    country: u.profile?.country ?? null,
    requests: u._count.enquiries,
    joined: u.createdAt.toLocaleDateString("en-GB"),
  }));

  return (
    <div className="space-y-4">
      <h1 className="h2">Users</h1>
      <p className="text-sm text-slate-600">
        Promote a student to admin, demote an admin, or remove an account. The
        last remaining admin is protected from demotion and deletion.
      </p>
      <UsersTable users={rows} />
    </div>
  );
}
