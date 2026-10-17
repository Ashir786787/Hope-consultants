import type { DraftAnswers } from "@/lib/forms/answers";
import type { FormDefinition, FormField, FormFieldCondition, FormSection } from "@/lib/forms/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CNIC_PATTERN = /^\d{5}-\d{7}-\d$/;
const CNIC_DIGITS_PATTERN = /^\d{13}$/;
const PASSPORT_PATTERN = /^[A-Za-z0-9]{7,9}$/;

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}

function isAcceptableIdNumber(value: string): boolean {
  if (CNIC_PATTERN.test(value) || CNIC_DIGITS_PATTERN.test(value)) return true;
  return PASSPORT_PATTERN.test(value) && /[A-Za-z]/.test(value);
}

function matchesCondition(
  condition: FormFieldCondition,
  values: Record<string, unknown>
): boolean {
  return condition.equals.includes(asText(values[condition.field]));
}

export function conditionContext(answers: DraftAnswers): Record<string, unknown> {
  const context: Record<string, unknown> = {};
  for (const section of Object.values(answers)) {
    for (const [key, value] of Object.entries(section)) {
      context[key] = value;
    }
  }
  return context;
}

export function isFieldVisible(field: FormField, values: Record<string, unknown>): boolean {
  if (field.archived) return false;
  if (!field.showWhen) return true;
  return matchesCondition(field.showWhen, values);
}

export function isFieldRequired(field: FormField, values: Record<string, unknown>): boolean {
  if (field.requiredWhen) return matchesCondition(field.requiredWhen, values);
  return field.required === true;
}

export function validateField(
  field: FormField,
  values: Record<string, unknown>
): string | null {
  if (field.archived || !isFieldVisible(field, values)) return null;
  const required = isFieldRequired(field, values);
  const raw = values[field.key];

  if (field.kind === "consent") {
    if (required && raw !== true) {
      return field.requiredMessage ?? "This confirmation is required.";
    }
    return null;
  }

  if (field.kind === "file") {
    const files = Array.isArray(raw) ? raw : [];
    if (required && files.length === 0) {
      return field.requiredMessage ?? `Please upload ${field.label}.`;
    }
    return null;
  }

  if (field.kind === "checkbox-group") {
    const list = asList(raw);
    if (required && list.length === 0) {
      return field.requiredMessage ?? "Please choose at least one option.";
    }
    if (field.options && list.some((entry) => !field.options?.includes(entry))) {
      return field.invalidMessage ?? "Please choose options from the list.";
    }
    return null;
  }

  const text = asText(raw).trim();
  if (text === "") {
    return required ? field.requiredMessage ?? `${field.label} is required.` : null;
  }

  if (field.kind === "email" && !EMAIL_PATTERN.test(text)) {
    return field.invalidMessage ?? "That email address does not look right.";
  }
  if (field.kind === "id-number" && !isAcceptableIdNumber(text)) {
    return field.invalidMessage ?? "Enter a valid ID number.";
  }
  if (field.kind === "tel" && field.minDigits && text.replace(/\D/g, "").length < field.minDigits) {
    return field.invalidMessage ?? "Enter a valid phone number.";
  }
  if (
    (field.kind === "select" || field.kind === "radio") &&
    field.options &&
    !field.options.includes(text)
  ) {
    return field.invalidMessage ?? "Please choose an option from the list.";
  }
  if (field.pattern && !new RegExp(field.pattern).test(text)) {
    return field.patternMessage ?? field.invalidMessage ?? "That value does not look right.";
  }
  if (field.maxLength && text.length > field.maxLength) {
    return `${field.label} is too long.`;
  }
  return null;
}

export function validateSection(
  section: FormSection,
  values: Record<string, unknown>
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of section.fields) {
    const message = validateField(field, values);
    if (message) errors[field.key] = message;
  }
  return errors;
}

export function validateForm(
  definition: FormDefinition,
  answers: DraftAnswers
): Record<string, string> {
  const errors: Record<string, string> = {};
  const context = conditionContext(answers);
  for (const section of definition.sections) {
    const sectionErrors = validateSection(section, context);
    for (const [key, message] of Object.entries(sectionErrors)) {
      errors[`${section.key}.${key}`] = message;
    }
  }
  return errors;
}
