"use client";

import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";

export function OnboardingField({
  id,
  label,
  error,
  hint,
  required = true,
  field,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  field?: string;
  children: ReactNode;
}) {
  return (
    <div data-field={field} className="flex flex-col gap-2">
      <Label htmlFor={id} className="items-start leading-5">
        {label}
        <RequiredMark required={required} />
      </Label>
      {hint ? (
        <p id={`${id}-hint`} className="text-sm leading-6 text-hope-fog">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? <FieldError>{error}</FieldError> : null}
    </div>
  );
}

export function OnboardingChoiceField({
  label,
  error,
  hint,
  required = true,
  field,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  field?: string;
  children: ReactNode;
}) {
  return (
    <div role="group" aria-label={label} data-field={field} className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-hope-midnight">
        {label}
        <RequiredMark required={required} />
      </span>
      {hint ? <p className="text-sm leading-6 text-hope-fog">{hint}</p> : null}
      {children}
      {error ? <FieldError>{error}</FieldError> : null}
    </div>
  );
}

export function focusFieldControl(field: string): void {
  if (!field) return;
  const escaped = CSS.escape(field);
  const target =
    document.getElementById(field) ??
    document.querySelector<HTMLElement>(
      `[data-field="${escaped}"] button, [data-field="${escaped}"] [role="radio"], [data-field="${escaped}"] [role="checkbox"]`
    );
  if (!target) return;
  target.focus();
  target.scrollIntoView({ block: "center" });
}

export function FieldError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="text-sm leading-6 text-destructive">
      {children}
    </p>
  );
}

function RequiredMark({ required }: { required: boolean }) {
  if (!required) {
    return <span className="ml-1 text-sm font-normal text-hope-fog">(optional)</span>;
  }
  return (
    <span className="ml-1 text-hope-ember" aria-hidden="true">
      *
    </span>
  );
}