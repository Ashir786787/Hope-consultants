import { AdminLeadStatusDonut, AdminLeadsAreaChart } from "@/components/admin/admin-charts";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { countAdmins } from "@/lib/admin/admin-user";
import { countLeads, countLeadsByStatus, leadsOverTime } from "@/lib/admin/lead";
import { hasSection } from "@/lib/admin/permissions";
import { requireSection } from "@/lib/admin/require-admin";
import { countSubmissions, countSubmissionsByStatus } from "@/lib/onboarding/submission";

export default async function AdminDashboardPage() {
  const admin = await requireSection("dashboard");

  const showLeads = hasSection(admin, "leads");
  const showOnboarding = hasSection(admin, "onboarding");
  const showAdmins = hasSection(admin, "admins");
  const showOverview = showLeads || showOnboarding || showAdmins;

  const [leads, admins, byStatus, days, submissions, onboardingByStatus] = await Promise.all([
    countLeads(),
    countAdmins(),
    countLeadsByStatus(),
    leadsOverTime(30),
    countSubmissions(),
    countSubmissionsByStatus(),
  ]);

  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold text-hope-midnight">Dashboard</h1>
        <p className="text-hope-fog">
          Enquiries from the website and the admin accounts that can sign in here.
        </p>
      </header>

      {showOverview ? (
        <section aria-labelledby="overview-heading" className="flex flex-col gap-4">
          <h2
            id="overview-heading"
            className="text-xs font-semibold tracking-[0.18em] text-hope-fog uppercase"
          >
            Overview
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {showLeads ? (
              <AdminStatCard
                label="Leads"
                value={leads}
                supporting="Enquiries sent through the website contact form."
                accent="midnight"
              />
            ) : null}
            {showLeads ? (
              <AdminStatCard
                label="New enquiries"
                value={byStatus.New}
                supporting="Waiting for a first reply from the team."
                accent="ember"
                href="/admin/leads"
              />
            ) : null}
            {showOnboarding ? (
              <AdminStatCard
                label="Onboarding forms"
                value={submissions}
                supporting="Student onboarding forms submitted through the website."
                badge={onboardingByStatus.New}
                accent="midnight"
                href="/admin/onboarding"
              />
            ) : null}
            {showAdmins ? (
              <AdminStatCard
                label="Admin users"
                value={admins}
                supporting="People who can sign in to this panel."
                accent="ember"
              />
            ) : null}
          </div>
        </section>
      ) : null}

      {showLeads ? (
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
      ) : null}
    </>
  );
}
