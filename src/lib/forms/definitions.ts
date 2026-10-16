import { countries } from "@/lib/data/countries";
import type { FormDefinition, FormKey, FormSection } from "@/lib/forms/types";

export const FORM_KEYS: readonly FormKey[] = ["onboarding", "documents"];

export function isFormKey(value: string): value is FormKey {
  return (FORM_KEYS as readonly string[]).includes(value);
}

const GENDER_OPTIONS = ["Male", "Female"] as const;

const QUALIFICATION_OPTIONS = [
  "Intermediate / Diploma",
  "Bachelors",
  "Masters",
] as const;

const ENGLISH_TEST_OPTIONS = ["IELTS", "TOEFL", "PTE", "None", "Other"] as const;

const STUDY_LEVEL_OPTIONS = ["Bachelor", "Masters", "PhD"] as const;

const YES_NO_MAYBE_OPTIONS = ["Yes", "No", "Maybe"] as const;

const SPONSOR_OPTIONS = ["Self", "Parents", "Guardian", "Other"] as const;

const DOCUMENT_STATUS_OPTIONS = ["Yes", "No", "In Process"] as const;

const LONG_TERM_PLAN_OPTIONS = [
  "Return back to your country",
  "Work Abroad",
  "Migrate to another country",
] as const;

const CONTACT_SOURCE_OPTIONS = [
  "Facebook",
  "Instagram",
  "Tiktok",
  "Youtube",
  "Whatsapp",
  "Referral & Friends",
] as const;

const COUNTRY_OPTIONS = countries.map((country) => country.name);

const APPLYING_FOR_OPTIONS = ["Bachelors", "Masters", "Phd"] as const;

const POSTGRADUATE_LEVELS = ["Masters", "Phd"] as const;
const DOCTORAL_LEVELS = ["Phd"] as const;

