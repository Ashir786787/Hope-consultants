"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  clearSessionSnapshot,
  useSectionValues,
  useOnboardingDraft,
} from "@/components/onboarding/onboarding-draft";
import { focusFieldControl } from "@/components/onboarding/onboarding-field";
import {
  SECTION_SCHEMAS,
  collectSectionIssues,
  normaliseFullAnswers,
  normaliseSectionValues,
  onboardingSchema,
} from "@/lib/onboarding/schema";
import type { SectionKey } from "@/lib/onboarding/schema";

type FieldErrors = Record<string, string>;

function issuesToErrors(issues: readonly { path: PropertyKey[]; message: string }[]): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const field = String(issue.path[0] ?? "");
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

export function OnboardingSectionForm({
  section,
  nextHref,
  children,
}: {
  section: SectionKey;
  nextHref: string;
  children: (state: {
    errors: FieldErrors;
    text: (field: string) => string;
    list: (field: string) => string[];
    setValue: (field: string, value: string | boolean) => void;
    toggleValue: (field: string, option: string) => void;
  }) => React.ReactNode;
}) {
  const router = useRouter();
  const { answers, flush } = useOnboardingDraft();
  const values = useSectionValues(section);
  const [flagged, setFlagged] = useState<string[]>([]);

  const errorsFor = useCallback(
    (sectionValues: Record<string, unknown>): FieldErrors => {
      const normalised = normaliseSectionValues(section, sectionValues);
      const found: FieldErrors = {};
      const parsed = SECTION_SCHEMAS[section].safeParse(normalised);
      if (!parsed.success) {
        Object.assign(found, issuesToErrors(parsed.error.issues));
      }
      for (const issue of collectSectionIssues(section, normalised)) {
        if (!found[issue.field]) found[issue.field] = issue.message;
      }
      return found;
    },
    [section]
  );

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const fresh = errorsFor(answers[section]);
      const keys = Object.keys(fresh);
      if (keys.length > 0) {
        setFlagged(keys);
        focusFieldControl(keys[0]);
        return;
      }
      setFlagged([]);
      void flush();
      router.push(nextHref);
    },
    [answers, errorsFor, flush, nextHref, router, section]
  );

  const errors: FieldErrors = {};
  if (flagged.length > 0) {
    const fresh = errorsFor(answers[section]);
    for (const key of flagged) {
      if (fresh[key]) errors[key] = fresh[key];
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {children({ errors, ...values })}
      {Object.keys(errors).length > 0 ? (
        <p role="alert" className="rounded-xl bg-hope-ember/10 px-4 py-3 text-sm font-semibold text-hope-midnight">
          Please fix the highlighted questions before continuing.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="min-h-11 w-full sm:w-auto">
          Continue
        </Button>
      </div>
    </form>
  );
}

export function OnboardingSubmitForm({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { answers } = useOnboardingDraft();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = onboardingSchema.safeParse(normaliseFullAnswers(answers));
    if (!parsed.success) {
      setMessage(
        "Please complete every section of the form before submitting. Use the progress bar to move back to any section."
      );
      return;
    }

    setPending(true);
    setMessage(null);
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setMessage(payload?.error ?? "We could not submit the form. Please try again.");
        return;
      }
      clearSessionSnapshot();
      router.push("/onboarding/complete");
    } catch {
      setMessage("We could not reach the server. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {children}
      {message ? (
        <p role="alert" className="rounded-xl bg-hope-ember/10 px-4 py-3 text-sm font-semibold text-hope-midnight">
          {message}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending} className="min-h-11">
          {pending ? "Submitting…" : "Submit"}
        </Button>
      </div>
    </form>
  );
}