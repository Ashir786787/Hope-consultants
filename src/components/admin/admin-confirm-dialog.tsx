"use client";

import { useEffect, useRef } from "react";
import { TriangleAlert } from "lucide-react";

const FOCUSABLE =
  'button:not([disabled]):not([tabindex="-1"]), [href], input:not([type="hidden"]), textarea, select';

export function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  busy,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-hope-midnight/40 p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        tabIndex={-1}
        onClick={onCancel}
        className="absolute inset-0 cursor-default"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        aria-describedby="admin-confirm-description"
        className="admin-rise relative w-full max-w-md rounded-2xl border border-hope-midnight/15 bg-hope-white p-6 shadow-[0_1px_2px_rgb(var(--hope-midnight-rgb)/0.06),0_24px_48px_-24px_rgb(var(--hope-midnight-rgb)/0.28)]"
      >
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-hope-ember text-hope-midnight">
            <TriangleAlert className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h2
              id="admin-confirm-title"
              className="font-display text-lg font-semibold text-hope-midnight"
            >
              {title}
            </h2>
            <p
              id="admin-confirm-description"
              className="mt-1 text-sm leading-6 text-hope-fog"
            >
              {description}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-hope-midnight/30 px-4 text-sm font-semibold text-hope-midnight transition-colors hover:bg-hope-midnight/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-hope-midnight px-4 text-sm font-semibold text-hope-white transition-colors hover:bg-hope-midnight/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember disabled:opacity-50"
          >
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
