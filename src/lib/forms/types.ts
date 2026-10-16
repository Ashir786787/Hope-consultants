export type FormKey = "onboarding" | "documents";

export const FORM_SUBMISSION_STATUSES = ["New", "Contacted", "Converted", "Lost"] as const;

export type FormSubmissionStatus = (typeof FORM_SUBMISSION_STATUSES)[number];

export interface FormFileRef {
  id: string;
  name: string;
  size: number;
  type: string;
}

export type FormFieldKind =
  | "text"
  | "textarea"
  | "email"
  | "tel"
  | "date"
  | "select"
  | "radio"
  | "checkbox-group"
  | "id-number"
  | "file"
  | "consent";

export interface FormFieldCondition {
  field: string;
  equals: readonly string[];
}

export interface FormField {
  key: string;
  label: string;
  kind: FormFieldKind;
  required?: boolean;
  requiredWhen?: FormFieldCondition;
  showWhen?: FormFieldCondition;
  options?: readonly string[];
  hint?: string;
  placeholder?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  maxLength?: number;
  rows?: number;
  multiple?: boolean;
  minDigits?: number;
  pattern?: string;
  patternMessage?: string;
  requiredMessage?: string;
  invalidMessage?: string;
  archived?: boolean;
}

export interface FormSection {
  key: string;
  slug: string;
  order: number;
  title: string;
  description: string;
  fields: readonly FormField[];
}

export interface FormWelcome {
  heading: string;
  intro: string;
  body?: string;
  benefits?: readonly string[];
  accuracyNote?: string;
  privacyNote?: string;
  closing?: string;
}

export interface FormConfirmation {
  heading: string;
  intro: string;
  introLabel?: string;
  steps?: readonly string[];
  note?: string;
  closing?: string;
  signature?: string;
}

export interface FormDefinition {
  key: FormKey;
  slug: string;
  title: string;
  subtitle: string;
  storageKey: string;
  draftCookieName: string;
  draftCollection: string;
  welcome: FormWelcome;
  confirmation: FormConfirmation;
  sections: readonly FormSection[];
}
