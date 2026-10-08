export const ONBOARDING_SECTIONS = [
  {
    key: "personal",
    slug: "personal-information",
    order: 2,
    title: "Personal Information",
    description:
      "This section helps us record your basic details so we can identify and contact you properly. Please make sure your name and contact information match your official documents.",
  },
  {
    key: "education",
    slug: "education-background",
    order: 3,
    title: "Education Background",
    description:
      "We need to know your academic qualifications, grades, and language proficiency. This information helps us assess your eligibility for Italian universities.",
  },
  {
    key: "preferences",
    slug: "study-abroad-preferences",
    order: 4,
    title: "Study Abroad Preferences",
    description:
      "Tell us about your study plans, interests, and preferred universities. This will help HOPE CONSULTANTS suggest the best programs and opportunities that match your goals.",
  },
  {
    key: "financial",
    slug: "financial-and-family-info",
    order: 5,
    title: "Financial & Family Info",
    description:
      "Studying abroad requires financial planning. This section helps us understand your budget and sponsorship situation so we can guide you toward suitable options and scholarships.",
  },
  {
    key: "documents",
    slug: "documentation-status",
    order: 6,
    title: "Documentation Status",
    description:
      "Admissions and visas require certain documents. Please share the current status of your documents so we can guide you on what’s missing and how to prepare them in time.",
  },
  {
    key: "career",
    slug: "career-and-future-plans",
    order: 7,
    title: "Career & Future Plans",
    description:
      "Your future goals matter. By knowing your career plans, we can recommend programs that match your long-term vision and guide you better on job and migration opportunities.",
  },
  {
    key: "consent",
    slug: "consent",
    order: 8,
    title: "Consent",
    description:
      "By submitting this form, you confirm the information provided is correct and there will be no refund policy. HOPE CONSULTANTS will use this data only for guiding you in your admission and visa process.",
  },
] as const;

export type OnboardingSectionKey = (typeof ONBOARDING_SECTIONS)[number]["key"];
export type OnboardingSection = (typeof ONBOARDING_SECTIONS)[number];

export const TOTAL_PAGES = ONBOARDING_SECTIONS.length + 1;

export function findOnboardingSection(slug: string): OnboardingSection | null {
  return ONBOARDING_SECTIONS.find((section) => section.slug === slug) ?? null;
}

export function sectionHref(slug: string): string {
  return `/onboarding/${slug}`;
}

export function previousSectionHref(slug: string): string | null {
  const index = ONBOARDING_SECTIONS.findIndex((section) => section.slug === slug);
  if (index <= 0) return "/onboarding";
  const target = ONBOARDING_SECTIONS[index - 1];
  return target.slug === slug ? "/onboarding" : sectionHref(target.slug);
}

export function nextSectionHref(slug: string): string | null {
  const index = ONBOARDING_SECTIONS.findIndex((section) => section.slug === slug);
  if (index < 0 || index >= ONBOARDING_SECTIONS.length - 1) return null;
  return sectionHref(ONBOARDING_SECTIONS[index + 1].slug);
}

export const WELCOME_COPY = {
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
} as const;

export const CONFIRMATION_COPY = {
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

export function progressPercent(page: number): number {
  const clamped = Math.min(Math.max(page, 1), TOTAL_PAGES);
  return Math.round((clamped / TOTAL_PAGES) * 100);
}

export function progressLabel(page: number): string {
  const clamped = Math.min(Math.max(page, 1), TOTAL_PAGES);
  return `Page ${clamped} of ${TOTAL_PAGES}`;
}

export const ONBOARDING_STYLES = {
  shell: "min-h-dvh bg-hope-white text-hope-midnight",
  card: "hope-card hope-card--light",
} as const;