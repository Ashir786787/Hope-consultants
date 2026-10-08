import { ONBOARDING_SECTIONS, type OnboardingSectionKey } from "@/lib/onboarding/sections";

export type FieldValue = string | string[] | boolean | undefined;
export type SectionDraft = Record<string, FieldValue>;
export type DraftAnswers = Record<OnboardingSectionKey, SectionDraft>;

export function emptyDraftAnswers(): DraftAnswers {
  const base = {} as DraftAnswers;
  for (const section of ONBOARDING_SECTIONS) base[section.key] = {};
  return base;
}

export function toDraftAnswers(value: unknown): DraftAnswers {
  const base = emptyDraftAnswers();
  if (typeof value !== "object" || value === null || Array.isArray(value)) return base;
  const source = value as Record<string, unknown>;
  for (const section of ONBOARDING_SECTIONS) {
    const sectionValue = source[section.key];
    if (typeof sectionValue === "object" && sectionValue !== null && !Array.isArray(sectionValue)) {
      base[section.key] = { ...(sectionValue as SectionDraft) };
    }
  }
  return base;
}
