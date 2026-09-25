export type ServiceSlug =
  | "university-and-program-selection"
  | "admission-applications"
  | "sop-motivation-letter-cv"
  | "academic-financial-documentation"
  | "scholarship-guidance"
  | "offer-agent-verification"
  | "student-visa-support"
  | "visa-interview-preparation"
  | "pre-enrollment-support"
  | "pre-departure-arrival-support";

export interface Service {
  slug: ServiceSlug;
  name: string;
  description: string;
  image?: string;
}

export const services: Service[] = [
  {
    slug: "university-and-program-selection",
    name: "University & Program Selection",
    description:
      "We help you understand how European universities and programmes work, and build a shortlist that honestly matches your academic level, language skills and budget.",
  },
  {
    slug: "admission-applications",
    name: "Admission Applications",
    description:
      "We guide you through each university's application platform, documents, deadlines and any entrance requirements — so you apply to the right places, correctly, on time.",
  },
  {
    slug: "sop-motivation-letter-cv",
    name: "Statement of Purpose, Motivation Letter & CV Building",
    description:
      "We help you write a strong, honest Statement of Purpose, motivation letter and CV — your own story, structured professionally for admission teams.",
  },
  {
    slug: "academic-financial-documentation",
    name: "Academic & Financial Documentation",
    description:
      "We help you prepare clean, verified academic transcripts and financial documents that satisfy both universities and the visa process.",
  },
  {
    slug: "scholarship-guidance",
    name: "Scholarship Guidance",
    description:
      "We screen which scholarships realistically fit your profile — national, government and university routes — and guide your application. Funding is never guaranteed, and we never pretend it is.",
  },
  {
    slug: "offer-agent-verification",
    name: "Offer & Agent Verification",
    description:
      "If you already hold an offer from an agent or university, we verify whether the institution, the offer and the pressure to pay are genuine before you commit a single rupee.",
  },
  {
    slug: "student-visa-support",
    name: "Student Visa Support",
    description:
      "We prepare your student visa application end to end — documents, proof of funds, forms and timelines — aligned to the current rules of your destination.",
  },
  {
    slug: "visa-interview-preparation",
    name: "Visa Interview Preparation",
    description:
      "We prepare you for the visa interview with realistic practice, honest questions and confident answers — so you know exactly what to expect and how to answer.",
  },
  {
    slug: "pre-enrollment-support",
    name: "Pre-Enrollment Support",
    description:
      "We guide you through enrollment, orientation, and the administrative steps after you arrive — so your university account, courses and paperwork start clean.",
  },
  {
    slug: "pre-departure-arrival-support",
    name: "Pre-Departure & Arrival Support",
    description:
      "From document checks to accommodation, exchange, and what to pack, we help your departure and arrival go as smoothly as possible.",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}