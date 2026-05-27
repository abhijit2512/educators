import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return { ok: false as const, response: new Response("Unauthorized", { status: 401 }) };
  }
  return { ok: true as const, session };
}
