"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { SECTION_LABELS, accessSummary } from "@/lib/admin/permissions";
import { ADMIN_PANEL_SECTIONS } from "@/lib/admin/types";
import type { AdminPanelSection } from "@/lib/admin/types";

import { AdminAlert, AdminButton } from "./admin-ui";

export function AdminAccessControl({
  adminId,
  permissions,
}: {
  adminId: string;
  permissions: AdminPanelSection[] | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<AdminPanelSection[] | null>(permissions);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
        setError(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setError(null);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function openPanel() {
    setDraft(permissions);
    setError(null);
    setOpen(true);
  }

  function closePanel() {
    setOpen(false);
    setError(null);
    triggerRef.current?.focus();
  }

  function toggleSection(section: AdminPanelSection) {
    const current = draft ?? [...ADMIN_PANEL_SECTIONS];
    const next = current.includes(section)
      ? current.filter((value) => value !== section)
      : ADMIN_PANEL_SECTIONS.filter((value) => value === section || current.includes(value));
    if (next.length === 0) {
      setError("Keep at least one section.");
      return;
    }
    setDraft(next);
    setError(null);
  }

  async function save() {
    setError(null);
    setPending(true);
    try {
      const response = await fetch(`/api/admin/admins/${adminId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: draft }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(payload?.error ?? "That did not work.");
        return;
      }
      setOpen(false);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  const panelId = `access-panel-${adminId}`;

  return (
    <div ref={wrapperRef} className="flex flex-col gap-3 border-t border-hope-midnight/10 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-hope-midnight">Access</p>
          <p className="text-sm text-hope-fog">{accessSummary(permissions)}</p>
        </div>
        <AdminButton
          ref={triggerRef}
          type="button"
          variant="secondary"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          onClick={() => (open ? closePanel() : openPanel())}
        >
          {open ? "Close" : "Change access"}
        </AdminButton>
      </div>

      {open ? (
        <div id={panelId} className="flex flex-col gap-4 rounded-xl border border-hope-midnight/10 bg-hope-white p-4">
          <AdminButton
            type="button"
            variant="primary"
            disabled={pending || draft === null}
            onClick={() => {
              setDraft(null);
              setError(null);
            }}
          >
            Full access (default)
          </AdminButton>

          <fieldset className="flex flex-col gap-1">
            <legend className="mb-1 text-sm font-semibold text-hope-midnight">Sections</legend>
            {ADMIN_PANEL_SECTIONS.map((section) => {
              const checked = draft === null || draft.includes(section);
              const id = `access-${adminId}-${section}`;
              return (
                <label
                  key={section}
                  htmlFor={id}
                  className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-hope-midnight"
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSection(section)}
                    className="size-4 shrink-0 accent-hope-ember"
                  />
                  {SECTION_LABELS[section]}
                </label>
              );
            })}
          </fieldset>

          {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

          <div className="flex flex-wrap gap-2">
            <AdminButton type="button" variant="primary" disabled={pending} onClick={save}>
              {pending ? "Saving…" : "Save access"}
            </AdminButton>
            <AdminButton type="button" variant="secondary" disabled={pending} onClick={closePanel}>
              Cancel
            </AdminButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}
