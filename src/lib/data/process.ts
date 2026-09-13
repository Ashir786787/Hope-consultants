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
      "We listen to your background, goals, and budget — and honestly tell you what is and is not realistic.",
  },
  {
    step: 2,
    title: "Profile & Budget Review",
    description:
      "We shortlist countries and universities that actually fit your profile and finances.",
  },
  {
    step: 3,
    title: "Application & Documents",
    description:
      "We guide your applications smoothly with clear checklists and deadlines.",
  },
  {
    step: 4,
    title: "Offer & Funding",
    description:
      "We help you understand any offers and funding options, without overpromising scholarships.",
  },
  {
    step: 5,
    title: "Visa & Pre-Departure",
    description:
      "We prepare your visa application and get you ready to leave, step by step.",
  },
  {
    step: 6,
    title: "Arrival & Settling In",
    description:
      "We support you once you arrive so the transition is as smooth as it can be.",
  },
];