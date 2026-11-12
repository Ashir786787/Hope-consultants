export type ProgramLevel = "bachelors" | "masters";

export type EvaluatorOption = {
  id: string;
  label: string;
  points: number;
};

export type EvaluatorQuestion = {
  key: string;
  label: string;
  options: EvaluatorOption[];
  visibleWhen?: { question: string; option: string };
};

export type EvaluatorProgram = {
  id: ProgramLevel;
  label: string;
  description: string;
  questions: EvaluatorQuestion[];
};

export type EvaluatorDestination = {
  name: string;
  iso: string;
};

export type AdviceIcon = "academic" | "language" | "gap" | "financial";

export type AdviceCard = {
  icon: AdviceIcon;
  title: string;
  body: string;
};

export const QUESTION_KEYS = {
  academic: "academicRecord",
  english: "englishCertificate",
  cefr: "cefrBand",
  experience: "experience",
  studyGap: "studyGap",
  bank: "bankStatement",
  relevant: "relevantProgram",
} as const;

export const ENGLISH_OPTION_IDS = {
  none: "none",
  moi: "moi",
  ielts: "ielts",
} as const;

export const GAP_OPTION_IDS = {
  none: "none",
} as const;

export const BANK_OPTION_IDS = {
  under30: "under30",
  from30to50: "from30to50",
  from50to70: "from50to70",
  over70: "over70",
} as const;

const BACHELORS_QUESTIONS: EvaluatorQuestion[] = [
  {
    key: QUESTION_KEYS.academic,
    label: "Intermediate Grade?",
    options: [
      { id: "g60", label: "60-70%", points: 0.334 },
      { id: "g70", label: "70-80%", points: 0.8 },
      { id: "g80", label: "80-90%", points: 1.5 },
      { id: "g90", label: "90-100%", points: 2 },
    ],
  },
  {
    key: QUESTION_KEYS.english,
    label: "Do you have any English Certificate?",
    options: [
      { id: ENGLISH_OPTION_IDS.none, label: "None", points: 0 },
      { id: ENGLISH_OPTION_IDS.ielts, label: "IELTS/TOEFL/PTE", points: 1 },
    ],
  },
  {
    key: QUESTION_KEYS.cefr,
    label: "Your CEFR level?",
    visibleWhen: { question: QUESTION_KEYS.english, option: ENGLISH_OPTION_IDS.ielts },
    options: [
      { id: "below5_5", label: "< 5.5 Bands", points: 0 },
      { id: "band5_5", label: "5.5 - 6.5 Bands", points: 1.005 },
      { id: "band6_5", label: "6.5+ Bands", points: 1.5 },
    ],
  },
  {
    key: QUESTION_KEYS.experience,
    label: "Do you have relevant work Experience?",
    options: [
      { id: "none", label: "None", points: 0 },
      { id: "years1to2", label: "1-2 Years", points: 1 },
      { id: "years2to5", label: "2-5 Years", points: 0.5 },
      { id: "years5plus", label: "5+ Years", points: 0 },
    ],
  },
  {
    key: QUESTION_KEYS.studyGap,
    label: "Do you have any study gap?",
    options: [
      { id: GAP_OPTION_IDS.none, label: "None", points: 1.25 },
      { id: "years1to2", label: "1-2 Years", points: 0.75 },
      { id: "years2to5", label: "2-5 Years", points: 0.25 },
      { id: "years5plus", label: "5+ Years", points: 0 },
    ],
  },
  {
    key: QUESTION_KEYS.bank,
    label: "What amount of bank statement can you provide?",
    options: [
      { id: BANK_OPTION_IDS.under30, label: "< 30 Lac", points: 0.25 },
      { id: BANK_OPTION_IDS.from30to50, label: "30-50 Lac", points: 1 },
      { id: BANK_OPTION_IDS.from50to70, label: "50-70 Lac", points: 1.5 },
      { id: BANK_OPTION_IDS.over70, label: "70+ Lac", points: 2 },
    ],
  },
  {
    key: QUESTION_KEYS.relevant,
    label: "Are you willing to apply to a program relevant to your previous education?",
    options: [
      { id: "no", label: "No", points: 0 },
      { id: "yes", label: "Yes", points: 1.25 },
    ],
  },
];