const ONBOARDING_SECTIONS: readonly FormSection[] = [
  {
    key: "personal",
    slug: "personal-information",
    order: 2,
    title: "Personal Information",
    description:
      "This section helps us record your basic details so we can identify and contact you properly. Please make sure your name and contact information match your official documents.",
    fields: [
      {
        key: "fullName",
        label: "Full name (as per your documents)",
        kind: "text",
        required: true,
        requiredMessage: "Full name is required.",
      },
      {
        key: "parentName",
        label: "Parent or guardian name",
        kind: "text",
        required: true,
        requiredMessage: "Parent name is required.",
      },
      {
        key: "dateOfBirth",
        label: "Date of birth",
        kind: "date",
        required: true,
        requiredMessage: "Date of birth is required.",
      },
      {
        key: "gender",
        label: "Gender",
        kind: "radio",
        required: true,
        options: GENDER_OPTIONS,
        requiredMessage: "Please choose a gender.",
      },
      {
        key: "nationality",
        label: "Nationality",
        kind: "text",
        required: true,
        requiredMessage: "Nationality is required.",
      },
      {
        key: "passportNumber",
        label: "Passport or CNIC number",
        kind: "id-number",
        required: true,
        hint: "CNIC like 12123-1212321-2, or a passport number like AK1234567.",
        requiredMessage: "Passport or CNIC number is required.",
        invalidMessage:
          "Enter a CNIC like 12123-1212321-2, or a passport number like AK1234567.",
      },
      {
        key: "contactNumber",
        label: "WhatsApp number",
        kind: "tel",
        required: true,
        placeholder: "+92 3XX XXXXXXX",
        minDigits: 7,
        requiredMessage: "WhatsApp number is required.",
        invalidMessage: "Enter a WhatsApp number with at least 7 digits.",
      },
      {
        key: "email",
        label: "Email address",
        kind: "email",
        required: true,
        requiredMessage: "Email address is required.",
        invalidMessage: "That email address does not look right.",
      },
      {
        key: "currentCity",
        label: "Current city",
        kind: "text",
        required: true,
        requiredMessage: "Current city is required.",
      },
      {
        key: "domicile",
        label: "Domicile",
        kind: "text",
        required: true,
        hint: "The district recorded on your CNIC.",
        requiredMessage: "Domicile is required.",
      },
    ],
  },
  {
    key: "education",
    slug: "education-background",
    order: 3,
    title: "Education Background",
    description:
      "We need to know your academic qualifications, grades, and language proficiency. This information helps us assess your eligibility for Italian universities.",
    fields: [
      {
        key: "highestQualification",
        label: "Highest qualification",
        kind: "select",
        required: true,
        options: QUALIFICATION_OPTIONS,
        requiredMessage: "Please choose a qualification.",
      },
      {
        key: "degreeTitle",
        label: "Degree title",
        kind: "text",
        required: true,
        requiredMessage: "Degree title is required.",
      },
      {
        key: "fieldOfStudy",
        label: "Field of study",
        kind: "text",
        required: true,
        requiredMessage: "Field of study is required.",
      },
      {
        key: "institutionName",
        label: "University or college name",
        kind: "text",
        required: true,
        requiredMessage: "University or college name is required.",
      },
      {
        key: "yearOfPassing",
        label: "Year of passing",
        kind: "text",
        required: true,
        placeholder: "2024",
        inputMode: "numeric",
        pattern: "^(19|20)\\d{2}$",
        patternMessage: "Enter a 4-digit year like 2024.",
        requiredMessage: "Year of passing is required.",
      },
      {
        key: "grade",
        label: "CGPA or percentage",
        kind: "text",
        required: true,
        hint: "For example 3.4/4.0 or 82%.",
        requiredMessage: "CGPA or percentage is required.",
      },
      {
        key: "englishTest",
        label: "English proficiency test",
        kind: "radio",
        required: true,
        options: ENGLISH_TEST_OPTIONS,
        requiredMessage: "Please choose a language test.",
      },
      {
        key: "englishTestOther",
        label: "Please specify the test",
        kind: "text",
        requiredWhen: { field: "englishTest", equals: ["Other"] },
        showWhen: { field: "englishTest", equals: ["Other"] },
        requiredMessage: "Please specify which language test you have taken.",
      },
      {
        key: "englishTestScore",
        label: "Test score",
        kind: "text",
        hint: "For example IELTS 6.5, TOEFL 90, or PTE 62.",
        requiredWhen: { field: "englishTest", equals: ["IELTS", "TOEFL", "PTE"] },
        showWhen: { field: "englishTest", equals: ["IELTS", "TOEFL", "PTE", "Other"] },
        requiredMessage: "Enter your test score.",
      },
    ],
  },
  {
    key: "preferences",
    slug: "study-abroad-preferences",
    order: 4,
    title: "Study Abroad Preferences",
    description:
      "Tell us about your study plans, interests, and preferred universities. This will help HOPE CONSULTANTS suggest the best programs and opportunities that match your goals.",
    fields: [
      {
        key: "desiredLevel",
        label: "Desired level of study",
        kind: "select",
        required: true,
        options: STUDY_LEVEL_OPTIONS,
        requiredMessage: "Please choose a study level.",
      },
      {
        key: "preferredField",
        label: "Preferred field of study",
        kind: "text",
        required: true,
        requiredMessage: "Field of study is required.",
      },
      {
        key: "interestedCountries",
        label: "Interested countries",
        kind: "checkbox-group",
        required: true,
        options: COUNTRY_OPTIONS,
        hint: "Choose every country you are open to.",
        requiredMessage: "Please choose at least one country.",
        invalidMessage: "Please choose countries from the list.",
      },
      {
        key: "studyBudget",
        label: "Study budget",
        kind: "textarea",
        required: true,
        hint: "An approximate yearly amount in PKR or EUR is fine.",
        rows: 3,
        maxLength: 300,
        requiredMessage: "Study budget is required.",
      },
      {
        key: "lookingForScholarships",
        label: "Are you looking for scholarships?",
        kind: "select",
        required: true,
        options: YES_NO_MAYBE_OPTIONS,
        requiredMessage: "Please choose an answer.",
      },
    ],
  },
  {
    key: "financial",
    slug: "financial-and-family-info",
    order: 5,
    title: "Financial & Family Info",
    description:
      "Studying abroad requires financial planning. This section helps us understand your budget and sponsorship situation so we can guide you toward suitable options and scholarships.",
    fields: [
      {
        key: "financialSponsor",
        label: "Who is funding your studies?",
        kind: "select",
        required: true,
        options: SPONSOR_OPTIONS,
        requiredMessage: "Please choose a financial sponsor.",
      },
      {
        key: "sponsorOther",
        label: "Please specify the sponsor",
        kind: "text",
        requiredWhen: { field: "financialSponsor", equals: ["Other"] },
        showWhen: { field: "financialSponsor", equals: ["Other"] },
        requiredMessage: "Please specify who is funding your studies.",
      },
      {
        key: "sponsorOccupation",
        label: "Occupation of sponsor",
        kind: "text",
        required: true,
        requiredMessage: "Occupation of sponsor is required.",
      },
      {
        key: "householdIncome",
        label: "Monthly household income",
        kind: "text",
        hint: "An estimate is fine.",
      },
      {
        key: "travelHistory",
        label: "International travel history",
        kind: "textarea",
        required: true,
        hint: "List countries you have visited and the year of each trip.",
        rows: 4,
        maxLength: 300,
        requiredMessage: "International travel history is required.",
      },
    ],
  },
  {
    key: "documents",
    slug: "documentation-status",
    order: 6,
    title: "Documentation Status",
    description:
      "Admissions and visas require certain documents. Please share the current status of your documents so we can guide you on what’s missing and how to prepare them in time.",
    fields: [
      {
        key: "passportStatus",
        label: "Passport",
        kind: "radio",
        required: true,
        options: DOCUMENT_STATUS_OPTIONS,
        hint: "Choose Yes if you already have it, No if you do not, or In Process.",
        requiredMessage: "Please choose an answer.",
      },
      {
        key: "hecIbccStatus",
        label: "HEC / IBCC equivalence certificate",
        kind: "radio",
        required: true,
        options: DOCUMENT_STATUS_OPTIONS,
        hint: "Choose Yes if you already have it, No if you do not, or In Process.",
        requiredMessage: "Please choose an answer.",
      },
      {
        key: "mofaAttestationStatus",
        label: "MOFA attestation",
        kind: "radio",
        required: true,
        options: DOCUMENT_STATUS_OPTIONS,
        hint: "Choose Yes if you already have it, No if you do not, or In Process.",
        requiredMessage: "Please choose an answer.",
      },
      {
        key: "mofaApostilleStatus",
        label: "MOFA apostille",
        kind: "radio",
        required: true,
        options: DOCUMENT_STATUS_OPTIONS,
        hint: "Choose Yes if you already have it, No if you do not, or In Process.",
        requiredMessage: "Please choose an answer.",
      },
      {
        key: "policeClearanceStatus",
        label: "Police clearance certificate",
        kind: "radio",
        required: true,
        options: DOCUMENT_STATUS_OPTIONS,
        hint: "Choose Yes if you already have it, No if you do not, or In Process.",
        requiredMessage: "Please choose an answer.",
      },
      {
        key: "bankStatementStatus",
        label: "Bank statement",
        kind: "radio",
        required: true,
        options: DOCUMENT_STATUS_OPTIONS,
        hint: "Choose Yes if you already have it, No if you do not, or In Process.",
        requiredMessage: "Please choose an answer.",
      },
    ],
  },
  {
    key: "career",
    slug: "career-and-future-plans",
    order: 7,
    title: "Career & Future Plans",
    description:
      "Your future goals matter. By knowing your career plans, we can recommend programs that match your long-term vision and guide you better on job and migration opportunities.",
    fields: [
      {
        key: "motivation",
        label: "Why do you want to study abroad?",
        kind: "textarea",
        required: true,
        rows: 6,
        requiredMessage: "Please tell us why you want to study abroad.",
      },
      {
        key: "partTimeWork",
        label: "Are you willing to work part-time while studying?",
        kind: "radio",
        required: true,
        options: YES_NO_MAYBE_OPTIONS,
        requiredMessage: "Please choose an answer.",
      },
      {
        key: "longTermPlan",
        label: "Long-term plan after graduation",
        kind: "select",
        required: true,
        options: LONG_TERM_PLAN_OPTIONS,
        requiredMessage: "Please choose an answer.",
      },
      {
        key: "contactSource",
        label: "How did you contacted us",
        kind: "select",
        required: true,
        options: CONTACT_SOURCE_OPTIONS,
        requiredMessage: "Please choose how you contacted us.",
      },
      {
        key: "contactUsername",
        label: "Provide us your username from which you have contacted us",
        kind: "text",
        required: true,
        requiredMessage: "Username is required.",
      },
    ],
  },
  {
    key: "consent",
    slug: "consent",
    order: 8,
    title: "Consent",
    description:
      "By submitting this form, you confirm the information provided is correct and there will be no refund policy. HOPE CONSULTANTS will use this data only for guiding you in your admission and visa process.",
    fields: [
      {
        key: "confirmAccuracy",
        label:
          "I confirm that the information I have provided is true and correct to the best of my knowledge.",
        kind: "consent",
        required: true,
        requiredMessage: "Please confirm your answers are correct.",
      },
      {
        key: "allowContact",
        label:
          "I allow HOPE CONSULTANTS to contact me on WhatsApp, by email or by phone about my application.",
        kind: "consent",
        required: true,
        requiredMessage: "Please allow us to contact you.",
      },
    ],
  },
];

