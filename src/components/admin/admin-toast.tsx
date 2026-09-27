"use client";

import { useEffect } from "react";
import { Check, TriangleAlert, X } from "lucide-react";

import { cn } from "@/lib/utils";

export type AdminToastTone = "success" | "error";
export type AdminToastState = { tone: AdminToastTone; text: string } | null;

export function AdminToast({
  toast,
  onDismiss,
}: {
  toast: AdminToastState;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(onDismiss, 4500);
    return () => window.clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const failed = toast.tone === "error";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 lg:inset-x-auto lg:right-6 lg:bottom-6 lg:px-0">
      <div
        role={failed ? "alert" : "status"}
        className="admin-rise pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-hope-midnight/15 bg-hope-white p-4 shadow-[0_1px_2px_rgb(var(--hope-midnight-rgb)/0.06),0_24px_48px_-24px_rgb(var(--hope-midnight-rgb)/0.28)]"
      >
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full",
            failed ? "bg-hope-midnight text-hope-white" : "bg-hope-ember text-hope-midnight",
          )}
        >
          {failed ? (
            <TriangleAlert className="size-4" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Check className="size-4" strokeWidth={1.75} aria-hidden="true" />
          )}
        </span>
        <p className="flex-1 pt-1 text-sm font-medium text-hope-midnight">
          {toast.text}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="-m-2 grid size-11 shrink-0 place-items-center rounded-lg text-hope-fog transition-colors hover:bg-hope-midnight/5 hover:text-hope-midnight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
        >
          <X className="size-4" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
