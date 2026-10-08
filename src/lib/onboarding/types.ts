export const ONBOARDING_STATUSES = ["New", "Contacted", "Converted", "Lost"] as const;

export type OnboardingStatus = (typeof ONBOARDING_STATUSES)[number];

export interface OnboardingPersonal {
  fullName: string;
  parentName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  passportNumber: string;
  contactNumber: string;
  email: string;
  currentCity: string;
  domicile: string;
}

export interface OnboardingEducation {
  highestQualification: string;
  degreeTitle: string;
  fieldOfStudy: string;
  institutionName: string;
  yearOfPassing: string;
  grade: string;
  englishTest: string;
  englishTestOther: string;
  englishTestScore: string;
}

export interface OnboardingPreferences {
  desiredLevel: string;
  preferredField: string;
  interestedCountries: string[];
  studyBudget: string;
  lookingForScholarships: string;
}

export interface OnboardingFinancial {
  financialSponsor: string;
  sponsorOther: string;
  sponsorOccupation: string;
  householdIncome: string;
  travelHistory: string;
}

export type DocumentStatusAnswer = string;

export interface OnboardingDocuments {
  passportStatus: DocumentStatusAnswer;
  hecIbccStatus: DocumentStatusAnswer;
  mofaAttestationStatus: DocumentStatusAnswer;
  mofaApostilleStatus: DocumentStatusAnswer;
  policeClearanceStatus: DocumentStatusAnswer;
  bankStatementStatus: DocumentStatusAnswer;
}

export interface OnboardingCareer {
  motivation: string;
  partTimeWork: string;
  longTermPlan: string;
}

export interface OnboardingConsent {
  confirmAccuracy: boolean;
  allowContact: boolean;
}

export interface OnboardingAnswers {
  personal: OnboardingPersonal;
  education: OnboardingEducation;
  preferences: OnboardingPreferences;
  financial: OnboardingFinancial;
  documents: OnboardingDocuments;
  career: OnboardingCareer;
  consent: OnboardingConsent;
}

export interface OnboardingSubmission extends OnboardingAnswers {
  id: string;
  status: OnboardingStatus;
  notes: string;
  sourcePage: string;
  submittedAt: string;
}

export interface OnboardingSummary {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  countryNames: string[];
  desiredLevel: string;
  studyBudget: string;
  lookingForScholarships: string;
  status: OnboardingStatus;
  submittedAt: string;
}

export interface OnboardingDraft {
  token: string;
  currentSection: string;
  answers: Partial<OnboardingAnswers>;
  updatedAt: string;
}