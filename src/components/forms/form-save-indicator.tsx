"use client";

import { useFormDraft } from "@/components/forms/form-draft";

const COPY = {
  idle: "Autosave is on.",
  saving: "Saving your answers…",
  saved: "All answers saved on this device.",
  error: "We could not save just now. Your answers stay on this page until they save.",
} as const;

export function FormSaveIndicator() {
  const { saveState } = useFormDraft();

  return (
    <p
      className={
        saveState === "error"
          ? "text-sm font-semibold leading-6 text-hope-midnight sm:text-right"
          : "text-sm leading-6 text-hope-fog sm:text-right"
      }
      aria-live="polite"
    >
      {COPY[saveState]}
    </p>
  );
}
