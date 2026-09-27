import { AdminLeadStatusDonut, AdminLeadsAreaChart } from "@/components/admin/admin-charts";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { countAdmins } from "@/lib/admin/admin-user";
import { countLeads, countLeadsByStatus, leadsOverTime } from "@/lib/admin/lead";

export default async function AdminDashboardPage() {
  const [leads, admins, byStatus, days] = await Promise.all([
    countLeads(),
    countAdmins(),
    countLeadsByStatus(),
    leadsOverTime(30),
  ]);

  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold text-hope-midnight">Dashboard</h1>
        <p className="text-hope-fog">
          Enquiries from the website and the admin accounts that can sign in here.
        </p>
      </header>

      <section aria-labelledby="overview-heading" className="flex flex-col gap-4">
        <h2
          id="overview-heading"
          className="text-xs font-semibold tracking-[0.18em] text-hope-fog uppercase"
        >
          Overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AdminStatCard
            label="Leads"
            value={leads}
            supporting="Enquiries sent through the website contact form."
            accent="midnight"
          />
          <AdminStatCard
            label="New enquiries"
            value={byStatus.New}
            supporting="Waiting for a first reply from the team."
            accent="ember"
            href="/admin/leads"
          />
          <AdminStatCard
            label="Admin users"
            value={admins}
            supporting="People who can sign in to this panel."
            accent="midnight"
          />
        </div>
      </section>

      <section aria-labelledby="trends-heading" className="flex flex-col gap-4">
        <h2
          id="trends-heading"
          className="text-xs font-semibold tracking-[0.18em] text-hope-fog uppercase"
        >
          Enquiries
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AdminLeadsAreaChart data={days} />
          </div>
          <AdminLeadStatusDonut counts={byStatus} />
        </div>
      </section>
    </>
  );
}
