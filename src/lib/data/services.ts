export interface Service {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  deliverables: string[];
}

export const services: Service[] = [
  {
    slug: "counselling",
    name: "Counselling & Profile Assessment",
    shortName: "Counselling",
    description:
      "A one-to-one session to understand your academic background, budget, career goals, and family situation before recommending any destination or university.",
    deliverables: [
      "Profile review and honest fit assessment",
      "Shortlist of realistic destinations and courses",
      "Budget planning across tuition and living costs",
    ],
  },
  {
    slug: "universities",
    name: "University Admission Support",
    shortName: "Admissions",
    description:
      "End-to-end help with choosing programmes, preparing applications, and staying on track with deadlines for public and private universities.",
    deliverables: [
      "University and course selection",
      "Application preparation and submission",
      "Document checklist and deadline tracking",
    ],
  },
  {
    slug: "scholarships",
    name: "Scholarship Guidance",
    shortName: "Scholarships",
    description:
      "Honest guidance on the scholarships and funding options that realistically apply to your profile, with no guaranteed-outcome promises.",
    deliverables: [
      "Eligibility screening for named scholarships",
      "Guidance on funding applications and essays",
      "Clear explanation of what funding is uncertain",
    ],
  },
  {
    slug: "visa",
    name: "Student Visa Guidance",
    shortName: "Visa",
    description:
      "Step-by-step preparation for your student visa application — documents, funds proof, and embassy interviews — aligned to each country's rules.",
    deliverables: [
      "Country-specific visa document checklist",
      "Financial evidence preparation",
      "Interview and submission guidance",
    ],
  },
  {
    slug: "ielts",
    name: "IELTS & Language Preparation",
    shortName: "Language",
    description:
      "A realistic study plan for IELTS and other English tests, including understanding which countries may waive English tests for English-medium graduates.",
    deliverables: [
      "Personalised test-prep roadmap",
      "Mock test and band-score strategy",
      "Honest assessment of language waivers",
    ],
  },
  {
    slug: "accommodation",
    name: "Pre-Departure & Accommodation",
    shortName: "Pre-Departure",
    description:
      "Support with flights, accommodation, banking, and a clear packing of what to expect after you arrive — without overpromising on anything.",
    deliverables: [
      "Accommodation options and housing guidance",
      "Pre-departure checklist",
      "Arrival and settlement tips",
    ],
  },
  {
    slug: "parents",
    name: "Parent & Family Consultations",
    shortName: "For Parents",
    description:
      "Clear, calm sessions for parents and families about costs, safety, and the real timeline — so decisions are made together and honestly.",
    deliverables: [
      "Cost and funding explained transparently",
      "Safety and support information for families",
      "Timeline and process walkthrough",
    ],
  },
];