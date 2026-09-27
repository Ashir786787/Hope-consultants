import { findAdminById } from "@/lib/admin/admin-user";
import { isSessionRevoked, readSession, refreshSession } from "@/lib/admin/session";
import type { AdminUser } from "@/lib/admin/types";

export async function requireAdmin(): Promise<AdminUser | null> {
  const session = await readSession();
  if (!session) return null;
  const admin = await findAdminById(session.adminUserId);
  if (!admin || !admin.isActive) return null;
  if (isSessionRevoked(admin.sessionsValidAfter, session.issuedAtMs)) return null;
  return admin;
}

export async function requireAdminForApi(): Promise<AdminUser | null> {
  const admin = await requireAdmin();
  if (!admin) return null;
  await refreshSession();
  return admin;
}
