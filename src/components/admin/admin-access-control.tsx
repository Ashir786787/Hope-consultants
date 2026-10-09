"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  CONTENT_CATEGORY_LABELS,
  SECTION_LABELS,
  accessSummary,
  contentAccessSummary,
} from "@/lib/admin/permissions";
import { ADMIN_PANEL_SECTIONS } from "@/lib/admin/types";
import type { AdminPanelSection } from "@/lib/admin/types";
import { CONTENT_KEYS } from "@/lib/content/schemas";

import { AdminAlert, AdminButton } from "./admin-ui";

export function AdminAccessControl({
  adminId,
  permissions,
  contentCollections,
}: {
  adminId: string;
  permissions: AdminPanelSection[] | null;
  contentCollections: string[] | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<AdminPanelSection[] | null>(permissions);
  const [draftContent, setDraftContent] = useState<string[] | null>(contentCollections);
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
    setDraftContent(contentCollections);
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

  function toggleCategory(category: string) {
    const current = draftContent ?? [...CONTENT_KEYS];
    const next = current.includes(category)
      ? current.filter((value) => value !== category)
      : [...current, category];
    if (next.length === 0) {
      setError("Keep at least one content category.");
      return;
    }
    setDraftContent(next);
    setError(null);
  }

  async function save() {
    const sections = draft ?? [...ADMIN_PANEL_SECTIONS];
    if (
      sections.includes("content") &&
      draftContent !== null &&
      draftContent.length === 0
    ) {
      setError("Keep at least one content category.");
      return;
    }
    setError(null);
    setPending(true);
    try {
      const response = await fetch(`/api/admin/admins/${adminId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: draft, contentCollections: draftContent }),
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

  const contentGranted = draft === null || draft.includes("content");

  const panelId = `access-panel-${adminId}`;

  return (
    <div ref={wrapperRef} className="flex flex-col gap-3 border-t border-hope-midnight/10 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-hope-midnight">Access</p>
          <p className="text-sm text-hope-fog">
            {accessSummary(permissions)}
            {permissions === null || permissions.includes("content")
              ? ` · Content: ${contentAccessSummary(contentCollections)}`
              : ""}
          </p>
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
            disabled={pending || (draft === null && draftContent === null)}
            onClick={() => {
              setDraft(null);
              setDraftContent(null);
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

          {contentGranted ? (
            <fieldset className="flex flex-col gap-1 rounded-lg bg-hope-midnight/5 p-3">
              <legend className="mb-1 px-1 text-sm font-semibold text-hope-midnight">
                Content categories
              </legend>
              <p className="px-1 pb-1 text-sm text-hope-fog">
                Choose which parts of the content editor this admin may open.
              </p>
              {CONTENT_KEYS.map((key) => {
                const checked = draftContent === null || draftContent.includes(key);
                const id = `content-${adminId}-${key}`;
                return (
                  <label
                    key={key}
                    htmlFor={id}
                    className="flex min-h-11 cursor-pointer items-center gap-3 px-1 text-sm text-hope-midnight"
                  >
                    <input
                      id={id}
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategory(key)}
                      className="size-4 shrink-0 accent-hope-ember"
                    />
                    {CONTENT_CATEGORY_LABELS[key] ?? key}
                  </label>
                );
              })}
            </fieldset>
          ) : null}

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