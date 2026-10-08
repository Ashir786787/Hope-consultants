"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AdminAlert, AdminBadge, AdminButton } from "@/components/admin/admin-ui";
import type { OnboardingAnswerGroup } from "@/lib/onboarding/labels";
import type { OnboardingStatus } from "@/lib/onboarding/types";
import { ONBOARDING_STATUSES } from "@/lib/onboarding/types";

const BADGE_TONE: Record<OnboardingStatus, "owner" | "active" | "inactive" | "pending"> = {
  New: "owner",
  Contacted: "active",
  Converted: "pending",
  Lost: "inactive",
};

export function AdminOnboardingDetail({
  id,
  initialStatus,
  initialNotes,
  groups,
}: {
  id: string;
  initialStatus: OnboardingStatus;
  initialNotes: string;
  groups: OnboardingAnswerGroup[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<OnboardingStatus>(initialStatus);
  const [notes, setNotes] = useState(initialNotes);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    setError(null);
    setSaved(false);
    try {
      const response = await fetch(`/api/admin/onboarding/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(payload?.error ?? "Could not save this submission.");
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5 rounded-2xl border border-hope-midnight/10 bg-hope-white p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-bold text-hope-midnight">Status</h2>
          <AdminBadge tone={BADGE_TONE[status]}>{status}</AdminBadge>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`status-${id}`}
            className="text-sm font-semibold text-hope-midnight"
          >
            Update status
          </label>
          <select
            id={`status-${id}`}
            value={status}
            onChange={(event) => setStatus(event.target.value as OnboardingStatus)}
            className="min-h-11 rounded-lg border border-hope-midnight/20 bg-hope-white px-3 text-base text-hope-midnight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
          >
            {ONBOARDING_STATUSES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`notes-${id}`}
            className="text-sm font-semibold text-hope-midnight"
          >
            Internal note (only visible in this panel)
          </label>
          <textarea
            id={`notes-${id}`}
            value={notes}
            rows={4}
            maxLength={2000}
            onChange={(event) => setNotes(event.target.value)}
            className="rounded-lg border border-hope-midnight/20 bg-hope-white px-3 py-2 text-base text-hope-midnight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
          />
        </div>

        {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}
        {saved ? <AdminAlert tone="success">Saved.</AdminAlert> : null}

        <div>
          <AdminButton type="button" variant="primary" disabled={pending} onClick={save}>
            {pending ? "Saving…" : "Save changes"}
          </AdminButton>
        </div>
      </div>

      {groups.map((group) => (
        <section key={group.title} className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-hope-midnight">{group.title}</h2>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 rounded-2xl border border-hope-midnight/10 bg-hope-white p-6 sm:grid-cols-2">
            {group.rows.map((row) => (
              <div key={row.label} className="flex flex-col gap-0.5">
                <dt className="text-sm text-hope-fog">{row.label}</dt>
                <dd className="whitespace-pre-line text-base leading-7 text-hope-midnight">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}