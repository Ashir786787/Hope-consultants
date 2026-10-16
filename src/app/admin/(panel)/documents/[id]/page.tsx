import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { AdminDocumentDetail } from "@/components/admin/admin-document-detail";
import { getFormDefinition } from "@/lib/forms/store";
import { buildDefinitionGroups } from "@/lib/forms/summary";
import { requireSection } from "@/lib/admin/require-admin";
import { findDocumentSubmissionById } from "@/lib/forms/submissions";

export const metadata: Metadata = {
  title: "Document submission",
  robots: { index: false, follow: false },
};

function formatSubmittedAt(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(parsed);
}

export default async function AdminDocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSection("documents");

  const { id } = await params;
  const submission = await findDocumentSubmissionById(id);
  if (!submission) {
    notFound();
  }

  const definition = await getFormDefinition("documents");
  const groups = buildDefinitionGroups(definition, submission.answers);

  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold text-hope-midnight">
          {submission.fullName}
        </h1>
        <p className="text-sm font-semibold text-hope-midnight">
          Student ID: {submission.studentId || "—"}
        </p>
        <p className="text-hope-fog">
          Submitted {formatSubmittedAt(submission.submittedAt)} · from {submission.sourcePage}
        </p>
      </header>

      <AdminDocumentDetail
        id={submission.id}
        initialStatus={submission.status}
        initialNotes={submission.notes}
        groups={groups}
      />
    </>
  );
}
