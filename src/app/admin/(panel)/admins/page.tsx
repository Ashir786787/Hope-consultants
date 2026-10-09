import type { Metadata } from "next";

import { AdminCreateAdminForm } from "@/components/admin/admin-create-admin-form";
import { AdminUserRow, type AdminRow } from "@/components/admin/admin-user-row";
import { listAdmins } from "@/lib/admin/admin-user";
import { requireSection } from "@/lib/admin/require-admin";

export const metadata: Metadata = {
  title: "Admin users",
  robots: { index: false, follow: false },
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

function label(value: string | null, fallback: string): string {
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : dateFormat.format(parsed);
}

export default async function AdminUsersPage() {
  const current = await requireSection("admins");

  const admins = await listAdmins();
  const rows: AdminRow[] = admins.map((admin) => ({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    isOwner: admin.isOwner === true,
    isActive: admin.isActive === true,
    isAccessRequest: admin.isAccessRequest === true,
    hasCompletedFirstLogin: admin.hasCompletedFirstLogin === true,
    permissions: admin.permissions ?? null,
    contentCollections: admin.contentCollections ?? null,
    createdLabel: label(admin.createdAt, "Unknown"),
    lastLoginLabel: label(admin.lastLoginAt, "Never"),
    verifiedLabel: admin.firstLoginVerifiedAt
      ? label(admin.firstLoginVerifiedAt, "Unknown")
      : null,
  }));

  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold text-hope-midnight">Admin users</h1>
        <p className="text-hope-fog">
          Add people who can sign in to this panel, and control who still has access.
        </p>
      </header>

      <section
        aria-labelledby="add-admin-heading"
        className="flex flex-col gap-4 rounded-2xl border border-hope-midnight/10 bg-hope-white p-6"
      >
        <h2 id="add-admin-heading" className="text-lg font-bold text-hope-midnight">
          Add an admin
        </h2>
        <p className="text-sm text-hope-fog">
          Anyone can start signing in with any email address. They choose their own password, we
          email a one-time code to the owner, and the owner gives that code to them. Adding
          someone here in advance simply creates their account early and lets you remove it if
          they never finish.
        </p>
        <AdminCreateAdminForm />
      </section>

      <section aria-labelledby="admin-list-heading" className="flex flex-col gap-4">
        <h2
          id="admin-list-heading"
          className="text-xs font-semibold tracking-[0.18em] text-hope-fog uppercase"
        >
          People and pending requests
        </h2>
        <ul className="flex flex-col gap-4">
          {[...rows]
            .sort((a, b) => Number(b.isAccessRequest) - Number(a.isAccessRequest))
            .map((admin) => (
              <AdminUserRow
                key={admin.id}
                admin={admin}
                isSelf={admin.id === current.id}
                canManageRoles={current.isOwner === true}
              />
            ))}
        </ul>
      </section>
    </>
  );
}
