"use client";

import Link from "next/link";

import { AdminBadge } from "@/components/admin/admin-ui";
import type { DocumentSummary } from "@/lib/forms/submissions";
import type { FormSubmissionStatus } from "@/lib/forms/types";

const BADGE_TONE: Record<FormSubmissionStatus, "owner" | "active" | "inactive" | "pending"> = {
  New: "owner",
  Contacted: "active",
  Converted: "pending",
  Lost: "inactive",
};

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(parsed);
}

export function AdminDocumentList({ submissions }: { submissions: DocumentSummary[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {submissions.map((submission) => (
        <li
          key={submission.id}
          className="flex flex-col gap-3 rounded-2xl border border-hope-midnight/10 bg-hope-white p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <Link
                href={`/admin/documents/${submission.id}`}
                className="truncate font-semibold text-hope-midnight underline decoration-hope-ember decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
              >
                {submission.fullName}
              </Link>
              <p className="truncate text-sm font-semibold text-hope-midnight">
                Student ID {submission.studentId || "—"}
              </p>
              <p className="truncate text-sm text-hope-fog">Applying for {submission.applyingFor || "—"}</p>
            </div>
            <AdminBadge tone={BADGE_TONE[submission.status]}>{submission.status}</AdminBadge>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hope-midnight/10 pt-3 text-xs text-hope-fog">
            <span>{formatDate(submission.submittedAt)}</span>
            <Link
              href={`/admin/documents/${submission.id}`}
              className="min-h-11 py-2.5 font-semibold text-hope-midnight underline decoration-hope-ember decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
            >
              View submission
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