const MASTERS_QUESTIONS: EvaluatorQuestion[] = [
  {
    key: QUESTION_KEYS.academic,
    label: "Your Bachelors Degree CGPA?",
    options: [
      { id: "cgpa2_5", label: "2.5 - 3.0", points: 0.5 },
      { id: "cgpa3_0", label: "3.0 - 3.5", points: 1 },
      { id: "cgpa3_5", label: "3.5 - 3.8", points: 1.5 },
      { id: "cgpa3_8", label: "3.8+", points: 2 },
    ],
  },
  {
    key: QUESTION_KEYS.english,
    label: "Do you have any English Certificate?",
    options: [
      { id: ENGLISH_OPTION_IDS.none, label: "None", points: 0 },
      { id: ENGLISH_OPTION_IDS.moi, label: "MOI", points: 0.5 },
      { id: ENGLISH_OPTION_IDS.ielts, label: "IELTS/TOEFL/PTE", points: 1 },
    ],
  },
  {
    key: QUESTION_KEYS.cefr,
    label: "Your CEFR level?",
    visibleWhen: { question: QUESTION_KEYS.english, option: ENGLISH_OPTION_IDS.ielts },
    options: [
      { id: "below6", label: "< 6 Bands", points: 0 },
      { id: "above6", label: "> 6 Bands", points: 0.5 },
    ],
  },
  {
    key: QUESTION_KEYS.experience,
    label: "Do you have relevant work Experience?",
    options: [
      { id: "none", label: "None", points: 0 },
      { id: "years1to2", label: "1-2 Years", points: 1 },
      { id: "years2to5", label: "2-5 Years", points: 2 },
      { id: "years5plus", label: "5+ Years", points: 1 },
    ],
  },
  {
    key: QUESTION_KEYS.studyGap,
    label: "Do you have any study gap?",
    options: [
      { id: GAP_OPTION_IDS.none, label: "None", points: 1.25 },
      { id: "years1to2", label: "1-2 Years", points: 0.75 },
      { id: "years2to5", label: "2-5 Years", points: 0.25 },
      { id: "years5plus", label: "5+ Years", points: 0 },
    ],
  },
  {
    key: QUESTION_KEYS.bank,
    label: "What amount of bank statement can you provide?",
    options: [
      { id: BANK_OPTION_IDS.under30, label: "< 30 Lac", points: 0.25 },
      { id: BANK_OPTION_IDS.from30to50, label: "30-50 Lac", points: 1 },
      { id: BANK_OPTION_IDS.from50to70, label: "50-70 Lac", points: 1.5 },
      { id: BANK_OPTION_IDS.over70, label: "70+ Lac", points: 2 },
    ],
  },
  {
    key: QUESTION_KEYS.relevant,
    label: "Are you willing to apply to a program relevant to your previous education?",
    options: [
      { id: "no", label: "No", points: 0 },
      { id: "yes", label: "Yes", points: 1.25 },
    ],
  },
];

export const PROGRAMS: EvaluatorProgram[] = [
  {
    id: "bachelors",
    label: "Bachelors Degree",
    description: "You have finished (or are finishing) intermediate, A-levels or equivalent.",
    questions: BACHELORS_QUESTIONS,
  },
  {
    id: "masters",
    label: "Masters Degree",
    description: "You have finished (or are finishing) a bachelor's degree.",
    questions: MASTERS_QUESTIONS,
  },
];

export const DESTINATION_GROUPS: { forOptions: readonly string[]; countries: EvaluatorDestination[] }[] = [
  {
    forOptions: [BANK_OPTION_IDS.under30],
    countries: [
      { name: "Turkey", iso: "TR" },
      { name: "China", iso: "CN" },
      { name: "Northern Cyprus", iso: "CY" },
      { name: "Japan", iso: "JP" },
    ],
  },
  {
    forOptions: [BANK_OPTION_IDS.from30to50],
    countries: [
      { name: "Italy", iso: "IT" },
      { name: "Hungary", iso: "HU" },
      { name: "Portugal", iso: "PT" },
      { name: "Lithuania", iso: "LT" },
      { name: "Malta", iso: "MT" },
    ],
  },
  {
    forOptions: [BANK_OPTION_IDS.from50to70, BANK_OPTION_IDS.over70],
    countries: [
      { name: "Germany", iso: "DE" },
      { name: "Belgium", iso: "BE" },
      { name: "Sweden", iso: "SE" },
      { name: "Netherlands", iso: "NL" },
      { name: "Finland", iso: "FI" },
    ],
  },
];

export const ADVICE_COPY = {
  academic: {
    icon: "academic",
    title: "Academic advice",
    strong:
      "Your grades put a wide range of universities in reach. In your SOP, connect your previous coursework to the programme you are applying to and name the modules you actually want to study.",
    standard:
      "Your grades are workable, but programme choice matters. Target universities whose published entry requirements you clearly meet, and use your SOP to explain your motivation and any upward trend in your results.",
  },
  language: {
    icon: "language",
    title: "Language advice",
    none: "With no English certificate yet, sitting IELTS or PTE is the fastest way to strengthen your application. Most universities and visa officers treat a recognised score as proof you can cope with the course.",
    moi: "MOI is accepted by some universities but not all. Check each shortlisted university's requirement before you rely on it, and sit IELTS or PTE if any of them ask for it.",
    lowerBand:
      "Your certificate is valid, but the band score is below what some universities ask for. Retaking to clear their minimum is usually quicker than applying without it.",
    strongBand:
      "Your English certificate is one of your strongest points. Quote the score in your SOP and use it when comparing universities that waive or reduce other requirements.",
  },
  studyGap: {
    icon: "gap",
    title: "Study gap advice",
    none: "With no study gap, your timeline is straightforward. Apply early in the intake so your documents, finances and visa have room to be processed without rushing.",
    present:
      "You have a study gap, so prepare experience letters or certificates that cover that period, and explain it briefly and honestly in your SOP. An unexplained gap raises more questions than a stated one.",
  },
  financial: {
    icon: "financial",
    title: "Financial advice",
    general:
      "Show funds that have been sitting in the account for a settled period rather than a lump sum paid in just before you apply. Bank statements are read closely, and money with history reads as genuine.",
    limited:
      "With a smaller bank statement, prioritise countries and universities with lower tuition and living costs, and look at scholarships that reduce the amount you have to show.",
  },
} as const;
