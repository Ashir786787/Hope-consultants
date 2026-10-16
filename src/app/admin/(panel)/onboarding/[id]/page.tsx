import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { AdminOnboardingDetail } from "@/components/admin/admin-onboarding-detail";
import { getFormDefinition } from "@/lib/forms/store";
import { buildDefinitionGroups } from "@/lib/forms/summary";
import { requireSection } from "@/lib/admin/require-admin";
import { findSubmissionById } from "@/lib/onboarding/submission";
import type { OnboardingStatus } from "@/lib/onboarding/types";
import type { DraftAnswers } from "@/lib/forms/answers";

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

  const groups = buildDefinitionGroups(
    await getFormDefinition("onboarding"),
    submission as unknown as DraftAnswers
  );

  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold text-hope-midnight">
          {typeof submission.personal === "object" && submission.personal !== null
            ? String((submission.personal as Record<string, unknown>).fullName ?? "")
            : ""}
        </h1>
        <p className="text-sm font-semibold text-hope-midnight">
          Case number: {typeof submission.caseNumber === "string" ? submission.caseNumber : "—"}
        </p>
        <p className="text-hope-fog">
          Submitted {formatSubmittedAt(String(submission.submittedAt ?? ""))} · from{" "}
          {typeof submission.sourcePage === "string" ? submission.sourcePage : "—"}
        </p>
      </header>

      <AdminOnboardingDetail
        id={String(submission.id ?? "")}
        initialStatus={(submission.status as OnboardingStatus) ?? "New"}
        initialNotes={typeof submission.notes === "string" ? submission.notes : ""}
        groups={groups}
      />
    </>
  );
}