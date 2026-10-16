"use client";

import { OnboardingChoiceField } from "@/components/onboarding/onboarding-field";
import {
  ConsentCheckbox,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/onboarding/onboarding-inputs";
import {
  OnboardingCheckboxGroup,
  OnboardingRadioField,
} from "@/components/onboarding/onboarding-choice-fields";
import { FormFileField } from "@/components/forms/form-file-field";
import type { FieldValue } from "@/lib/forms/answers";
import type { FormField, FormFileRef } from "@/lib/forms/types";

function isFormFileRef(entry: unknown): entry is FormFileRef {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "id" in entry &&
    "name" in entry &&
    "size" in entry
  );
}

export function FormFieldView({
  field,
  values,
  error,
  setValue,
  toggleValue,
  uploadEndpoint,
}: {
  field: FormField;
  values: Record<string, FieldValue>;
  error?: string;
  setValue: (field: string, value: FieldValue) => void;
  toggleValue: (field: string, option: string) => void;
  uploadEndpoint: string;
}) {
  const required = field.required === true || Boolean(field.requiredWhen);
  const raw = values[field.key];
  const textValue = typeof raw === "string" ? raw : "";
  const listValue = Array.isArray(raw) ? raw.filter((entry): entry is string => typeof entry === "string") : [];
  const fileValue = Array.isArray(raw) ? raw.filter(isFormFileRef) : [];

  switch (field.kind) {
    case "text":
    case "id-number":
      return (
        <TextField
          id={field.key}
          label={field.label}
          value={textValue}
          onChange={(next) => setValue(field.key, next)}
          error={error}
          hint={field.hint}
          required={required}
          inputMode={field.inputMode}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
        />
      );
    case "date":
      return (
        <TextField
          id={field.key}
          label={field.label}
          type="date"
          value={textValue}
          onChange={(next) => setValue(field.key, next)}
          error={error}
          hint={field.hint}
          required={required}
          maxLength={field.maxLength}
        />
      );
    case "email":
      return (
        <TextField
          id={field.key}
          label={field.label}
          type="email"
          inputMode="email"
          value={textValue}
          onChange={(next) => setValue(field.key, next)}
          error={error}
          hint={field.hint}
          required={required}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
        />
      );
    case "tel":
      return (
        <TextField
          id={field.key}
          label={field.label}
          type="tel"
          inputMode="tel"
          value={textValue}
          onChange={(next) => setValue(field.key, next)}
          error={error}
          hint={field.hint}
          required={required}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
        />
      );
    case "textarea":
      return (
        <TextAreaField
          id={field.key}
          label={field.label}
          value={textValue}
          onChange={(next) => setValue(field.key, next)}
          error={error}
          hint={field.hint}
          required={required}
          rows={field.rows}
          maxLength={field.maxLength}
        />
      );
    case "select":
      return (
        <SelectField
          id={field.key}
          label={field.label}
          options={field.options ?? []}
          value={textValue}
          onChange={(next) => setValue(field.key, next)}
          error={error}
          hint={field.hint}
          required={required}
          placeholder={field.placeholder}
        />
      );
    case "radio":
      return (
        <OnboardingChoiceField label={field.label} error={error} hint={field.hint} required={required} field={field.key}>
          <OnboardingRadioField
            name={field.key}
            options={field.options ?? []}
            value={textValue}
            onChange={(next) => setValue(field.key, next)}
            invalid={Boolean(error)}
          />
        </OnboardingChoiceField>
      );
    case "checkbox-group":
      return (
        <OnboardingChoiceField label={field.label} error={error} hint={field.hint} required={required} field={field.key}>
          <OnboardingCheckboxGroup
            name={field.key}
            options={field.options ?? []}
            values={listValue}
            onToggle={(option) => toggleValue(field.key, option)}
          />
        </OnboardingChoiceField>
      );
    case "file":
      return (
        <FormFileField
          id={field.key}
          label={field.label}
          hint={field.hint}
          required={required}
          error={error}
          value={fileValue}
          onChange={(files) => setValue(field.key, files)}
          uploadEndpoint={uploadEndpoint}
        />
      );
    case "consent":
      return (
        <ConsentCheckbox
          id={field.key}
          label={field.label}
          checked={raw === true}
          onChange={(checked) => setValue(field.key, checked)}
          error={error}
        />
      );
  }
}