const DOCUMENT_SECTIONS: readonly FormSection[] = [
  {
    key: "application-details",
    slug: "application-details",
    order: 2,
    title: "Application Details",
    description:
      "Tell us who you are and which level you are applying for so we can file your documents against the right application.",
    fields: [
      {
        key: "fullName",
        label: "Full Name (as per passport)",
        kind: "text",
        required: true,
        requiredMessage: "Full name is required.",
      },
      {
        key: "studentId",
        label: "Student ID",
        kind: "text",
        required: true,
        hint: "Given to you on your Invoice",
        requiredMessage: "Student ID is required.",
      },
      {
        key: "applyingFor",
        label: "Applying for",
        kind: "select",
        required: true,
        options: APPLYING_FOR_OPTIONS,
        requiredMessage: "Please choose the level you are applying for.",
      },
    ],
  },
  {
    key: "required-documents",
    slug: "required-documents",
    order: 3,
    title: "Required Documents",
    description:
      "Upload each document you have as a clear PDF or image. Fields marked with * are required for your selected level.",
    fields: [
      {
        key: "passportBio",
        label: "Passport (Bio Data Page)",
        kind: "file",
        required: true,
        multiple: true,
        requiredMessage: "Please upload your passport bio data page.",
      },
      {
        key: "cnic",
        label: "CNIC / B-Form",
        kind: "file",
        required: true,
        multiple: true,
        requiredMessage: "Please upload your CNIC or B-Form.",
      },
      {
        key: "photograph",
        label: "Passport-Size Photograph",
        kind: "file",
        required: true,
        multiple: true,
        requiredMessage: "Please upload a passport-size photograph.",
      },
      {
        key: "cv",
        label: "Updated CV / Resume",
        kind: "file",
        required: true,
        multiple: true,
        requiredMessage: "Please upload your updated CV.",
      },
      {
        key: "matricCertificate",
        label: "Matric / SSC Certificate (Attested)",
        kind: "file",
        required: true,
        multiple: true,
        requiredMessage: "Please upload your Matric / SSC certificate.",
      },
      {
        key: "matricMarksheet",
        label: "Matric / SSC Marksheet (Attested)",
        kind: "file",
        required: true,
        multiple: true,
        requiredMessage: "Please upload your Matric / SSC marksheet.",
      },
      {
        key: "intermediateCertificate",
        label: "Intermediate / HSSC Certificate (Attested)",
        kind: "file",
        required: true,
        multiple: true,
        requiredMessage: "Please upload your Intermediate / HSSC certificate.",
      },
      {
        key: "intermediateMarksheet",
        label: "Intermediate / HSSC Marksheet (Attested)",
        kind: "file",
        required: true,
        multiple: true,
        requiredMessage: "Please upload your Intermediate / HSSC marksheet.",
      },
      {
        key: "bachelorsDegree",
        label: "Bachelor's Degree / Provisional Certificate (Attested)",
        kind: "file",
        required: true,
        multiple: true,
        showWhen: { field: "applyingFor", equals: POSTGRADUATE_LEVELS },
        requiredMessage: "Please upload your Bachelor's degree.",
      },
      {
        key: "bachelorsTranscript",
        label: "Bachelor's Complete Transcript (Attested)",
        kind: "file",
        required: true,
        multiple: true,
        showWhen: { field: "applyingFor", equals: POSTGRADUATE_LEVELS },
        requiredMessage: "Please upload your Bachelor's transcript.",
      },
      {
        key: "mastersDegree",
        label: "Master's Degree / Provisional Certificate (Attested)",
        kind: "file",
        required: true,
        multiple: true,
        showWhen: { field: "applyingFor", equals: DOCTORAL_LEVELS },
        requiredMessage: "Please upload your Master's degree.",
      },
      {
        key: "mastersTranscript",
        label: "Master's Complete Transcript (Attested)",
        kind: "file",
        required: true,
        multiple: true,
        showWhen: { field: "applyingFor", equals: DOCTORAL_LEVELS },
        requiredMessage: "Please upload your Master's transcript.",
      },
      {
        key: "expectedGraduation",
        label: "Expected Graduation Certificate",
        kind: "file",
        multiple: true,
      },
      {
        key: "englishCertificate",
        label:
          "English Language Certificate (MOI/IELTS / TOEFL / PTE / Duolingo Result)",
        kind: "file",
        required: true,
        multiple: true,
        requiredMessage: "Please upload your English language certificate.",
      },
      {
        key: "otherLanguage",
        label: "Other Language Proficiency Certificate",
        kind: "file",
        multiple: true,
      },
      {
        key: "lors",
        label: "Letters of Recommendation (LORs)",
        kind: "file",
        required: true,
        multiple: true,
        requiredMessage: "Please upload your letters of recommendation.",
      },
      {
        key: "workExperience",
        label: "Work Experience Certificates",
        kind: "file",
        multiple: true,
      },
      {
        key: "internship",
        label: "Internship Certificates",
        kind: "file",
        multiple: true,
      },
      {
        key: "portfolio",
        label: "Portfolio (Design / Architecture / Arts)",
        kind: "file",
        multiple: true,
      },
      {
        key: "researchProposal",
        label: "Research Proposal (Research Master's / PhD)",
        kind: "file",
        multiple: true,
        showWhen: { field: "applyingFor", equals: POSTGRADUATE_LEVELS },
      },
      {
        key: "testResults",
        label: "GRE / GMAT / SAT / Other Test Results",
        kind: "file",
        multiple: true,
      },
      {
        key: "achievements",
        label: "Additional Achievement Certificates",
        kind: "file",
        multiple: true,
      },
      {
        key: "courseDescriptions",
        label: "Course Descriptions / Syllabus",
        kind: "file",
        multiple: true,
      },
      {
        key: "otherDocuments",
        label: "Other Relevant Documents",
        kind: "file",
        multiple: true,
      },
    ],
  },
];

