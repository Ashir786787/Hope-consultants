"use client";

import Link from "next/link";

import { AdminBadge } from "@/components/admin/admin-ui";
import type { OnboardingStatus, OnboardingSummary } from "@/lib/onboarding/types";

const BADGE_TONE: Record<OnboardingStatus, "owner" | "active" | "inactive" | "pending"> = {
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

export function AdminOnboardingList({ submissions }: { submissions: OnboardingSummary[] }) {
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
                href={`/admin/onboarding/${submission.id}`}
                className="truncate font-semibold text-hope-midnight underline decoration-hope-ember decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
              >
                {submission.fullName}
              </Link>
              <a
                href={`mailto:${submission.email}`}
                className="truncate text-sm text-hope-midnight underline decoration-hope-ember decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
              >
                {submission.email}
              </a>
              <p className="truncate text-sm text-hope-fog">{submission.contactNumber}</p>
            </div>
            <AdminBadge tone={BADGE_TONE[submission.status]}>{submission.status}</AdminBadge>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
            <div className="flex flex-col">
              <dt className="text-hope-fog">Level</dt>
              <dd className="font-medium text-hope-midnight">{submission.desiredLevel}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-hope-fog">Scholarships</dt>
              <dd className="font-medium text-hope-midnight">
                {submission.lookingForScholarships}
              </dd>
            </div>
            <div className="col-span-2 flex flex-col">
              <dt className="text-hope-fog">Countries</dt>
              <dd className="font-medium text-hope-midnight">
                {submission.countryNames.length > 0 ? submission.countryNames.join(", ") : "—"}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hope-midnight/10 pt-3 text-xs text-hope-fog">
            <span>{formatDate(submission.submittedAt)}</span>
            <Link
              href={`/admin/onboarding/${submission.id}`}
              className="min-h-11 py-2.5 font-semibold text-hope-midnight underline decoration-hope-ember decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
            >
              View full form
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}