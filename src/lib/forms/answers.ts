import type { FormDefinition, FormFileRef } from "@/lib/forms/types";

export type FieldValue = string | string[] | boolean | FormFileRef[] | undefined;
export type SectionDraft = Record<string, FieldValue>;
export type DraftAnswers = Record<string, SectionDraft>;

export function emptyDraftAnswers(definition: FormDefinition): DraftAnswers {
  const base: DraftAnswers = {};
  for (const section of definition.sections) base[section.key] = {};
  return base;
}

export function toDraftAnswers(definition: FormDefinition, value: unknown): DraftAnswers {
  const base = emptyDraftAnswers(definition);
  if (typeof value !== "object" || value === null || Array.isArray(value)) return base;
  const source = value as Record<string, unknown>;
  for (const section of definition.sections) {
    const sectionValue = source[section.key];
    if (
      typeof sectionValue === "object" &&
      sectionValue !== null &&
      !Array.isArray(sectionValue)
    ) {
      base[section.key] = { ...(sectionValue as SectionDraft) };
    }
  }
  return base;
}
