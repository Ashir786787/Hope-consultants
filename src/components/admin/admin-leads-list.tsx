"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AdminAlert, AdminBadge, AdminButton } from "./admin-ui";
import type { Lead, LeadStatus } from "@/lib/admin/types";
import { LEAD_STATUSES } from "@/lib/admin/types";

const BADGE_TONE: Record<LeadStatus, "owner" | "active" | "inactive" | "pending"> = {
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

export function AdminLeadsList({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [status, setStatus] = useState<LeadStatus>("New");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  function open(lead: Lead) {
    setOpenId(lead.id);
    setStatus(lead.status);
    setNotes(lead.notes);
    setError(null);
    setSaved(false);
  }

  function close() {
    setOpenId(null);
    setError(null);
    setSaved(false);
  }

  async function save() {
    if (!openId) return;
    setPending(true);
    setError(null);
    setSaved(false);
    try {
      const response = await fetch(`/api/admin/leads/${openId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(payload?.error ?? "Could not save this enquiry.");
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
    <ul className="flex flex-col gap-4">
      {leads.map((lead) => {
        const expanded = openId === lead.id;
        return (
          <li
            key={lead.id}
            className="flex flex-col gap-3 rounded-2xl border border-hope-midnight/10 bg-hope-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-1">
                <p className="truncate font-semibold text-hope-midnight">{lead.name}</p>
                <a
                  href={`mailto:${lead.email}`}
                  className="truncate text-sm text-hope-midnight underline decoration-hope-ember decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
                >
                  {lead.email}
                </a>
              </div>
              <AdminBadge tone={BADGE_TONE[lead.status]}>{lead.status}</AdminBadge>
            </div>

            <p className="text-sm font-semibold text-hope-midnight">{lead.subject}</p>
            <p className="text-sm whitespace-pre-line text-hope-midnight/80">{lead.message}</p>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hope-midnight/10 pt-3 text-xs text-hope-fog">
              <span>
                {formatDate(lead.submittedAt)} · from {lead.sourcePage}
              </span>
              <AdminButton
                type="button"
                variant="secondary"
                className="min-h-9 px-3"
                aria-expanded={expanded}
                onClick={() => (expanded ? close() : open(lead))}
              >
                {expanded ? "Close" : "Update status"}
              </AdminButton>
            </div>

            {lead.notes && !expanded ? (
              <p className="rounded-lg bg-hope-midnight/5 px-3 py-2 text-sm text-hope-midnight">
                <span className="font-semibold">Note:</span> {lead.notes}
              </p>
            ) : null}

            {expanded ? (
              <div className="flex flex-col gap-4 rounded-xl bg-hope-midnight/5 p-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor={`status-${lead.id}`}
                    className="text-sm font-semibold text-hope-midnight"
                  >
                    Status
                  </label>
                  <select
                    id={`status-${lead.id}`}
                    value={status}
                    onChange={(event) => setStatus(event.target.value as LeadStatus)}
                    className="min-h-11 rounded-lg border border-hope-midnight/20 bg-hope-white px-3 text-base text-hope-midnight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
                  >
                    {LEAD_STATUSES.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor={`notes-${lead.id}`}
                    className="text-sm font-semibold text-hope-midnight"
                  >
                    Internal note (only visible in this panel)
                  </label>
                  <textarea
                    id={`notes-${lead.id}`}
                    value={notes}
                    rows={4}
                    maxLength={2000}
                    onChange={(event) => setNotes(event.target.value)}
                    className="rounded-lg border border-hope-midnight/20 bg-hope-white px-3 py-2 text-base text-hope-midnight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
                  />
                </div>

                {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}
                {saved ? <AdminAlert tone="success">Saved.</AdminAlert> : null}

                <div className="flex flex-wrap gap-2">
                  <AdminButton type="button" variant="primary" disabled={pending} onClick={save}>
                    {pending ? "Saving…" : "Save changes"}
                  </AdminButton>
                  <AdminButton type="button" variant="secondary" disabled={pending} onClick={close}>
                    Cancel
                  </AdminButton>
                </div>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
