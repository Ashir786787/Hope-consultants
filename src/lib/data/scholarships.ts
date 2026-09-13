export interface ScholarshipProgram {
  name: string;
  provider: string;
  country: string;
  covers: string;
  advice: string;
}

export const scholarships: ScholarshipProgram[] = [
  {
    name: "Country Government Scholarships",
    provider: "National governments of several study destinations",
    country: "Italy, Germany, Hungary, Poland, and others",
    covers: "Tuition and sometimes a monthly stipend",
    advice:
      "Award criteria and availability change frequently. We confirm current eligibility and application windows with you rather than promising outcomes.",
  },
  {
    name: "University Merit Scholarships",
    provider: "Individual public and private universities",
    country: "Most destinations we cover",
    covers: "Partial or full tuition fee waivers",
    advice:
      "Merit awards depend on your grades and are competitive. We help you apply, but acceptance is never guaranteed.",
  },
  {
    name: "Public University No-Tuition Pathways",
    provider: "Public universities in low-cost destinations",
    country: "Germany, Italy, Sweden, and others",
    covers: "No tuition for many public degree programmes",
    advice:
      "Many public programmes are effectively tuition-free beyond semester fees. This is the most reliable way to manage cost.",
  },
  {
    name: "Early Bird & Alumni Scholarships",
    provider: "Private universities",
    country: "Malta, Cyprus, and others",
    covers: "Percentage fee discounts for early applicants",
    advice:
      "Normally tied to applying by a specific deadline and meeting admissions criteria. We flag the real conditions before you apply.",
  },
];