import type { ScholarshipProgram } from "./types";

export const scholarships: ScholarshipProgram[] = [
  {
    id: "maecib",
    group: "spotlight",
    name: "Italy MAECI – Italy",
    country: "Italy",
    level: "Bachelor's, Master's, PhD",
    deadline: "≈ 26 March 2026 (2026/27 academic year)",
    benefits:
      "Tuition, monthly stipend and health insurance for selected candidates.",
    applyAt: "Study in Italy (official portal)",
    source: "MAECI — Italian Ministry of Foreign Affairs",
    universities: [
      "University of Bologna",
      "Sapienza University of Rome",
      "University of Milan",
      "Politecnico di Milano",
      "Bocconi University",
      "University of Pavia",
      "University of Pisa",
      "University of Turin",
    ],
  },
  {
    id: "turkiye-burslari",
    group: "spotlight",
    name: "Türkiye Scholarships – Türkiye",
    country: "Turkey",
    level: "Bachelor's, Master's, PhD",
    deadline: "Annual call, usually opens December – February",
    benefits:
      "Tuition, accommodation, health insurance, airfare, a Turkish language course and a monthly stipend.",
    applyAt: "Turkiye Scholarships official portal",
    source: "Türkiye Scholarships",
    universities: [
      "Middle East Technical University (ODTÜ)",
      "Boğaziçi University",
      "Istanbul Technical University",
      "Istanbul University",
      "Hacettepe University",
      "Ankara University",
      "Koç University",
      "Sabancı University",
    ],
  },
  {
    id: "nl-scholarship",
    group: "spotlight",
    name: "NL (Holland) Scholarship – Netherlands",
    country: "Netherlands",
    level: "Bachelor's, Master's",
    deadline: "Usually February / May per institution",
    benefits:
      "One-time grant of €5,000 towards first-year tuition for non-EU/EEA students.",
    applyAt: "Each participating university",
    source: "Nuffic",
    universities: [
      "University of Amsterdam",
      "Delft University of Technology",
      "Erasmus University Rotterdam",
      "University of Groningen",
      "University of Twente",
      "Leiden University",
      "Radboud University",
      "Utrecht University",
      "Eindhoven University of Technology",
    ],
  },
  {
    id: "stipendium-hungaricum",
    group: "spotlight",
    name: "Stipendium Hungaricum – Hungary",
    country: "Hungary",
    level: "Bachelor's, Master's, PhD",
    deadline: "Annual call, usually opens October – January",
    benefits:
      "Full tuition, monthly stipend, dormitory accommodation and medical insurance.",
    applyAt: "Stipendium Hungaricum official portal",
    source: "Stipendium Hungaricum",
    universities: [
      "Semmelweis University",
      "University of Debrecen",
      "University of Szeged",
      "Eötvös Loránd University (ELTE)",
      "Budapest University of Technology and Economics (BME)",
      "Corvinus University of Budapest",
      "University of Pécs",
    ],
  },
  {
    id: "chevening",
    group: "fully-funded",
    name: "Chevening Scholarships",
    country: "United Kingdom",
    level: "Master's (any UK university)",
    deadline: "Annual — usually by early November",
    benefits:
      "Full tuition, monthly stipend, airfare, and other allowances. Fully funded.",
    eligibility:
      "Pakistani citizens with at least two years of work experience and a strong academic record.",
    applyAt: "Chevening official portal",
    source: "UK Government",
  },
  {
    id: "commonwealth-masters",
    group: "fully-funded",
    name: "Commonwealth Master's Scholarships",
    country: "United Kingdom",
    level: "Master's",
    deadline: "Annual — usually around October",
    benefits:
      "Full tuition, airfare, monthly stipend, and other allowances. Fully funded.",
    eligibility:
      "Candidates from eligible low- and middle-income Commonwealth countries, with conditions.",
    applyAt: "Commonwealth Shared Scholarship/Commonwealth Scholarships portal",
    source: "Commonwealth Scholarships Commission",
  },
  {
    id: "fulbright",
    group: "fully-funded",
    name: "Fulbright Foreign Student Program",
    country: "United States of America",
    level: "Master's, PhD",
    deadline: "Annual — usually around October",
    benefits:
      "Full tuition, monthly stipend, health insurance, airfare and more. Fully funded.",
    eligibility:
      "Pakistani citizens with strong academic records and leadership potential.",
    applyAt: "USEFP / Fulbright program office",
    source: "Fulbright Commission",
  },
  {
    id: "daad",
    group: "fully-funded",
    name: "DAAD Scholarships",
    country: "Germany",
    level: "Master's, PhD (some Bachelor's)",
    deadline: "Varies by programme — usually 4–8 months before intake",
    benefits:
      "Tuition (where applied), monthly stipend, health insurance and travel allowance for selected programmes. Many categories are fully funded.",
    eligibility:
      "Students with strong academic records applying to eligible German programmes.",
    applyAt: "DAAD official portal",
    source: "DAAD",
  },
  {
    id: "turkiye-burslari-program",
    group: "fully-funded",
    name: "Türkiye Burslari",
    country: "Turkey",
    level: "Bachelor's, Master's, PhD",
    deadline: "Annual — usually opens December – February",
    benefits:
      "Tuition, accommodation, health insurance, airfare, Turkish language course and monthly stipend. Fully funded.",
    eligibility:
      "International students (including Pakistani) meeting the academic requirements of the selected university.",
    applyAt: "Turkiye Scholarships official portal",
    source: "Türkiye Scholarships",
  },
  {
    id: "csc",
    group: "fully-funded",
    name: "Chinese Government Scholarship (CSC)",
    country: "China",
    level: "Bachelor's, Master's, PhD",
    deadline: "Annual — usually opens December – April",
    benefits:
      "Tuition, accommodation, monthly living stipend and comprehensive health insurance. Fully funded.",
    eligibility:
      "International students meeting age and academic thresholds, applied via university, embassy or university-specific channel.",
    applyAt: "CSC official portal",
    source: "China Scholarship Council",
  },
  {
    id: "mext",
    group: "fully-funded",
    name: "MEXT Scholarship",
    country: "Japan",
    level: "Bachelor's, Master's, PhD",
    deadline: "Annual — usually around April–May (embassy track)",
    benefits:
      "Tuition, monthly stipend, return airfare and sometimes accommodation. Fully funded.",
    eligibility:
      "Students who meet nationality, age and academic criteria; usually applied through the Embassy of Japan in Pakistan.",
    applyAt: "Embassy of Japan in Pakistan",
    source: "Ministry of Education, Culture, Sports, Science and Technology (MEXT)",
  },
  {
    id: "stipendium-hungaricum-program",
    group: "fully-funded",
    name: "Stipendium Hungaricum",
    country: "Hungary",
    level: "Bachelor's, Master's, PhD",
    deadline: "Annual — usually opens October – January",
    benefits:
      "Full tuition, monthly stipend, dormitory accommodation and medical insurance. Fully funded.",
    eligibility:
      "Students from eligible partner countries, including Pakistan, meeting academic requirements.",
    applyAt: "Stipendium Hungaricum official portal",
    source: "Stipendium Hungaricum",
  },
  {
    id: "erasmus-mundus",
    group: "fully-funded",
    name: "Erasmus Mundus Joint Master's",
    country: "Europe (multiple countries)",
    level: "Master's",
    deadline: "Varies by programme — usually around January",
    benefits:
      "Full tuition plus a monthly living allowance for selected joint Master's programmes. Fully funded.",
    eligibility:
      "Applicants meeting each joint programme's entry requirements.",
    applyAt: "Each Erasmus Mundus programme",
    source: "European Commission",
  },
  {
    id: "australia-awards",
    group: "fully-funded",
    name: "Australia Awards",
    country: "Australia",
    level: "Master's, PhD",
    deadline: "Annual — usually around April",
    benefits:
      "Full tuition, airfare, living allowance and health cover. Fully funded.",
    eligibility:
      "Candidates from eligible countries (including Pakistan) meeting academic and leadership criteria.",
    applyAt: "Australia Awards official portal",
    source: "Department of Foreign Affairs and Trade",
  },
  {
    id: "maeci",
    group: "partially-funded",
    name: "MAECI Scholarships",
    country: "Italy",
    level: "Bachelor's, Master's, PhD",
    deadline: "≈ 26 March 2026",
    benefits:
      "Tuition and a monthly stipend for part of the study cycle.",
    eligibility:
      "Applicants meeting MAECI's nationality and academic criteria.",
    applyAt: "Study in Italy (official portal)",
    source: "MAECI",
  },
  {
    id: "dsu-regional",
    group: "partially-funded",
    name: "DSU / Regional Scholarships",
    country: "Italy",
    level: "Bachelor's, Master's",
    deadline: "Varies by region (e.g. ER.GO, DSU Toscana, LazioDiSCo)",
    benefits:
      "Income-based grants that can cover fees, meals, accommodation and extra cost-of-living support.",
    eligibility:
      "Students with low family income who meet each region's requirements.",
    applyAt: "Each regional body",
    source: "Regional bodies (e.g. ER.GO, DSU)",
  },
  {
    id: "agakhan",
    group: "partially-funded",
    name: "Aga Khan Foundation Scholarships",
    country: "International",
    level: "Postgraduate",
    deadline: "Varies by country — usually around January–June",
    benefits:
      "Partial funding for postgraduate study, given as a 50/50 grant-and-loan package.",
    eligibility:
      "Outstanding students from eligible countries, including Pakistan.",
    applyAt: "Aga Khan Foundation offices",
    source: "Aga Khan Foundation",
  },
  {
    id: "holland-scholarship",
    group: "partially-funded",
    name: "Holland / NL Scholarship",
    country: "Netherlands",
    level: "Bachelor's, Master's",
    deadline: "Usually February / May per institution",
    benefits: "One-time grant of €5,000 towards first-year tuition.",
    eligibility:
      "Non-EEA students admitted to a participating institution.",
    applyAt: "Each participating university",
    source: "Nuffic",
  },
];

export const scholarshipsIntro =
  "There is no magic scholarship machine. Funding routes are competitive, change frequently, and depend on your profile and year. We only list the routes that actually exist and that we practically help with — and we never guarantee an outcome.";

export const scholarshipsDisclaimer =
  "Scholarships and their amounts, deadlines and conditions change every year. The figures above are the details as we understand them at the time of writing — always confirm the current call, level and deadlines on the official source before applying. We never charge for scholarship applications, and we never promise that applying means winning.";