import type { Metadata } from "next";

import { AdminLeadsList } from "@/components/admin/admin-leads-list";
import { listLeads } from "@/lib/admin/lead";
import { requireSection } from "@/lib/admin/require-admin";

export const metadata: Metadata = {
  title: "Leads",
  robots: { index: false, follow: false },
};

export default async function AdminLeadsPage() {
  await requireSection("leads");

  const leads = await listLeads();

  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold text-hope-midnight">Leads</h1>
        <p className="text-hope-fog">
          Every enquiry the website contact form has sent, newest first. Status and notes stay
          inside this panel.
        </p>
      </header>

      {leads.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-hope-midnight/20 px-6 py-16 text-center text-hope-fog">
          No enquiries yet. They appear here as soon as someone uses the contact form.
        </p>
      ) : (
        <AdminLeadsList leads={leads} />
      )}
    </>
  );
}
