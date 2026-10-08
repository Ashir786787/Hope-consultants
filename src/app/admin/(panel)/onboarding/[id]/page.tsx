import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { AdminOnboardingDetail } from "@/components/admin/admin-onboarding-detail";
import { buildAnswerGroups } from "@/lib/onboarding/labels";
import { requireSection } from "@/lib/admin/require-admin";
import { findSubmissionById } from "@/lib/onboarding/submission";

export const metadata: Metadata = {
  title: "Onboarding submission",
  robots: { index: false, follow: false },
};

function formatSubmittedAt(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(parsed);
}

export default async function AdminOnboardingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSection("onboarding");

  const { id } = await params;
  const submission = await findSubmissionById(id);
  if (!submission) {
    notFound();
  }

  const groups = buildAnswerGroups(submission);

  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold text-hope-midnight">
          {submission.personal.fullName}
        </h1>
        <p className="text-hope-fog">
          Submitted {formatSubmittedAt(submission.submittedAt)} · from {submission.sourcePage}
        </p>
      </header>

      <AdminOnboardingDetail
        id={submission.id}
        initialStatus={submission.status}
        initialNotes={submission.notes}
        groups={groups}
      />
    </>
  );
}