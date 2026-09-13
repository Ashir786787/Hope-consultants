import type { CountryDestination } from "./types";

/**
 * The 14 study destinations Hope Consultants works with.
 *
 * FIGURE HONESTY: figures are directional ranges current as of 2025–26,
 * phrased with "typically / usually / in most cases". Exchange rates,
 * visa fee schedules and scholarships change — always confirm the exact
 * number with Hope before budgeting. Anything I'm not confident about is
 * flagged in the chat notes to the client, not asserted here as fact.
 */
export const countries: CountryDestination[] = [
  {
    slug: "italy",
    name: "Italy",
    tagline: "Art, architecture & affordable public universities",
    description:
      "Italy mixes history with some of Europe's most affordable public tuition. Most bachelor's programs teach in Italian, though a growing number of English-taught degrees exist at master's level. Good fit for students drawn to design, architecture and humanities.",
    flag: "🇮🇹",
    englishFriendly: false,
    intakes: ["Autumn (Sep/Oct)", "Spring (Feb — limited)"],
    requirements: [
      "12 years schooling (HSSC/FSc) plus secondary-school cert",
      "12 years schooling plus secondary school certificate",
    ],
    popularFields: [
      "Architecture & design",
      "Fashion & industrial design",
      "Engineering",
      "Medicine (limited seats)",
      "Economics",
      "Fine arts & humanities",
    ],
    cost: {
      tuitionEurMin: 0,
      tuitionEurMax: 4000,
      livingEurMin: 800,
      livingEurMax: 1400,
      band: "low",
      fundedByDefault: true,
    },
    tuitionNote:
      "Public universities charge region-based fees, typically €0–4,000/yr. Private institutions (e.g. some design schools) cost far more.",
    visaNote:
      "D-type visa for studies; must show proof of funds (~per Italian immigration schedule). Interview is common — Hope prepares you for it.",
  },
  {
    slug: "germany",
    name: "Germany",
    tagline: "Tuition-free public universities, engineer's heartland",
    description:
      "Germany charges no tuition at almost all public universities — students pay a small semester fee. Strong in engineering, computer science and mechanics. Learning some German is widely recommended and expected for both daily life and many programs.",
    flag: "🇩🇪",
    englishFriendly: true,
    intakes: ["Winter (Oct)", "Summer (Apr)"],
    requirements: [
      "Higher Secondary (HSSC) + often 1 year of recognised university study",
      "German language (B1–C1) for German-taught programs",
      "Proof of funds — currently ~€11,900/yr blocked account",
    ],
    popularFields: [
      "Mechanical & automotive engineering",
      "Computer science",
      "Electrical engineering",
      "Industrial design",
      "Energy & renewable systems",
      "Business administration (less common, fee-charging)",
    ],
    cost: {
      tuitionEurMin: 0,
      tuitionEurMax: 2000,
      livingEurMin: 900,
      livingEurMax: 1400,
      band: "low",
      fundedByDefault: true,
    },
    tuitionNote:
      "Public universities are tuition-free; a semester fee (usually €150–400) covers facilities. Some master's programs and business schools charge tuition.",
    visaNote:
      "Study visa requires a blocked account (Sperrkonto) with ~€11,904 (2024/25 figure — confirm current amount). University admission is a prerequisite.",
  },
  {
    slug: "belgium",
    name: "Belgium",
    tagline: "Multilingual hub at the heart of EU institutions",
    description:
      "Belgium offers highly-respected universities split across Flemish (Dutch) and French communitiesfire — and a valuable degree right on the European Union's doorstep. Tuition is affordable versus the UK/US, and English-taught programs are common at master's level.",
    flag: "🇧🇪",
    englishFriendly: true,
    intakes: ["Autumn (Sep/Oct)"],
    requirements: [
      "Higher Secondary (HSSC); some programmes ask for entrance exams",
      "English language certificate (IELTS 6.0–6.5 typical)",
      "For Flemish programmes: Dutch language is often required at B1",
    ],
    popularFields: [
      "Engineering (KU Leuven)",
      "Business & economics",
      "EU studies & international relations",
      "Computer science",
    ],
    cost: {
      tuitionEurMin: 0,
      tuitionEurMax: 4500,
      livingEurMin: 900,
      livingEurMax: 1400,
      band: "low",
      fundedByDefault: true,
    },
    tuitionNote:
      "Flemish universities charge annual tuition (~€944–4,500) depending on programme. Walloon/French-speaking universities may differ.",
    visaNote:
      "Study visa after admission; proof of funds ~€700+/month. No major language barrier for English-taught courses.",
  },
  {
    slug: "sweden",
    name: "Sweden",
    tagline: "Tuition-free for EU, innovation-led study culture",
    description:
      "Sweden offers a flat, one-off application fee and a global reputation for design, sustainability and tech. Non-EU students pay tuition, but Swedish universities award generous merit scholarships that frequently cover tuition in full.",
    flag: "🇸🇪",
    englishFriendly: true,
    intakes: ["Autumn (Aug/Sep)", "Spring (Jan — limited)"],
    requirements: [
      "Higher Secondary (HSSC) equivalent",
      "IELTS 6.5 or TOEFL iBT 90 (typical)",
      "Swedish SAT equivalent or university-specific entry tests in some cases",
    ],
    popularFields: [
      "Sustainable engineering & environmental sciences",
      "Product & interaction design",
      "Software engineering",
      "Innovation management",
    ],
    cost: {
      tuitionEurMin: 8000,
      tuitionEurMax: 15000,
      livingEurMin: 900,
      livingEurMax: 1400,
      band: "high",
      fundedByDefault: false,
    },
    tuitionNote:
      "Tuition applies to non-EU students (~SEK 98,000–190,000/yr). Scholarships often cover 25–100% of tuition.",
    visaNote:
      "Residence permit for studies is required (not a standard visa). You must pay the first tuition instalment before the permit is granted.",
  },
  {
    slug: "portugal",
    name: "Portugal",
    tagline: "Sunny, affordable, English programming is growing",
    description:
      "Portugal pairs low living costs with a milder visa-path than many alternatives. English-taught bachelor's are limited but expanding; master's in business, architecture and digital media are strong for international students.",
    flag: "🇵🇹",
    englishFriendly: true,
    intakes: ["Autumn (Sep)", "Spring (Feb — some institutes)"],
    requirements: [
      "Secondary school equivalence recognition (done by university)",
      "English B2 certificate where course is in English",
      "Portuguese A2 encouraged for integration/residence later",
    ],
    popularFields: [
      "Business & management",
      "Architecture",
      "Computer Science",
      "Hospitality & tourism management",
    ],
    cost: {
      tuitionEurMin: 2500,
      tuitionEurMax: 12000,
      livingEurMin: 700,
      livingEurMax: 1100,
      band: "medium",
      fundedByDefault: false,
    },
    tuitionNote:
      "Public universities charge ~€2,500–7,000; private institutions (business/hospitality) are more.",
    visaNote:
      "Study visa via consulate; applicants under 16 may use the SEF ARI registration route. Show proof of funds (~need to be verified).",
  },
  {
    slug: "lithuania",
    name: "Lithuania",
    tagline: "EU member, low costs, scholarships that actually exist",
    description:
      "Lithuania is one of the most budget-friendly Schengen destinations with real state scholarships for international students. English-taught medicine, engineering and IT programmes are established here.",
    flag: "🇱🇹",
    englishFriendly: true,
    intakes: ["Autumn (Sep/Oct)", "Spring (Feb — some)"],
    requirements: [
      "Secondary school certificate (recognised)",
      "IELTS 5.5–6.5 depending on programme",
      "Medicine/health programmes: entrance assessment or interview",
    ],
    popularFields: [
      "Medicine & dentistry",
      "Information technology",
      "Engineering & architecture",
      "Business and public administration",
    ],
    cost: {
      tuitionEurMin: 4000,
      tuitionEurMax: 8500,
      livingEurMin: 550,
      livingEurMax: 900,
      band: "low",
      fundedByDefault: false,
    },
    tuitionNote:
      "State scholarships (e.g. Lithuanian state scholarships) cover tuition and often a stipend for selected students — highly sought after.",
    visaNote:
      "Visa D needed; often applicant must already hold a residence permit invitation or pre-cleared entry if long-stay. Hope handles full paperwork.",
  },
  {
    slug: "turkey",
    name: "Turkey",
    tagline: "No IELTS needed at most universities, low living costs",
    description:
      "Turkey is especially popular with Pakistani students because most universities accept equivalency without IELTS, and living costs stay low. Türkiye Burslari scholarships are among the best-funded worldwide.",
    flag: "🇹🇷",
    englishFriendly: true,
    intakes: ["Autumn (Sep)", "Spring (Feb) & summer intakes at some universities"],
    requirements: [
      "Higher Secondary (HSSC); certain programmes need YÖS or SAT",
      "IELTS generally NOT required (university-conducted English placements)",
      "For medicine/dentistry: YÖS/MAT or entrance assessment",
    ],
    popularFields: [
      "Engineering",
      "Medicine & dentistry",
      "Business administration",
      "Architecture",
      "Aviation management",
    ],
    cost: {
      tuitionEurMin: 800,
      tuitionEurMax: 6000,
      livingEurMin: 400,
      livingEurMax: 800,
      band: "low",
      fundedByDefault: false,
    },
    tuitionNote:
      "Public university tuition ranges widely. Türkiye Burslari can make it fully free with a monthly stipend + housing.",
    visaNote:
      "Student visa issued from admission letter; no blocked account needed for most universities, though proof of funds helps.",
  },
  {
    slug: "china",
    name: "China",
    tagline: "Full-ride CSC scholarships in engineering and medicine",
    description:
      "China's CSC and provincial scholarships regularly fund international students in engineering, medical (MBBS) and language programmes. Cities vary hugely in cost; Chinese language ability is valuable for non-English courses.",
    flag: "🇨🇳",
    englishFriendly: false,
    intakes: ["Autumn (Sep) — main intake", "China Scholarship Council", "Chinese Government Scholarship (CSC)"],
    requirements: [
      "High school or bachelor's certificate, authenticated (usually verified by the university)",
      "HSK 4 for Chinese-taught programs; English: IELTS 6+ for English-taught programmes",
      "CSC: age + academic thresholds per level",
    ],
    popularFields: [
      "Engineering & technology",
      "MBBS (medicine in English)",
      "Chinese language",
      "Computer science",
    ],
    cost: {
      tuitionEurMin: 3000,
      tuitionEurMax: 9000,
      livingEurMin: 350,
      livingEurMax: 700,
      band: "low",
      fundedByDefault: false,
    },
    tuitionNote:
      "Self-funded tuition is low; CSC scholarships typically cover tuition, accommodation, living stipend and health insurance.",
    visaNote:
      "X visa (study) — CSC-funded students often get a fast-track admission-and-visa path.",
  },
  {
    slug: "japan",
    name: "Japan",
    tagline: "MEXT scholarships: full funding, decades of quality",
    description:
      "Japan's MEXT scholarship is one of the world's most prestigious full-funding awards — fees paid, monthly stipend, airfare. Japanese-taught programmes are the norm at subsidised national universities; strong pathway for engineering and Japanese language.",
    flag: "🇯🇵",
    englishFriendly: false,
    intakes: ["April (main)", "October (some)"],
    requirements: [
      "Nationality check (MEXT has country quotas incl. Pakistan coverage)",
      "Academic record + age requirements per level",
      "Japanese language recommended but not mandatory if course offered in English",
    ],
    popularFields: [
      "Engineering & robotics",
      "Japanese language & studies",
      "Agriculture",
      "Business & economics (Japanese schools)",
    ],
    cost: {
      tuitionEurMin: 2500,
      tuitionEurMax: 12000,
      livingEurMin: 700,
      livingEurMax: 1200,
      band: "medium",
      fundedByDefault: false,
    },
    tuitionNote:
      "National university tuition is low; private universities charge much more. MEXT removes both entirely.",
    visaNote:
      "Student visa issued after Certificate of Eligibility (CoE) — Hope prepares your CoE paperwork.",
  },
  {
    slug: "cyprus",
    name: "Cyprus",
    tagline: "English-first island, medical & health degrees, quick visa",
    description:
      "Cyprus is a small English-speaking EU island where English-taught programmes are the default. Medicine, nursing and business programmes are common with clear, usually faster, application timelines.",
    flag: "🇨🇾",
    englishFriendly: true,
    intakes: ["Autumn (Sep)", "Spring (Feb)", "Summer (some)"],
    requirements: [
      "Secondary school certificate (12 years)",
      "IELTS 6.0–6.5 or university entrance test for English-taught courses",
      "Medicine: entrance assessment or interview",
    ],
    popularFields: [
      "Medicine & nursing",
      "Business administration",
      "Computer science",
      "Pharmacy & health sciences",
    ],
    cost: {
      tuitionEurMin: 5500,
      tuitionEurMax: 13000,
      livingEurMin: 500,
      livingEurMax: 900,
      band: "medium",
      fundedByDefault: false,
    },
    tuitionNote:
      "Private universities dominate; tuition higher but scholarships are widely offered to strong students (often 20–50%).",
    visaNote:
      "Study visa known to be comparatively quick; still requires proof of funds and accommodation.",
  },
  {
    slug: "hungary",
    name: "Hungary",
    tagline: "Stipendium Hungaricum — full ride, familiar to Pakistanis",
    description:
      "Hungary's Stipendium Hungaricum scholarship covers tuition plus monthly stipend, accommodation and medical insurance — Pakistan is one of the partner countries. English, medicine, engineering programmes are world-ranked.",
    flag: "🇭🇺",
    englishFriendly: true,
    intakes: ["Autumn (Sep) via Stipendium (annual call)"],
    requirements: [
      "Pakistan is a partner country for Stipendium Hungaricum",
      "Secondary school/equivalent + age cap (varies by partner country)",
      "English language certificate (IELTS 6.0 typical) or interview-assessment",
    ],
    popularFields: [
      "Medicine & dentistry (highly competitive)",
      "Engineering",
      "Business",
      "Agricultural & life sciences",
    ],
    cost: {
      tuitionEurMin: 0,
      tuitionEurMax: 7000,
      livingEurMin: 450,
      livingEurMax: 800,
      band: "low",
      fundedByDefault: false,
    },
    tuitionNote:
      "Stipendium Hungaricum = fully funded. Self-funded seats cost €2,000–7,000/yr for non-EU students.",
    visaNote:
      "Scholarship students receive clear visa documents; Hope manages the application dossier for the annual January call.",
  },
  {
    slug: "malta",
    name: "Malta",
    tagline: "Small English-speaking island, solid tourism & business",
    description:
      "Malta is a compact, English-speaking EU country with respectable private colleges strong in business, tourism and IT. It suits students who want a quieter, manageable environment and an English-native setting.",
    flag: "🇲🇹",
    englishFriendly: true,
    intakes: ["Autumn (Sep/Oct)", "Spring/Summer (some programmes)"],
    requirements: [
      "Secondary school certificate (12 years)",
      "IELTS 6.0 or in-house English placement",
      "Interview for some business/IT programmes",
    ],
    popularFields: [
      "Tourism & hospitality management",
      "Business",
      "Information technology",
      "Banking & finance",
    ],
    cost: {
      tuitionEurMin: 6000,
      tuitionEurMax: 14000,
      livingEurMin: 650,
      livingEurMax: 1100,
      band: "high",
      fundedByDefault: false,
    },
    tuitionNote:
      "Private institutions dominate; tuition is higher but many colleges offer partial scholarships (10–30%).",
    visaNote:
      "Standard student visa; accommodation must be secured before arrival — Hope arranges verified listings.",
  },
  {
    slug: "finland",
    name: "Finland",
    tagline: "Education capital — tuition tied to performance, sector-specific",
    description:
      "Finland's education system is world-famous; but tuition at bachelor's/master's applies to non-EU students in most universities of applied sciences now. High demand for ICT, forestry, engineering programmes.",
    flag: "🇫🇮",
    englishFriendly: true,
    intakes: ["Autumn (Aug/Sep) — single national joint intake"],
    requirements: [
      "Secondary school certificate (12 years) + often entrance exam",
      "IELTS 6.0–6.5 typical",
      "Joint application window (usually January) — no rolling admission",
    ],
    popularFields: [
      "ICT & software engineering",
      "Sustainable forestry & environmental",
      "Nursing & health sciences",
      "Business analytics",
    ],
    cost: {
      tuitionEurMin: 6000,
      tuitionEurMax: 18000,
      livingEurMin: 700,
      livingEurMax: 1200,
      band: "high",
      fundedByDefault: false,
    },
    tuitionNote:
      "UAS tuition for non-EU is ~€6,000–12,000/yr; universities ~€10,000–20,000. Scholarships of 50–100% exist but are selective.",
    visaNote:
      "Residence permit for studies; work rights of 30h/week during term supported.",
  },
  {
    slug: "netherlands",
    name: "Netherlands",
    tagline: "English-first daily life, top business & tech education",
    description:
      "The Netherlands delivers instruction in English across a large share of programmes and is a leading source of world-university rankings. Tuition is mid-range for non-EU, and the country is compact with strong transport and a welcoming international-student culture.",
    flag: "🇳🇱",
    englishFriendly: true,
    intakes: ["Autumn (Sep) — main intake; several track/later intakes"],
    requirements: [
      "5 O-levels + 2 A-levels or equivalent (university foundation possible)",
      "IELTS 6.0–6.5 typical",
      "NUFFIC/NARIC evaluation may be required for older credentials",
    ],
    popularFields: [
      "Business & economics",
      "Computer Science & AI",
      "Engineering & design",
      "Agri-food and water technology",
    ],
    cost: {
      tuitionEurMin: 8000,
      tuitionEurMax: 16000,
      livingEurMin: 900,
      livingEurMax: 1500,
      band: "high",
      fundedByDefault: false,
    },
    tuitionNote:
      "Non-EU tuition typically €8,000–16,000/yr. Holland Scholarship (~€5,000) available once per student.",
    visaNote:
      "Student visa via Nuffic 'fast-track' once enrolment confirmed; must show proof of funds (~€1,000+/month).",
  },
];

export function getCountry(slug: string): CountryDestination | undefined {
  return countries.find((c) => c.slug === slug);
}

export function getCountryNames(slugs: readonly string[]): string[] {
  return slugs
    .map((s) => getCountry(s)?.name)
    .filter((name): name is string => Boolean(name));
}
