import { z } from "zod";

import { countries } from "@/lib/data/countries";
import type { OnboardingSectionKey } from "@/lib/onboarding/sections";

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required.`).max(300, `${label} is too long.`);

const optionalText = (label: string) =>
  z.string().trim().max(300, `${label} is too long.`);

const CNIC_PATTERN = /^\d{5}-\d{7}-\d$/;
const CNIC_DIGITS_PATTERN = /^\d{13}$/;
const PASSPORT_PATTERN = /^[A-Za-z0-9]{7,9}$/;

const ID_NUMBER_ERROR =
  "Enter a CNIC like 12123-1212321-2, or a passport number like AK1234567.";

function isAcceptableIdNumber(value: string): boolean {
  if (CNIC_PATTERN.test(value) || CNIC_DIGITS_PATTERN.test(value)) return true;
  return PASSPORT_PATTERN.test(value) && /[A-Za-z]/.test(value);
}

export const GENDER_OPTIONS = ["Male", "Female"] as const;

export const QUALIFICATION_OPTIONS = [
  "Matric",
  "Intermediate",
  "Bachelors",
  "Masters",
] as const;

export const ENGLISH_TEST_OPTIONS = ["IELTS", "TOEFL", "PTE", "None", "Other"] as const;

export const STUDY_LEVEL_OPTIONS = ["Bachelor", "Masters", "PhD"] as const;

export const YES_NO_MAYBE_OPTIONS = ["Yes", "No", "Maybe"] as const;

export const SPONSOR_OPTIONS = ["Self", "Parents", "Guardian", "Other"] as const;

export const DOCUMENT_STATUS_OPTIONS = ["Yes", "No", "In Process"] as const;

export const LONG_TERM_PLAN_OPTIONS = [
  "Return back to your country",
  "Work Abroad",
  "Migrate to another country",
] as const;

export const COUNTRY_OPTIONS = countries.map((country) => country.name);

const COUNTRY_VALUES = new Set<string>(COUNTRY_OPTIONS);

export const personalSchema = z.object({
  fullName: requiredText("Full name"),
  parentName: requiredText("Parent name"),
  dateOfBirth: z.string().trim().min(1, "Date of birth is required."),
  gender: z.enum(GENDER_OPTIONS, { error: "Please choose a gender." }),
  nationality: requiredText("Nationality"),
  passportNumber: requiredText("Passport or CNIC number")
    .refine(isAcceptableIdNumber, { error: ID_NUMBER_ERROR }),
  contactNumber: requiredText("WhatsApp number").refine(
    (value) => value.replace(/\D/g, "").length >= 7,
    { error: "Enter a WhatsApp number with at least 7 digits." }
  ),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("That email address does not look right."),
  currentCity: requiredText("Current city"),
  domicile: requiredText("Domicile"),
});

export const educationSchema = z.object({
  highestQualification: z.enum(QUALIFICATION_OPTIONS, { error: "Please choose a qualification." }),
  degreeTitle: requiredText("Degree title"),
  fieldOfStudy: requiredText("Field of study"),
  institutionName: requiredText("University or college name"),
  yearOfPassing: requiredText("Year of passing").refine(
    (value) => /^(19|20)\d{2}$/.test(value),
    { error: "Enter a 4-digit year like 2024." }
  ),
  grade: requiredText("CGPA or percentage"),
  englishTest: z.enum(ENGLISH_TEST_OPTIONS, { error: "Please choose a language test." }),
  englishTestOther: optionalText("Language test"),
  englishTestScore: optionalText("Language test score"),
});

export const preferencesSchema = z.object({
  desiredLevel: z.enum(STUDY_LEVEL_OPTIONS, { error: "Please choose a study level." }),
  preferredField: requiredText("Field of study"),
  interestedCountries: z
    .array(z.string().trim())
    .min(1, "Please choose at least one country.")
    .refine((values) => values.every((value) => COUNTRY_VALUES.has(value)), {
      message: "Please choose countries from the list.",
    }),
  studyBudget: requiredText("Study budget"),
  lookingForScholarships: z.enum(YES_NO_MAYBE_OPTIONS, {
    error: "Please choose an answer.",
  }),
});

export const financialSchema = z.object({
  financialSponsor: z.enum(SPONSOR_OPTIONS, { error: "Please choose a financial sponsor." }),
  sponsorOther: optionalText("Financial sponsor"),
  sponsorOccupation: requiredText("Occupation of sponsor"),
  householdIncome: optionalText("Monthly household income"),
  travelHistory: requiredText("International travel history"),
});

export const documentsSchema = z.object({
  passportStatus: z.enum(DOCUMENT_STATUS_OPTIONS, { error: "Please choose an answer." }),
  hecIbccStatus: z.enum(DOCUMENT_STATUS_OPTIONS, { error: "Please choose an answer." }),
  mofaAttestationStatus: z.enum(DOCUMENT_STATUS_OPTIONS, { error: "Please choose an answer." }),
  mofaApostilleStatus: z.enum(DOCUMENT_STATUS_OPTIONS, { error: "Please choose an answer." }),
  policeClearanceStatus: z.enum(DOCUMENT_STATUS_OPTIONS, { error: "Please choose an answer." }),
  bankStatementStatus: z.enum(DOCUMENT_STATUS_OPTIONS, { error: "Please choose an answer." }),
});

export const careerSchema = z.object({
  motivation: z
    .string()
    .trim()
    .min(1, "Please tell us why you want to study abroad.")
    .max(4000, "That answer is too long."),
  partTimeWork: z.enum(YES_NO_MAYBE_OPTIONS, { error: "Please choose an answer." }),
  longTermPlan: z.enum(LONG_TERM_PLAN_OPTIONS, { error: "Please choose an answer." }),
});

export const consentSchema = z.object({
  confirmAccuracy: z.literal(true, { error: "Please confirm your answers are correct." }),
  allowContact: z.literal(true, { error: "Please allow us to contact you." }),
});

export const onboardingSchema = z
  .object({
    personal: personalSchema,
    education: educationSchema,
    preferences: preferencesSchema,
    financial: financialSchema,
    documents: documentsSchema,
    career: careerSchema,
    consent: consentSchema,
  })
  .superRefine((value, ctx) => {
    for (const sectionKey of Object.keys(SECTION_SCHEMAS) as SectionKey[]) {
      for (const issue of collectSectionIssues(sectionKey, value[sectionKey])) {
        ctx.addIssue({
          code: "custom",
          path: [sectionKey, issue.field],
          message: issue.message,
        });
      }
    }
  });

export interface SectionIssue {
  field: string;
  message: string;
}

export function collectSectionIssues(
  section: OnboardingSectionKey,
  values: unknown
): SectionIssue[] {
  const record =
    typeof values === "object" && values !== null ? (values as Record<string, unknown>) : {};
  const issues: SectionIssue[] = [];
  if (
    section === "education" &&
    String(record.englishTest ?? "") === "Other" &&
    String(record.englishTestOther ?? "").trim() === ""
  ) {
    issues.push({
      field: "englishTestOther",
      message: "Please specify which language test you have taken.",
    });
  }
  if (
    section === "financial" &&
    String(record.financialSponsor ?? "") === "Other" &&
    String(record.sponsorOther ?? "").trim() === ""
  ) {
    issues.push({ field: "sponsorOther", message: "Please specify who is funding your studies." });
  }
  return issues;
}

export type PersonalValues = z.infer<typeof personalSchema>;
export type EducationValues = z.infer<typeof educationSchema>;
export type PreferencesValues = z.infer<typeof preferencesSchema>;
export type FinancialValues = z.infer<typeof financialSchema>;
export type DocumentsValues = z.infer<typeof documentsSchema>;
export type CareerValues = z.infer<typeof careerSchema>;
export type ConsentValues = z.infer<typeof consentSchema>;
export type OnboardingValues = z.infer<typeof onboardingSchema>;

export const SECTION_SCHEMAS = {
  personal: personalSchema,
  education: educationSchema,
  preferences: preferencesSchema,
  financial: financialSchema,
  documents: documentsSchema,
  career: careerSchema,
  consent: consentSchema,
} as const;

export type SectionKey = keyof typeof SECTION_SCHEMAS;

function coerceValueFor(field: z.ZodType, value: unknown): unknown {
  if (field instanceof z.ZodArray) {
    return Array.isArray(value) ? value : [];
  }
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value;
  return field instanceof z.ZodBoolean ? false : "";
}

export function normaliseSectionValues(
  section: SectionKey,
  values: Record<string, unknown>
): Record<string, unknown> {
  const shape = SECTION_SCHEMAS[section].shape as Record<string, z.ZodType>;
  const output: Record<string, unknown> = {};
  for (const field of Object.keys(shape)) {
    output[field] = coerceValueFor(shape[field], values[field]);
  }
  return output;
}

export function normaliseFullAnswers(answers: Record<string, unknown>): Record<string, unknown> {
  const output: Record<string, unknown> = {};
  for (const section of Object.keys(SECTION_SCHEMAS) as SectionKey[]) {
    const values = answers[section];
    output[section] = normaliseSectionValues(
      section,
      typeof values === "object" && values !== null && !Array.isArray(values)
        ? (values as Record<string, unknown>)
        : {}
    );
  }
  return output;
}