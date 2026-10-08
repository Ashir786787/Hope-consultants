import type { Metadata } from "next";

import { AdminCopyLink } from "@/components/admin/admin-copy-link";
import { AdminOnboardingList } from "@/components/admin/admin-onboarding-list";
import { listSubmissions } from "@/lib/onboarding/submission";
import { requireSection } from "@/lib/admin/require-admin";

export const metadata: Metadata = {
  title: "Onboarding forms",
  robots: { index: false, follow: false },
};

const PUBLIC_FORM_URL = "https://www.hopeconsultants.pk/onboarding";

export default async function AdminOnboardingPage() {
  await requireSection("onboarding");

  const submissions = await listSubmissions();

  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold text-hope-midnight">Onboarding forms</h1>
        <p className="text-hope-fog">
          Every student who completed the eight-page onboarding form, newest first. Status and
          notes stay inside this panel.
        </p>
      </header>

      <section className="rounded-2xl border border-hope-midnight/10 bg-hope-white p-6">
        <AdminCopyLink url={PUBLIC_FORM_URL} />
      </section>

      {submissions.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-hope-midnight/20 px-6 py-16 text-center text-hope-fog">
          No completed forms yet. They appear here as soon as a student submits the form.
        </p>
      ) : (
        <AdminOnboardingList submissions={submissions} />
      )}
    </>
  );
}