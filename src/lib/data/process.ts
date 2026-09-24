export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Free Consultation",
    description:
      "We listen to your background, goals, budget and concerns — and tell you honestly what is and is not realistic before any commitment.",
  },
  {
    step: 2,
    title: "Country & University Shortlist",
    description:
      "We shortlist countries and universities that actually fit your academic level, grades, language skills and family budget.",
  },
  {
    step: 3,
    title: "Applications & Documents",
    description:
      "We prepare your applications, Statement of Purpose, motivation letter, CV and academic/financial documents, and track every deadline.",
  },
  {
    step: 4,
    title: "Scholarships & Funding",
    description:
      "We screen which funding routes — national, government and university — realistically fit your profile, and guide your applications.",
  },
  {
    step: 5,
    title: "Offers & University Verification",
    description:
      "When offers arrive, we verify the institution and the offer are genuine — and confirm your choices before you accept or pay anything.",
  },
  {
    step: 6,
    title: "Visa Application & Interview Preparation",
    description:
      "We prepare your student visa application and realistic visa interview practice, aligned to the current rules of your destination.",
  },
  {
    step: 7,
    title: "Pre-Departure & Arrival",
    description:
      "We support your enrollment, accommodation, exchange and arrival — so the transition to student life starts clean and supported.",
  },
];