const CONFIRMATION = {
  heading: "Your details have been successfully submitted",
  intro:
    "Our team at HOPE CONSULTANTS will carefully review your information and contact you shortly via your preferred method (WhatsApp, email, or phone).",
  introLabel: "Here’s what happens next:",
  steps: [
    "Profile Review: We’ll check your eligibility based on your education, budget, and documents.",
    "University Matching: Our consultants will shortlist universities and programs that suit you.",
    "Guidance Session: You will be contacted for a consultation call to discuss your case.",
  ],
  note:
    "To speed up the process, please keep your documents (passport, transcripts, IELTS if available) ready.",
  closing: "We look forward to helping you achieve your dream of studying abroad!",
  signature: "Team HOPE CONSULTANTS",
} as const;

export const formDefinitions = {
  onboarding: {
    key: "onboarding",
    slug: "onboarding",
    title: "Student onboarding form",
    subtitle: "Student onboarding form",
    storageKey: "onboardingSubmissions",
    draftCookieName: "hope_onboarding_draft",
    draftCollection: "onboardingDrafts",
    welcome: {
      heading: "Welcome to HOPE CONSULTANTS!",
      intro:
        "We specialize in guiding students from Pakistan to Top Global and European Countries especially public universities with affordable tuition and scholarship opportunities.",
      body: "By filling out this form, you will help us understand your academic background, financial situation, and study preferences. This allows us to provide you with personalized guidance on:",
      benefits: [
        "Choosing the right universities & programs",
        "Preparing your documents step by step",
        "Scholarship opportunities",
        "Visa and travel guidance",
      ],
      accuracyNote:
        "Please provide accurate information and take your time to complete each section.",
      privacyNote:
        "All information is strictly confidential and will only be used to assist you with your admission process.",
      closing: "Let’s begin your journey toward studying abdroad with HOPE CONSULTANTS!",
    },
    confirmation: CONFIRMATION,
    sections: ONBOARDING_SECTIONS,
  },
  documents: {
    key: "documents",
    slug: "documents",
    title: "Hope Consultants | Student Admission Application & Document Submission",
    subtitle: "Admission application & document submission",
    storageKey: "documentSubmissions",
    draftCookieName: "hope_documents_draft",
    draftCollection: "documentDrafts",
    welcome: {
      heading: "Welcome to Hope Consultants!",
      intro:
        "Please complete your personal information and upload the available documents required for your international university admission application.",
      body: "Ensure that all uploaded documents are clear, readable, and complete. If a document is not applicable or currently unavailable, you may skip that field.",
      closing:
        "Our admissions team will review your submission and contact you if additional documents are required.",
    },
    confirmation: CONFIRMATION,
    sections: DOCUMENT_SECTIONS,
  },
} satisfies Record<FormKey, FormDefinition>;

export function getSeedFormDefinition(key: FormKey): FormDefinition {
  return formDefinitions[key];
}
