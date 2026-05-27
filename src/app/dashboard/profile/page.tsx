import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    include: { profile: true },
  });
  return (
    <div className="space-y-4">
      <h1 className="h2">Profile</h1>
      <ProfileForm
        initial={{
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.profile?.phone || "",
          country: user?.profile?.country || "",
          university: user?.profile?.university || "",
          level: user?.profile?.level || "",
        }}
      />
    </div>
  );
}
