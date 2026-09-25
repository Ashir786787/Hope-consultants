import type { CountryDestination } from "./types";

export const countries: CountryDestination[] = [
  {
    slug: "italy",
    name: "Italy",
    flag: "🇮🇹",
    position: 1,
    group: "one",
    costBand: "low",
    financialInsight:
      "Public-university tuition can be relatively low and is often income-based; regional scholarships such as DSU/ER.GO/LazioDiSCo are important. Visa financial proof must be checked against current consular rules.",
    intro:
      "Italy mixes historic heritage, architecture and a relaxed lifestyle with some of Europe's most recognised universities. Most bachelor's programmes teach in Italian, while a growing number of English-taught degrees exist at master's level. A good fit for outgoing students who are ready to learn a new language, travel and live a little more slowly.",
    sections: [
      {
        title: "Why Choose Italy?",
        items: [
          "Its lifestyle, weather, and wonderful landscapes",
          "The possibility to travel and get full European exposure",
          "Historic heritage and architecture everywhere you look",
          "Many worldwide recognised and famous universities",
          "A welcoming, relaxed attitude towards international students",
        ],
      },
      {
        title: "Ideal Student Profile",
        body: "You have just completed your secondary education or have already finished your Bachelor's degree. You are an outgoing and adaptable person who is not scared of language barrier issues you might need to cope with.",
        items: [
          "Personality: outgoing, adaptable, open to learning a new language.",
          "Academic: there is no fixed national minimum GPA; each university evaluates your academic background against the programme you apply to.",
          "English: the exact score is programme-specific — for students applying from Pakistan, a practical target is generally IELTS 6.0–6.5+, depending on the programme.",
          "Financial: the student visa requires proof of funds. Check the current minimum subsistence amount required by the consulate (it changes every year).",
          "Working: students can work up to 20 hours a week during the academic year.",
        ],
      },
      {
        title: "How It Feels to Live in Italy",
        items: [
          "The pace of life is more relaxed than in most other European countries.",
          "Weather, food, and people are big pluses; so is the ease of travelling within Italy and across Europe.",
          "Outside larger cities, English is less widely spoken — learning Italian makes everything easier.",
          "Medical care and public transport are good and affordable in most regions.",
        ],
      },
      {
        title: "Main Universities & Fields",
        body: "The most suitable university depends on your budget, language level and field. These are the institutions we most commonly help students with.",
        table: {
          header: ["University", "Main Fields"],
          rows: [
            ["Sapienza, University of Rome", "Engineering, Medicine, Architecture, Economics, Humanities"],
            ["University of Bologna", "Economics, Engineering, Medicine, Sciences"],
            ["Politecnico di Milano", "Architecture, Engineering, Design"],
            ["Politecnico di Torino", "Engineering, Architecture"],
            ["University of Milan", "Medicine, Economics, Humanities, Political Science"],
            ["Luiss Guido Carli", "Economics, Business, Political Science"],
            ["Bocconi University", "Economics, Management, Finance"],
            ["University of Florence", "Arts, Humanities, Architecture, Economics"],
            ["University of Pavia", "Medicine, Economics, Engineering"],
            ["University of Padova", "Engineering, Medicine, Psychology, Science"],
          ],
        },
      },
      {
        title: "Scholarships and Funding",
        items: [
          "Regional scholarships (DSU, ER.GO, LazioDiSCo and similar) can cover most of your study costs — they are income-based and often non-competitive if you meet the financial threshold.",
          "MAECI scholarships are competitive and cover certain study cycles; check the current call and deadlines.",
          "Some universities waive part or all of the tuition region fee for strong or low-income students.",
          "Funding is never guaranteed — we help you apply to the routes that realistically fit your profile.",
        ],
      },
      {
        title: "How and When to Apply",
        items: [
          "Most Italian public universities run their own application portals; the exact dates vary by university and faculty.",
          "Applications for the Autumn intake generally open about a year before and to May–July of the same year, depending on the programme.",
          "The recommended start is: 12 months before your intended intake.",
          "You receive admission, then apply for the student visa at the Italian consulate; interviews are common.",
        ],
      },
      {
        title: "Working in Italy",
        items: [
          "Student visa holders may work up to 20 hours per week during the academic year.",
          "Working mainly helps with living costs — it is not a realistic way to fund tuition.",
          "Italian language is a practical advantage for part-time work.",
        ],
      },
      {
        title: "A Note for Pakistani Students",
        items: [
          "The consulate checks financial documentation carefully — show a genuine, verifiable source of funds.",
          "University admission does not guarantee the visa; both steps need to be prepared properly.",
          "We guide the full timeline from university selection to arrival, including the visa interview.",
        ],
      },
    ],
    journey:
      "Italy is more than a degree — it is a lifestyle, a new language, and a whole continent to explore. If you are ready to adapt and learn, this could be the right home for your next few years.",
    images: ['/countries/italy/italy-1.jpg', '/countries/italy/italy-2.jpg', '/countries/italy/italy-3.jpg'],
  },
  {
    slug: "germany",
    name: "Germany",
    flag: "🇩🇪",
    position: 2,
    group: "one",
    costBand: "low",
    financialInsight:
      "Many public universities have no general tuition fee for consecutive programmes, but semester contributions apply. Student visas generally require proof of funds; blocked accounts are a common route.",
    intro:
      "Germany is home to some of the world's most respected universities and research institutions, and public universities do not charge general tuition fees for consecutive degree programmes. If your profile fits the German admission system, this is one of the most cost-effective education routes in Europe.",
    sections: [
      {
        title: "Why Choose Germany?",
        items: [
          "Tuition-free study at most public universities — you only pay a small semester contribution.",
          "World-class engineering, computer science, business and research programmes.",
          "Strong economy and recognised degrees that open doors internationally.",
          "Part-time work is realistic through student employment during the semester.",
        ],
      },
      {
        title: "Ideal Student Profile",
        items: [
          "Personality: independent, organised, comfortable with structure and deadlines.",
          "Academic: the German system is strict about recognition of your education — your Higher Secondary (HSSC) alone is often not enough; many programmes expect a first year of undergraduate study in Pakistan.",
          "English: English-taught programmes generally require a recognised English certificate (IELTS 6.0–6.5 typical); German-taught programmes require a language certificate (B1–C1).",
          "Financial: study visas generally require proof of funds — blocked accounts are a common route; check the current required amount.",
          "Working: up to 120 full days (or 240 half days) of employment per year for students.",
        ],
      },
      {
        title: "Main Universities & Fields",
        body: "The most suitable university depends on your background, language level and field. These are the institutions we most commonly help students with.",
        table: {
          header: ["University", "Main Fields"],
          rows: [
            ["Technical University of Munich", "Engineering, Computer Science, Natural Sciences"],
            ["RWTH Aachen", "Mechanical Engineering, Electrical Engineering, Computer Science"],
            ["TU Berlin", "Engineering, Computer Science, Architecture"],
            ["KIT Karlsruhe", "Engineering, Computer Science, Natural Sciences"],
            ["LMU Munich", "Medicine, Economics, Humanities, Sciences"],
            ["Heidelberg University", "Medicine, Life Sciences, Humanities"],
            ["University of Stuttgart", "Engineering, Automotive, Aerospace"],
            ["Goethe University Frankfurt", "Economics, Law, Finance, Humanities"],
            ["TU Dresden", "Engineering, Computer Science, Natural Sciences"],
            ["University of Bonn", "Economics, Mathematics, Natural Sciences"],
          ],
        },
      },
      {
        title: "How and When to Apply",
        items: [
          "Most programmes apply either directly on the university portal or through uni-assist, the central service for international applications.",
          "Intakes are twice a year: Winter semester (starts October) and Summer semester (starts April).",
          "The recommended start is: 12 months before your intended intake.",
          "Documents often need to be recognised and sometimes translated; prepare them well in advance.",
          "Once you receive admission, you open a blocked account for proof of funds, then apply for your student visa.",
        ],
      },
      {
        title: "Working in Germany",
        items: [
          "Students can work up to 120 full days per year — enough to meaningfully support living costs.",
          "German language is a practical advantage for part-time jobs.",
          "Working does not replace the money you must prove for the visa.",
        ],
      },
      {
        title: "A Note for Pakistani Students",
        items: [
          "Your Pakistani credentials may not be directly recognised — plan for additional steps such as one year of undergraduate study.",
          "The blocked account amount changes every year; always confirm the current figure.",
          "German-taught programmes give you far more options than English-taught ones — starting German early is a serious advantage.",
        ],
      },
    ],
    journey:
      "Germany rewards preparation. If you meet the admission and financial requirements, you get a first-class degree for a fraction of the cost of most English-speaking countries.",
    images: ['/countries/germany/germany-1.jpg', '/countries/germany/germany-2.jpg', '/countries/germany/germany-3.jpg'],
  },
  {
    slug: "sweden",
    name: "Sweden",
    flag: "🇸🇪",
    position: 3,
    group: "one",
    costBand: "high",
    financialInsight:
      "Tuition varies by programme; non-EU students pay tuition at Swedish universities, and study costs are among the highest in our list to prove.",
    intro:
      "Sweden combines a strong reputation in design, technology and sustainability with a very high standard of living. Non-EU students pay tuition, but the quality of teaching, English proficiency across society and the international student culture make it a serious choice for many Pakistani students.",
    sections: [
      {
        title: "Why Choose Sweden?",
        items: [
          "Internationally respected universities and a collaborative, modern teaching style.",
          "English is spoken fluently across the country — you can live, study and work in English.",
          "Strong programmes in design, engineering, innovation and sustainability.",
          "Generous university scholarships are offered to international students.",
        ],
      },
      {
        title: "Ideal Student Profile",
        items: [
          "Personality: independent, proactive, comfortable in a structured, deadline-driven academic culture.",
          "Academic: a minimum GPA is usually considered but the exact bar is set per programme; stronger academic records open more options.",
          "English: most programmes require IELTS 6.5 or equivalent.",
          "Financial: non-EU students pay tuition (by programme), and the Migration Agency expects you to prove funds for your living costs each year.",
          "Working: international students can work while they study, but the income is not counted as proof of funds for the permit.",
        ],
      },
      {
        title: "Main Universities & Fields",
        body: "These are the institutions we most commonly help students with; the best fit depends on your field and budget.",
        table: {
          header: ["University", "Main Fields"],
          rows: [
            ["KTH Royal Institute of Technology", "Engineering, Technology, Computer Science"],
            ["Chalmers University of Technology", "Engineering, Technology, Architecture"],
            ["Lund University", "Engineering, Medicine, Business, Natural Sciences"],
            ["Uppsala University", "Humanities, Medicine, Science, Law"],
            ["Stockholm University", "Economics, Humanities, Law, Natural Sciences"],
            ["Karolinska Institutet", "Medicine, Biomedicine, Public Health"],
            ["University of Gothenburg", "Business, Humanities, Natural Sciences"],
            ["Jönköping University", "Business, Engineering, Health"],
          ],
        },
      },
      {
        title: "How and When to Apply",
        items: [
          "Applications are centralised on the Swedish national admission portal; you apply to several programmes at once with one application fee.",
          "The main intake is Autumn (starts late August); Spring intake is limited.",
          "The recommended start is: 12 months before your intended intake.",
          "You must pay the first tuition instalment before a residence permit for studies is granted.",
        ],
      },
      {
        title: "Working in Sweden",
        items: [
          "International students may work alongside their studies without a separate permit.",
          "Part-time earnings do not count towards the funds you must show for your permit.",
          "Swedish language helps with part-time work but is not essential in many student roles.",
        ],
      },
      {
        title: "A Note for Pakistani Students",
        items: [
          "Sweden is one of the more expensive destinations to prove — budget carefully and confirm the current annual amount required by the Migration Agency.",
          "Scholarships can cover tuition but not always living costs; treat both separately in your plan.",
          "English proficiency matters more here than in most other European countries.",
        ],
      },
    ],
    journey:
      "If you want a modern, English-friendly education in a safe and progressive country, Sweden is one of the best — if you can meet its financial requirements.",
    images: ['/countries/sweden/sweden-1.jpg', '/countries/sweden/sweden-2.jpg', '/countries/sweden/sweden-3.jpg'],
  },
  {
    slug: "finland",
    name: "Finland",
    flag: "🇫🇮",
    position: 4,
    group: "one",
    costBand: "high",
    financialInsight:
      "Tuition applies to non-EU students and most universities award university-specific tuition waivers or scholarships; Finland does not have a general government scholarship for new international students.",
    intro:
      "Finland's education system is world-famous for quality and equality, with strong programmes in ICT, engineering, business and health sciences. Non-EU students pay tuition, but Finnish universities are honest, high-quality and deeply integrated with industry.",
    sections: [
      {
        title: "Why Choose Finland?",
        items: [
          "One of the best education systems in the world.",
          "English-taught programmes across ICT, business, engineering and health.",
          "Safe, clean, and well-organised society with a high standard of living.",
          "Strong links between universities and industry.",
        ],
      },
      {
        title: "Ideal Student Profile",
        items: [
          "Personality: independent, self-motivated, comfortable with a high degree of personal responsibility in learning.",
          "Academic: each programme sets its requirements; many bachelor's programmes also use entrance examinations.",
          "English: IELTS 6.0–6.5 typical for most programmes.",
          "Financial: non-EU tuition is typically €8,000–20,000 per year depending on the university and programme, plus living costs around €900–1,200 per month.",
          "Working: students may work and income helps living costs, but it is not part of the permit's proof-of-funds.",
        ],
      },
      {
        title: "Main Universities & Fields",
        body: "These are the institutions we most commonly help students with; the best fit depends on your field and budget.",
        table: {
          header: ["University", "Main Fields"],
          rows: [
            ["Aalto University", "Technology, Design, Business"],
            ["University of Helsinki", "Medicine, Humanities, Science, Law"],
            ["University of Turku", "Medicine, Economics, Science"],
            ["Tampere University", "Engineering, Technology, Health"],
            ["University of Oulu", "Technology, Medicine, Natural Sciences"],
            ["LUT University", "Engineering, Business, Energy"],
            ["Metropolia UAS", "ICT, Business, Health Care"],
            ["Tampere University of Applied Sciences", "Technology, Business, Health"],
          ],
        },
      },
      {
        title: "How and When to Apply",
        items: [
          "Finland uses a joint application system: you apply once for several programmes in the same window.",
          "The main intake is Autumn (starts late August); there is usually one restricted application window each year.",
          "The recommended start is: 10–12 months before your intended intake.",
          "Some programmes require entrance examinations or motivational letters.",
        ],
      },
      {
        title: "Working in Finland",
        items: [
          "Students can work alongside their studies; income helps with living costs.",
          "Earnings do not count toward the funds you must prove for the residence permit.",
          "Finnish language is rarely required for student jobs in English-based fields.",
        ],
      },
      {
        title: "A Note for Pakistani Students",
        items: [
          "Finland is competitive and expensive to prove — compare tuition waivers carefully before applying.",
          "There is no general government scholarship for new international students; rely on university-specific waivers.",
          "The joint application window is strict — missing it means waiting a full year.",
        ],
      },
    ],
    journey:
      "Finland is for focused, independent students who want a modern, honest education in one of the safest countries in the world — with tuition waivers available for strong profiles.",
    images: ['/countries/finland/finland-1.jpg', '/countries/finland/finland-2.jpg', '/countries/finland/finland-3.jpg'],
  },
  {
    slug: "turkey",
    name: "Turkey",
    flag: "🇹🇷",
    position: 5,
    group: "one",
    costBand: "low",
    financialInsight:
      "Türkiye Scholarships can cover tuition, accommodation, health insurance, language course, airfare and monthly stipend.",
    intro:
      "Turkey is popular with Pakistani students because many universities accept admission without IELTS, living costs stay low, and Türkiye Scholarships fund a growing number of international students each year. English-taught, Turkish-taught and foundation options all exist.",
    sections: [
      {
        title: "Why Choose Turkey?",
        items: [
          "No IELTS required at most universities — many use their own English placement or offer a preparatory year.",
          "Low living costs compared to most European destinations.",
          "Türkiye Scholarships can cover tuition, accommodation, health insurance, language course, airfare and a monthly stipend.",
          "Close cultural, religious and travel ties with Pakistan, making transition easier.",
        ],
      },
      {
        title: "Ideal Student Profile",
        items: [
          "Personality: adaptable, open to learning Turkish, comfortable with a different pace of bureaucracy.",
          "Academic: most universities accept HSSC with strong grades; certain programmes need YÖS or SAT.",
          "English: IELTS is generally not required; universities conduct their own English placement.",
          "Financial: self-funded tuition is low by international standards; Türkiye Scholarships can remove most costs.",
          "Working: allowed with conditions; income helps living costs but is not the main plan.",
        ],
      },
      {
        title: "Main Universities & Fields",
        body: "These are the institutions we most commonly help students with; the best fit depends on your field and budget.",
        table: {
          header: ["University", "Main Fields"],
          rows: [
            ["Middle East Technical University (ODTÜ)", "Engineering, Computer Science, Science"],
            ["Boğaziçi University", "Engineering, Economics, Social Sciences"],
            ["Istanbul Technical University", "Engineering, Architecture, Technology"],
            ["Istanbul University", "Medicine, Law, Economics"],
            ["Hacettepe University", "Medicine, Health Sciences, Science"],
            ["Ankara University", "Medicine, Law, Political Science"],
            ["Koç University", "Economics, Business, Engineering, Medicine"],
            ["Sabancı University", "Engineering, Business, Social Sciences"],
          ],
        },
      },
      {
        title: "How and When to Apply",
        items: [
          "Turkish public and foundation universities run their own portals; application dates vary by university.",
          "YÖS/SAT are used by some programmes; check each university's requirements.",
          "The recommended start is: 9–12 months before your intended intake.",
          "Türkiye Scholarships applications follow an annual national window — check the current dates.",
        ],
      },
      {
        title: "Scholarships and Funding",
        items: [
          "Türkiye Scholarships is the main fully-funded route — tuition, housing, health insurance, language course, airfare and monthly stipend.",
          "Many private (foundation) universities offer academic scholarships of 25–100% of tuition.",
          "Funding is competitive and never guaranteed — we help you apply to what realistically fits your profile.",
        ],
      },
      {
        title: "A Note for Pakistani Students",
        items: [
          "Turkey's admission system is more flexible than most European countries — a realistic option for many students.",
          "Even where IELTS is not required, students on Turkish-taught programmes attend a preparatory year.",
          "Keep your documents translated and apostilled where requested.",
        ],
      },
    ],
    journey:
      "Turkey is one of the most accessible destinations for Pakistani students — generous scholarships, low costs, and a culture that feels close to home.",
    images: ['/countries/turkey/turkey-1.webp', '/countries/turkey/turkey-3.jpg'],
  },
  {
    slug: "portugal",
    name: "Portugal",
    flag: "🇵🇹",
    position: 6,
    group: "one",
    costBand: "medium",
    financialInsight:
      "Public-university tuition varies; international tuition is programme and institution specific. Proof of financial means and accommodation are important for residence and visa.",
    intro:
      "Portugal combines lower living costs, sunny weather and a welcoming atmosphere with a growing number of English-taught programmes. Tuition varies by programme and institution, and both proof of funds and accommodation matter at the visa stage.",
    sections: [
      {
        title: "Why Choose Portugal?",
        items: [
          "Mild climate, safe cities and a very welcoming culture.",
          "Living costs are among the lowest in Western Europe.",
          "English-taught programmes in business, tourism, engineering and digital media.",
          "A good base to travel within Europe and to Portuguese-speaking countries.",
        ],
      },
      {
        title: "Ideal Student Profile",
        items: [
          "Personality: calm, adaptable, happy in a relaxed environment.",
          "Academic: each university evaluates your secondary education; certain programmes require entrance exams or subject tests.",
          "English: English B2/C1 certificate for English-taught courses.",
          "Financial: public-university tuition varies; international tuition is programme and institution specific. You must show proof of financial means for the visa/residence.",
          "Working: international students may work, with conditions set by the immigration rules.",
        ],
      },
      {
        title: "Main Universities & Fields",
        body: "These are the institutions we most commonly help students with; the best fit depends on your field and budget.",
        table: {
          header: ["University", "Main Fields"],
          rows: [
            ["University of Lisbon", "Economics, Law, Architecture, Engineering"],
            ["University of Porto", "Engineering, Economics, Architecture"],
            ["NOVA University of Lisbon", "Business, Economics, Law, Science"],
            ["University of Minho", "Engineering, ICT, Economics"],
            ["University of Coimbra", "Law, Economics, Science, Arts"],
            ["University of Aveiro", "Technology, Sciences, Design"],
            ["ISCTE – University Institute of Lisbon", "Business, Economics, Social Sciences"],
          ],
        },
      },
      {
        title: "How and When to Apply",
        items: [
          "Most Portuguese universities manage their own international-student application rounds.",
          "The main intake is Autumn; some institutes offer a Spring round.",
          "The recommended start is: 9–12 months before your intended intake.",
          "Accommodation confirmation and proof of financial means are important for the visa/residence process.",
        ],
      },
      {
        title: "A Note for Pakistani Students",
        items: [
          "English-taught bachelor's degrees are limited — check availability before choosing Portugal.",
          "Some applicants under a certain age may use a special registration route (ARI) for residence; conditions change.",
          "Portuguese language A2 is useful later for residence; Portuguese language courses help daily life.",
        ],
      },
    ],
    journey:
      "Portugal is a calm, affordable and genuinely welcoming destination — especially strong once English-taught options and a realistic visa path are confirmed for your profile.",
    images: ['/countries/portugal/portugal-1.jpg', '/countries/portugal/portugal-2.jpg', '/countries/portugal/portugal-3.jpg'],
  },
  {
    slug: "hungary",
    name: "Hungary",
    flag: "🇭🇺",
    position: 7,
    group: "one",
    costBand: "medium",
    financialInsight:
      "Tuition varies significantly by programme; Stipendium Hungaricum can provide tuition-free study plus stipend and accommodation support.",
    intro:
      "Hungary offers a familiar post-cold-war, European education system with strong medicine, dentistry, engineering and business programmes. The Stipendium Hungaricum scholarship — open to Pakistani students — makes it one of the most generous fully-funded routes available.",
    sections: [
      {
        title: "Why Choose Hungary?",
        items: [
          "Stipendium Hungaricum provides full funding — tuition, monthly stipend, accommodation and medical insurance.",
          "Pakistan is one of the partner countries for Stipendium Hungaricum.",
          "Well-regarded medical, dental, engineering and business schools.",
          "Lower living costs than most Western European destinations.",
        ],
      },
      {
        title: "Ideal Student Profile",
        items: [
          "Personality: organised, committed, comfortable with a structured application year.",
          "Academic: strong academic record with a high GPA helps in the Stipendium competition; self-funded seats have their own entry requirements.",
          "English: IELTS 6.0 typical, or an interview as part of the application.",
          "Financial: self-funded students show proof of funds; bank statements are commonly required (for example, the equivalent of ~€10,000 per year as a general guide).",
          "Working: international students may work with conditions during their studies.",
        ],
      },
      {
        title: "Main Universities & Fields",
        body: "These are the institutions we most commonly help students with; the best fit depends on your field and budget.",
        table: {
          header: ["University", "Main Fields"],
          rows: [
            ["Semmelweis University", "Medicine, Dentistry, Pharmacy, Health Sciences"],
            ["University of Debrecen", "Medicine, Dentistry, Pharmaceutical Sciences, Engineering"],
            ["University of Szeged", "Medicine, Pharmacy, Science, Engineering"],
            ["Eötvös Loránd University (ELTE)", "Law, Humanities, Science, Economics"],
            ["Budapest University of Technology and Economics (BME)", "Engineering, Architecture, Technology"],
            ["Corvinus University of Budapest", "Business, Economics, Social Sciences"],
            ["University of Pécs", "Medicine, Engineering, Arts"],
          ],
        },
      },
      {
        title: "How and When to Apply",
        items: [
          "Stipendium Hungaricum follows a single annual call — the whole timeline is managed centrally and begins roughly one year before intake.",
          "Self-funded applicants apply directly to each university's own portal.",
          "The recommended start is: 12 months before your intended intake.",
          "The Stipendium application is fully online through the official portal with a tight document set.",
        ],
      },
      {
        title: "Scholarships and Funding",
        items: [
          "Stipendium Hungaricum — fully funded: tuition, monthly stipend, accommodation and medical insurance.",
          "Some universities offer partial scholarships for strong self-funded applicants.",
          "Funding is competitive and never guaranteed — we help you prepare the strongest realistic application.",
        ],
      },
      {
        title: "A Note for Pakistani Students",
        items: [
          "Stipendium Hungaricum is one of the most realistic full scholarships for Pakistani students — but the competition is real, so your profile and documents must be strong.",
          "Medical and dental seats are the most competitive.",
          "Prepare your motivation, documents and online form carefully within the official call window.",
        ],
      },
    ],
    journey:
      "Hungary is one of the best-funded realistic routes for Pakistani students — if you are ready to prepare a serious, complete scholarship application.",
    images: ['/countries/hungary/hungary-1.jpg', '/countries/hungary/hungary-2.jpg', '/countries/hungary/hungary-3.jpg'],
  },
  {
    slug: "belgium",
    name: "Belgium",
    flag: "🇧🇪",
    position: 8,
    group: "two",
    costBand: "medium",
    financialInsight:
      "Tuition and visa financial requirements vary by community and institution. French-speaking and Flemish systems should be treated separately.",
    intro:
      "Belgium is home to respected universities with ties right at the heart of the European Union. The country runs two separate education systems — Flemish (Dutch-speaking) and French-speaking — and each community sets its own tuition and visa financial rules, so Belgium needs to be treated carefully.",
    sections: [
      {
        title: "Why Choose Belgium?",
        items: [
          "Respected universities with direct access to EU institutions and opportunities.",
          "English-taught programmes are common at master's level.",
          "Central location — travel easily across Europe.",
          "Tuition is generally lower than the UK or US.",
        ],
      },
      {
        title: "Ideal Student Profile",
        items: [
          "Personality: independent, organised, comfortable with administrative detail.",
          "Academic: strong academic record; some programmes ask for entrance exams or specific subject requirements.",
          "English: IELTS 6.0–6.5 typical for English-taught programmes.",
          "Language: for Flemish/Dutch-taught programmes, Dutch is often required (B1 or higher); French-taught programmes require French.",
          "Financial: visa financial requirements vary by community — you must show proof of funds, typically per month for the year.",
          "Working: international students may work with conditions; check each community's rules.",
        ],
      },
      {
        title: "Main Universities & Fields",
        body: "These are the institutions we most commonly help students with; the best fit depends on the community, your field and budget.",
        table: {
          header: ["University", "Main Fields"],
          rows: [
            ["KU Leuven", "Engineering, Business, Law, Biomedical Sciences"],
            ["Ghent University", "Engineering, Economics, Biosciences"],
            ["UCLouvain", "Law, Economics, Engineering, Science"],
            ["Université libre de Bruxelles (ULB)", "Law, Economics, Science, Engineering"],
            ["University of Antwerp", "Economics, Engineering, Social Sciences"],
            ["Vrije Universiteit Brussel", "Business, Law, Engineering, Communication"],
            ["Hasselt University", "Sciences, Technology, Business"],
          ],
        },
      },
      {
        title: "How and When to Apply",
        items: [
          "Most universities run their own application portals, with different deadlines per programme.",
          "The main intake is Autumn; some programmes open in Spring.",
          "The recommended start is: 9–12 months before your intended intake.",
          "Check which community your university belongs to — tuition and visa rules differ between the two systems.",
        ],
      },
      {
        title: "A Note for Pakistani Students",
        items: [
          "Belgium's two education systems are very different — always identify the Flemish or French-speaking route first.",
          "Some programmes cap the number of international students; apply early.",
          "Proof of funds and accommodation confirmation are important at the visa stage.",
        ],
      },
    ],
    journey:
      "Belgium is an excellent, central European choice — especially for master's students — when you treat the right community, its tuition and its visa rules correctly.",
    images: ['/countries/belgium/belgium-1.jpg', '/countries/belgium/belgium-2.jpeg', '/countries/belgium/belgium-3.jpg'],
  },
  {
    slug: "netherlands",
    name: "Netherlands",
    flag: "🇳🇱",
    position: 9,
    group: "two",
    costBand: "high",
    financialInsight:
      "Non-EU tuition varies widely; university-specific financial proof and immigration procedures apply.",
    intro:
      "The Netherlands delivers instruction in English across a large share of its programmes and is consistently near the top of international university rankings. Non-EU tuition varies widely by university, and each university runs its own admission and proof-of-funds process.",
    sections: [
      {
        title: "Why Choose the Netherlands?",
        items: [
          "English is the working language of many programmes and everyday life.",
          "Consistently high-ranked universities in business, engineering, and technology.",
          "Compact country with excellent transport and a strong international-student culture.",
          "Good post-study opportunities after graduation.",
        ],
      },
      {
        title: "Ideal Student Profile",
        items: [
          "Personality: independent, proactive, comfortable in a direct and structured culture.",
          "Academic: Dutch universities are strict about prior education; many bachelor's programmes require specific subjects or use NUFFIC/NARIC evaluation of older credentials.",
          "English: IELTS 6.0–6.5 typical for bachelor's; 6.5–7.0 for many master's.",
          "Financial: non-EU tuition varies widely by university (roughly €9,000–20,000+ per year for non-EU bachelor's programmes); students must prove funds (for example, a bank statement approximately covering the year) and often pay tuition and deposits before visa approval.",
          "Working: international students may work up to 16 hours per week during term, subject to rules, plus full-time in summer.",
        ],
      },
      {
        title: "Main Universities & Fields",
        body: "These are the institutions we most commonly help students with; the best fit depends on your field and budget.",
        table: {
          header: ["University", "Main Fields"],
          rows: [
            ["Delft University of Technology", "Engineering, Architecture, Technology"],
            ["Eindhoven University of Technology", "Engineering, Technology, Design"],
            ["University of Amsterdam", "Economics, Humanities, Social Sciences"],
            ["Erasmus University Rotterdam", "Economics, Business, Law"],
            ["Leiden University", "Law, Humanities, Social Sciences"],
            ["Utrecht University", "Sciences, Humanities, Medicine"],
            ["University of Groningen", "Economics, Science, Humanities"],
            ["Radboud University", "Business, Law, Science, Humanities"],
          ],
        },
      },
      {
        title: "How and When to Apply",
        items: [
          "Each university runs its own application portal and deadlines; some programmes have a single national application opening.",
          "The main intake is Autumn; financing must be arranged before visa processing begins.",
          "The recommended start is: 12 months before your intended intake.",
          "You pay the first tuition instalment or arrange funding through a recognised route before the immigration service processes your visa.",
        ],
      },
      {
        title: "A Note for Pakistani Students",
        items: [
          "The Netherlands is one of the most expensive destinations to prove — budget honestly before applying.",
          "Compare statutory tuition versus institutional tuition carefully by university.",
          "The Orientation Year scheme gives eligible graduates time after graduation to search for work.",
        ],
      },
    ],
    journey:
      "The Netherlands offers excellent English-taught education and genuine post-study opportunities — if you can meet its higher financial requirements honestly.",
    images: ['/countries/netherlands/netherlands-1.jpg', '/countries/netherlands/netherlands-2.jpg', '/countries/netherlands/netherlands-3.jpeg'],
  },
  {
    slug: "lithuania",
    name: "Lithuania",
    flag: "🇱🇹",
    position: 10,
    group: "two",
    costBand: "low",
    financialInsight:
      "Tuition varies by institution and programme; non-EU students generally need a Temporary Residence Permit for full-time study.",
    intro:
      "Lithuania is one of the most budget-friendly Schengen destinations with real state scholarships for international students. English-taught medicine, engineering and IT programmes are established, and the cost of living stays comparatively low.",
    sections: [
      {
        title: "Why Choose Lithuania?",
        items: [
          "One of the most affordable study destinations in the EU.",
          "State scholarships exist for international students and cover tuition plus support.",
          "English-taught medicine, engineering and IT programmes are well established.",
          "Safe, quiet and modern European environment.",
        ],
      },
      {
        title: "Ideal Student Profile",
        items: [
          "Personality: focused, practical, happy in a quieter student city.",
          "Academic: secondary school certificate recognised; medicine and health programmes may include entrance assessment or interview.",
          "English: IELTS 5.5–6.5 depending on programme.",
          "Financial: tuition varies by institution and programme; show proof of funds for visa/residence. State scholarships can remove most costs for selected students.",
          "Working: students may work alongside their studies with conditions.",
        ],
      },
      {
        title: "Main Universities & Fields",
        body: "These are the institutions we most commonly help students with; the best fit depends on your field and budget.",
        table: {
          header: ["University", "Main Fields"],
          rows: [
            ["Vilnius University", "Medicine, Science, Economics, Law"],
            ["Vilnius Gediminas Technical University", "Engineering, Architecture, Technology"],
            ["Kaunas University of Technology", "Engineering, IT, Technology"],
            ["Lithuanian University of Health Sciences", "Medicine, Dentistry, Pharmacy"],
            ["ISM University of Management and Economics", "Business, Economics"],
            ["Vytautas Magnus University", "Arts, Humanities, Economics"],
            ["Klaipėda University", "Engineering, Health, Marine Science"],
          ],
        },
      },
      {
        title: "How and When to Apply",
        items: [
          "Applications are managed on a centralised Lithuanian portal for most state universities.",
          "The main intake is Autumn; some programmes offer Spring.",
          "The recommended start is: 9–12 months before your intended intake.",
          "Non-EU students generally need a Temporary Residence Permit for full-time study in addition to university admission.",
        ],
      },
      {
        title: "Scholarships and Funding",
        items: [
          "Lithuanian state scholarships can cover tuition and often provide a stipend for selected international students.",
          "Some universities award tuition reductions or fee waivers for strong students.",
          "Funding is competitive and never guaranteed — we help you apply to what realistically fits your profile.",
        ],
      },
      {
        title: "A Note for Pakistani Students",
        items: [
          "Lithuania is a realistic low-cost EU option — but treat tuition, living costs and the residence-permit proof of funds as three separate numbers.",
          "Medicine and health programmes are competitive; start preparation early.",
          "Trusted, verified universities only — we verify institutions before you apply.",
        ],
      },
    ],
    journey:
      "Lithuania is a genuinely affordable EU destination with real scholarships — an underrated, honest option for budget-conscious Pakistani students.",
    images: ['/countries/lithuania/lithuania-2.jpg', '/countries/lithuania/lithuania-3.jpg'],
  },
  {
    slug: "cyprus",
    name: "Cyprus",
    flag: "🇨🇾",
    position: 11,
    group: "two",
    costBand: "medium",
    financialInsight:
      "For the Republic of Cyprus, student visa and residence financial documentation and bank history are important; tuition is institution and programme specific.",
    intro:
      "Cyprus is a small English-speaking EU island where English-taught programmes are the default. Medicine, nursing, business and IT programmes are common, with clear application timelines — but the visa and residence stage checks bank history and financial documentation carefully.",
    sections: [
      {
        title: "Why Choose Cyprus?",
        items: [
          "English-taught programmes are the default across the island.",
          "A safe, sunny and English-friendly environment.",
          "Medicine, nursing and health programmes with clear pathways.",
          "A comparatively straightforward application process.",
        ],
      },
      {
        title: "Ideal Student Profile",
        items: [
          "Personality: adaptable, comfortable on a smaller island, open to a smaller student community.",
          "Academic: secondary school certificate (12 years); medicine and health programmes may include assessment or interview.",
          "English: IELTS 6.0–6.5 or a university-administered English test for English-taught courses.",
          "Financial: tuition is institution and programme specific; visa/residence requires solid financial documentation and bank history.",
          "Working: international students may work part-time with conditions.",
        ],
      },
      {
        title: "Main Universities & Fields",
        body: "These are the institutions we most commonly help students with; the best fit depends on your field and budget.",
        table: {
          header: ["University", "Main Fields"],
          rows: [
            ["University of Cyprus", "Economics, Engineering, Humanities, Law"],
            ["University of Nicosia", "Medicine, Business, IT, Law"],
            ["European University Cyprus", "Medicine, Business, Law, Engineering"],
            ["Cyprus University of Technology", "Engineering, Health, Tourism, IT"],
            ["Frederick University", "Engineering, Architecture, Business"],
            ["Neapolis University Pafos", "Medicine, Business, Law"],
          ],
        },
      },
      {
        title: "How and When to Apply",
        items: [
          "Most universities run their own portals, with several intakes per year.",
          "The main intakes are Autumn and Spring; some programmes open Summer.",
          "The recommended start is: 9–12 months before your intended intake.",
          "Bank history and financial documentation are examined carefully at the visa/residence stage.",
        ],
      },
      {
        title: "A Note for Pakistani Students",
        items: [
          "Cyprus is English-first and quick to process — a realistic mid-cost option.",
          "Show genuine, documented bank history; surprising deposits are questioned.",
          "Medicine is competitive — prepare your academic evidence early.",
        ],
      },
    ],
    journey:
      "Cyprus is a practical, English-first EU choice — especially for medicine and health students who want a clear, faster route with honest documentation.",
    images: ['/countries/cyprus/cyprus-1.jpg', '/countries/cyprus/cyprus-2.jpg', '/countries/cyprus/cyprus-3.webp'],
  },
  {
    slug: "malta",
    name: "Malta",
    flag: "🇲🇹",
    position: 12,
    group: "two",
    costBand: "high",
    financialInsight:
      "English-language programmes are widely available; non-EU students need the appropriate visa and residence route.",
    intro:
      "Malta is a compact, English-speaking EU country where English-taught programmes are widely available. It suits students who want a smaller, manageable environment with a native English setting — but non-EU students must choose the correct visa and residence route, and the financial requirements are real.",
    sections: [
      {
        title: "Why Choose Malta?",
        items: [
          "English is an official language — no language barrier for daily life.",
          "Quiet, manageable island environment close to mainland Europe.",
          "Respected private colleges in business, tourism, IT and health.",
          "A mild Mediterranean climate all year round.",
        ],
      },
      {
        title: "Ideal Student Profile",
        items: [
          "Personality: independent, comfortable in a small country, ready to arrange life carefully.",
          "Academic: secondary school certificate (12 years) or a bachelor's for postgrad programmes; interviews for some programmes.",
          "English: IELTS 6.0 or an in-house English placement for many courses.",
          "Financial: non-EU students must meet the visa/residence financial proof requirements and secure accommodation before arrival.",
          "Working: international students may work part-time with conditions.",
        ],
      },
      {
        title: "Main Universities & Fields",
        body: "These are the institutions we most commonly help students with; the best fit depends on your field and budget.",
        table: {
          header: ["University", "Main Fields"],
          rows: [
            ["University of Malta", "Business, Health Sciences, Humanities"],
            ["GEMS Campus (in partnership)", "Medicine, Health Sciences"],
            ["Global College Malta", "Business, IT"],
            ["ITS Malta", "Tourism, Hospitality"],
            ["St Martin's Institute", "IT, Business"],
          ],
        },
      },
      {
        title: "How and When to Apply",
        items: [
          "Each institution runs its own admissions; intakes are usually Autumn with some Spring/Summer options.",
          "The recommended start is: 9–12 months before your intended intake.",
          "Secure accommodation and proof of funds before the visa/residence application — both are examined carefully.",
        ],
      },
      {
        title: "A Note for Pakistani Students",
        items: [
          "Malta's institutions are mostly private; compare tuition and total cost honestly across institutions.",
          "The visa/residence route must match your exact programme — we help you choose the correct one.",
          "Accommodation confirmation is essential before the visa stage.",
        ],
      },
    ],
    journey:
      "Malta is a stable, English-native EU option for students who value a small, safe island environment — with private-institution costs handled honestly.",
    images: ['/countries/malta/malta-1.jpg', '/countries/malta/malta-2.jpg', '/countries/malta/malta-3.jpg'],
  },
  {
    slug: "japan",
    name: "Japan",
    flag: "🇯🇵",
    position: 13,
    group: "two",
    costBand: "medium",
    financialInsight:
      "Financial capacity is assessed for the Certificate of Eligibility (COE) and visa; there is no single nationwide fixed bank-balance amount applicable to every student.",
    intro:
      "Japan's MEXT scholarship is one of the world's most prestigious full-funding awards, and national universities offer a very high-quality education at comparatively low tuition. Financial capacity is assessed for the Certificate of Eligibility and visa — there is no single fixed bank-balance amount for every student.",
    sections: [
      {
        title: "Why Choose Japan?",
        items: [
          "MEXT scholarship covers tuition, monthly stipend and airfare for selected students.",
          "World-class engineering, robotics, science and technology institutions.",
          "A safe, disciplined and modern society with a unique culture.",
          "National university tuition is comparatively low.",
        ],
      },
      {
        title: "Ideal Student Profile",
        items: [
          "Personality: disciplined, independent, culturally open and patient with bureaucracy.",
          "Academic: MEXT has country quotas and age thresholds per level; academic record counts heavily.",
          "Language: Japanese-taught programmes are the norm at subsidised national universities; Japanese language is recommended but some courses are offered in English.",
          "Financial: financial capacity is assessed for the COE/visa; there is no single nationwide fixed bank-balance amount — the assessed amount varies by your situation.",
          "Working: holders of student status can work part-time within weekly limits after obtaining permission.",
        ],
      },
      {
        title: "Main Universities & Fields",
        body: "These are the institutions we most commonly help students with; the best fit depends on your field and budget.",
        table: {
          header: ["University", "Main Fields"],
          rows: [
            ["University of Tokyo", "Engineering, Science, Economics, Law"],
            ["Tokyo Institute of Technology", "Engineering, Technology, Science"],
            ["Kyoto University", "Engineering, Science, Humanities"],
            ["Osaka University", "Engineering, Science, Medicine"],
            ["Waseda University", "Politics, Economics, Engineering"],
            ["Keio University", "Economics, Engineering, Business"],
            ["Nagoya University", "Engineering, Science, Economics"],
            ["Tohoku University", "Engineering, Science, Medicine"],
          ],
        },
      },
      {
        title: "How and When to Apply",
        items: [
          "MEXT scholarship applications are nationalised and long — the full timeline begins 12 months or more before the April intake.",
          "University-taught programmes have their own application dates; Japanese-language students follow language school cycles.",
          "The recommended start is: 12–18 months before your intended intake.",
          "The Certificate of Eligibility (COE) is issued through your university before you apply for the visa.",
        ],
      },
      {
        title: "Scholarships and Funding",
        items: [
          "MEXT — full funding for selected students: tuition, monthly stipend, airfare and (in many cases) accommodation.",
          "Individual universities and the Japanese government offer additional scholarships and tuition reductions.",
          "Funding is competitive and never guaranteed — we help you apply to what realistically fits your profile.",
        ],
      },
      {
        title: "A Note for Pakistani Students",
        items: [
          "Japan is a long-horizon plan — start Japanese language early and prepare a strong academic record.",
          "The COE/visa process assesses your financial capacity case by case; prepare clean, verifiable documentation.",
          "English-taught options exist but are fewer; Japanese opens far more doors.",
        ],
      },
    ],
    journey:
      "Japan is for disciplined students planning ahead — MEXT and national university options make it one of the most rewarding funded routes for the right profile.",
    images: ['/countries/japan/japan-1.jpg', '/countries/japan/japan-2.jpeg', '/countries/japan/japan-3.webp'],
  },
  {
    slug: "china",
    name: "China",
    flag: "🇨🇳",
    position: 14,
    group: "two",
    costBand: "low",
    financialInsight:
      "Chinese Government Scholarships can provide substantial or full funding depending on programme and award category.",
    intro:
      "China's government and provincial scholarships regularly fund international students in engineering, medicine (MBBS) and language programmes. Cities vary hugely in cost, and financial capacity is assessed for the visa — but for the right profile, China is one of the most generous fully-funded destinations.",
    sections: [
      {
        title: "Why Choose China?",
        items: [
          "Chinese Government Scholarships (CSC) can provide substantial or full funding depending on programme and award category.",
          "Strong engineering, MBBS (medicine in English) and language programmes.",
          "Relatively low self-funded tuition and living costs across most cities.",
          "A rapidly growing economy with huge career connections back home.",
        ],
      },
      {
        title: "Ideal Student Profile",
        items: [
          "Personality: adaptable, open-minded, comfortable with a very different culture.",
          "Academic: high school or bachelor's certificate verified by the university; CSC applies age and academic thresholds per level.",
          "Language: HSK 4 for Chinese-taught programmes; IELTS 6+ for English-taught programmes.",
          "Financial: self-funded costs are low; CSC scholarships typically cover tuition, accommodation, living stipend and health insurance. Visa requires proof of financial capacity.",
          "Working: international students may work with conditions; part-time work is limited.",
        ],
      },
      {
        title: "Main Universities & Fields",
        body: "These are the institutions we most commonly help students with; the best fit depends on your field and budget.",
        table: {
          header: ["University", "Main Fields"],
          rows: [
            ["Tsinghua University", "Engineering, Technology, Economics, Law"],
            ["Peking University", "Medicine, Economics, Law, Science"],
            ["Fudan University", "Medicine, Economics, Science, Engineering"],
            ["Shanghai Jiao Tong University", "Engineering, Medicine, Technology"],
            ["Zhejiang University", "Engineering, Medicine, Science"],
            ["Huazhong University of Science and Technology", "Engineering, Medicine, Technology"],
            ["Beijing Language and Culture University", "Chinese Language, Humanities"],
            ["Harbin Institute of Technology", "Engineering, Aerospace, Technology"],
          ],
        },
      },
      {
        title: "How and When to Apply",
        items: [
          "CSC scholarship applications follow the national call, usually opening about a year before the Autumn intake and closing in early spring.",
          "University-specific portals handle self-funded applications and some CSC categories.",
          "The recommended start is: 12 months before your intended intake.",
          "CSC-funded students typically receive a fast-track admission and visa process once awarded.",
        ],
      },
      {
        title: "Scholarships and Funding",
        items: [
          "Chinese Government Scholarship (CSC) — substantial or full funding depending on category.", 
          "Provincial, university and Confucius Institute scholarships also fund international students.",
          "MBBS programmes are often covered in English under CSC categories.",
          "Funding is competitive and never guaranteed — we help you apply to what realistically fits your profile.",
        ],
      },
      {
        title: "A Note for Pakistani Students",
        items: [
          "China is one of the most generous funded destinations — but the visa requires proof of financial capacity and careful document verification.",
          "Language ability matters: HSK for Chinese-taught, IELTS for English-taught programmes.",
          "MBBS seats are highly competitive; strong grades matter.",
        ],
      },
    ],
    journey:
      "China offers a world-class, genuinely fundable pathway for engineering, medicine and language students — especially when CSC funding is matched to your profile.",
    images: ['/countries/china/china-1.webp', '/countries/china/china-2.jpg', '/countries/china/china-3.jpg'],
  },
];

export function getCountry(slug: string): CountryDestination | undefined {
  return countries.find((item) => item.slug === slug);
}

export function getCountryByPosition(position: number): CountryDestination | undefined {
  return countries.find((item) => item.position === position);
}