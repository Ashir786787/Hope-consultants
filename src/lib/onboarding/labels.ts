import { ONBOARDING_SECTIONS } from "@/lib/onboarding/sections";
import type { OnboardingSubmission } from "@/lib/onboarding/types";
import type { SectionKey } from "@/lib/onboarding/schema";

type SectionValues = Record<string, unknown>;

const LABELS: Record<SectionKey, { field: string; label: string }[]> = {
  personal: [
    { field: "fullName", label: "Full name" },
    { field: "parentName", label: "Parent or guardian name" },
    { field: "dateOfBirth", label: "Date of birth" },
    { field: "gender", label: "Gender" },
    { field: "nationality", label: "Nationality" },
    { field: "passportNumber", label: "Passport or CNIC number" },
    { field: "contactNumber", label: "WhatsApp number" },
    { field: "email", label: "Email address" },
    { field: "currentCity", label: "Current city" },
    { field: "domicile", label: "Domicile" },
  ],
  education: [
    { field: "highestQualification", label: "Highest qualification" },
    { field: "degreeTitle", label: "Degree title" },
    { field: "fieldOfStudy", label: "Field of study" },
    { field: "institutionName", label: "University or college" },
    { field: "yearOfPassing", label: "Year of passing" },
    { field: "grade", label: "CGPA or percentage" },
    { field: "englishTest", label: "English test" },
    { field: "englishTestOther", label: "English test specified" },
    { field: "englishTestScore", label: "English test score" },
  ],
  preferences: [
    { field: "desiredLevel", label: "Desired level of study" },
    { field: "preferredField", label: "Preferred field" },
    { field: "interestedCountries", label: "Interested countries" },
    { field: "studyBudget", label: "Study budget" },
    { field: "lookingForScholarships", label: "Looking for scholarships" },
  ],
  financial: [
    { field: "financialSponsor", label: "Financial sponsor" },
    { field: "sponsorOther", label: "Sponsor specified" },
    { field: "sponsorOccupation", label: "Occupation of sponsor" },
    { field: "householdIncome", label: "Monthly household income" },
    { field: "travelHistory", label: "International travel history" },
  ],
  documents: [
    { field: "passportStatus", label: "Passport" },
    { field: "hecIbccStatus", label: "HEC / IBCC" },
    { field: "mofaAttestationStatus", label: "MOFA attestation" },
    { field: "mofaApostilleStatus", label: "MOFA apostille" },
    { field: "policeClearanceStatus", label: "Police clearance" },
    { field: "bankStatementStatus", label: "Bank statement" },
  ],
  career: [
    { field: "motivation", label: "Why study abroad" },
    { field: "partTimeWork", label: "Willing to work part-time" },
    { field: "longTermPlan", label: "Long-term plan" },
  ],
  consent: [
    { field: "confirmAccuracy", label: "Confirmed answers are correct" },
    { field: "allowContact", label: "Allowed us to make contact" },
  ],
};

export interface OnboardingAnswerRow {
  label: string;
  value: string;
}

export interface OnboardingAnswerGroup {
  title: string;
  rows: OnboardingAnswerRow[];
}

function formatValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "—";
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? "—" : trimmed;
  }
  return "—";
}

export function buildAnswerGroups(submission: OnboardingSubmission): OnboardingAnswerGroup[] {
  const answers = submission as unknown as Record<string, SectionValues>;

  return ONBOARDING_SECTIONS.map((section) => ({
    title: section.title,
    rows: LABELS[section.key]
      .map(({ field, label }): OnboardingAnswerRow => ({
        label,
        value: formatValue(answers[section.key]?.[field]),
      }))
      .filter((row) => row.value !== "—"),
  })).filter((group) => group.rows.length > 0);
}
