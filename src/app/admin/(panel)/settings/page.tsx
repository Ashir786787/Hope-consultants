import type { Metadata } from "next";

import { AdminPasswordForm } from "@/components/admin/admin-password-form";
import { requireAdmin } from "@/lib/admin/require-admin";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();
  if (!admin) {
    return null;
  }

  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold text-hope-midnight">Settings</h1>
        <p className="text-hope-fog">Your own account. Nothing here changes anyone else.</p>
      </header>

      <section
        aria-labelledby="account-heading"
        className="flex max-w-2xl flex-col gap-4 rounded-2xl border border-hope-midnight/10 bg-hope-white p-6"
      >
        <h2 id="account-heading" className="text-lg font-bold text-hope-midnight">
          Your account
        </h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex flex-col gap-0.5">
            <dt className="text-hope-fog">Name</dt>
            <dd className="font-semibold text-hope-midnight">{admin.name}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-hope-fog">Email</dt>
            <dd className="font-semibold text-hope-midnight">{admin.email}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-hope-fog">Role</dt>
            <dd className="font-semibold text-hope-midnight">{admin.role}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-hope-fog">Owner</dt>
            <dd className="font-semibold text-hope-midnight">
              {admin.isOwner ? "Yes, this is the owner account" : "No"}
            </dd>
          </div>
        </dl>
      </section>

      <section
        aria-labelledby="password-heading"
        className="flex max-w-2xl flex-col gap-4 rounded-2xl border border-hope-midnight/10 bg-hope-white p-6"
      >
        <h2 id="password-heading" className="text-lg font-bold text-hope-midnight">
          Change your password
        </h2>
        <AdminPasswordForm email={admin.email} />
      </section>
    </>
  );
}
