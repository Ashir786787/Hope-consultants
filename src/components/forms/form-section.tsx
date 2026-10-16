"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  clearSessionSnapshot,
  useFormDraft,
  useFormSectionValues,
} from "@/components/forms/form-draft";
import { FormFieldView } from "@/components/forms/form-field";
import { focusFieldControl } from "@/components/onboarding/onboarding-field";
import { isFieldVisible, validateForm, validateSection } from "@/lib/forms/validate";
import type { FormDefinition, FormSection as FormSectionModel } from "@/lib/forms/types";

export function FormSection({
  definition,
  section,
  isLast,
  nextHref,
  completeHref,
  submitEndpoint,
  uploadEndpoint,
}: {
  definition: FormDefinition;
  section: FormSectionModel;
  isLast: boolean;
  nextHref: string;
  completeHref: string;
  submitEndpoint: string;
  uploadEndpoint: string;
}) {
  const router = useRouter();
  const { answers, flush } = useFormDraft();
  const { values, setValue, toggleValue } = useFormSectionValues(section.key);
  const [flagged, setFlagged] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const errorsFor = useCallback(
    () => validateSection(section, answers[section.key] ?? {}),
    [answers, section]
  );

  const errors: Record<string, string> = {};
  if (flagged.length > 0) {
    const fresh = errorsFor();
    for (const key of flagged) {
      if (fresh[key]) errors[key] = fresh[key];
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fresh = errorsFor();
    const keys = Object.keys(fresh);
    if (keys.length > 0) {
      setFlagged(keys);
      focusFieldControl(keys[0]);
      return;
    }
    setFlagged([]);

    if (!isLast) {
      void flush();
      router.push(nextHref);
      return;
    }

    const formErrors = validateForm(definition, answers);
    if (Object.keys(formErrors).length > 0) {
      setMessage(
        "Please complete every section of the form before submitting. Use the progress bar to move back to any section."
      );
      return;
    }

    setPending(true);
    setMessage(null);
    fetch(submitEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        if (!response.ok) {
          setMessage(payload?.error ?? "We could not submit the form. Please try again.");
          return;
        }
        clearSessionSnapshot(definition.key);
        router.push(completeHref);
      })
      .catch(() => {
        setMessage("We could not reach the server. Check your connection and try again.");
      })
      .finally(() => setPending(false));
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {section.fields.map((field) =>
        isFieldVisible(field, values) ? (
          <FormFieldView
            key={field.key}
            field={field}
            values={values}
            error={errors[field.key]}
            setValue={setValue}
            toggleValue={toggleValue}
            uploadEndpoint={uploadEndpoint}
          />
        ) : null
      )}
      {Object.keys(errors).length > 0 ? (
        <p
          role="alert"
          className="rounded-xl bg-hope-ember/10 px-4 py-3 text-sm font-semibold text-hope-midnight"
        >
          {isLast
            ? "Please fix the highlighted questions before submitting."
            : "Please fix the highlighted questions before continuing."}
        </p>
      ) : null}
      {message ? (
        <p
          role="alert"
          className="rounded-xl bg-hope-ember/10 px-4 py-3 text-sm font-semibold text-hope-midnight"
        >
          {message}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={isLast && pending}
          className={isLast ? "min-h-11" : "min-h-11 w-full sm:w-auto"}
        >
          {isLast ? (pending ? "Submitting…" : "Submit") : "Continue"}
        </Button>
      </div>
    </form>
  );
}
