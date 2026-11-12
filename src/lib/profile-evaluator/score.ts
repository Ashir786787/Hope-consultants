import {
  ADVICE_COPY,
  BANK_OPTION_IDS,
  DESTINATION_GROUPS,
  ENGLISH_OPTION_IDS,
  GAP_OPTION_IDS,
  PROGRAMS,
  QUESTION_KEYS,
} from "@/lib/data/profile-evaluator";
import type {
  AdviceCard,
  EvaluatorDestination,
  EvaluatorOption,
  EvaluatorProgram,
  EvaluatorQuestion,
  ProgramLevel,
} from "@/lib/data/profile-evaluator";

export type EvaluatorAnswers = Record<string, string>;

export type EvaluatorRecapItem = {
  question: string;
  answer: string;
};

export type EvaluatorResult = {
  score: number;
  tag: string;
  destinations: EvaluatorDestination[];
  advice: AdviceCard[];
  recap: EvaluatorRecapItem[];
};

export function programFor(level: ProgramLevel): EvaluatorProgram {
  const program = PROGRAMS.find((item) => item.id === level);
  if (!program) {
    throw new Error(`Unknown program level: ${level}`);
  }
  return program;
}

function questionFor(program: EvaluatorProgram, key: string): EvaluatorQuestion {
  const question = program.questions.find((item) => item.key === key);
  if (!question) {
    throw new Error(`Unknown question key: ${key}`);
  }
  return question;
}

function selectedOption(
  question: EvaluatorQuestion,
  answers: EvaluatorAnswers
): EvaluatorOption | undefined {
  const id = answers[question.key];
  if (!id) return undefined;
  return question.options.find((option) => option.id === id);
}

export function visibleQuestions(
  program: EvaluatorProgram,
  answers: EvaluatorAnswers
): EvaluatorQuestion[] {
  return program.questions.filter((question) => {
    if (!question.visibleWhen) return true;
    return answers[question.visibleWhen.question] === question.visibleWhen.option;
  });
}

export function scoreFor(program: EvaluatorProgram, answers: EvaluatorAnswers): number {
  const total = visibleQuestions(program, answers).reduce((sum, question) => {
    const option = selectedOption(question, answers);
    return sum + (option ? option.points : 0);
  }, 0);
  return Math.round(total * 100) / 100;
}

export function tagFor(score: number): string {
  if (score >= 8.5) return "Excellent Profile";
  if (score >= 7) return "Strong Profile";
  if (score >= 5.5) return "Moderate Profile";
  return "Needs Improvement";
}

export function destinationsFor(answers: EvaluatorAnswers): EvaluatorDestination[] {
  const bank = answers[QUESTION_KEYS.bank];
  const group = DESTINATION_GROUPS.find((entry) => entry.forOptions.includes(bank));
  return group ? group.countries : [];
}

function languageAdvice(program: EvaluatorProgram, answers: EvaluatorAnswers): string {
  const english = answers[QUESTION_KEYS.english];
  if (english === ENGLISH_OPTION_IDS.moi) return ADVICE_COPY.language.moi;
  if (english !== ENGLISH_OPTION_IDS.ielts) return ADVICE_COPY.language.none;

  const cefr = questionFor(program, QUESTION_KEYS.cefr);
  const best = Math.max(...cefr.options.map((option) => option.points));
  const chosen = selectedOption(cefr, answers);
  return chosen && chosen.points >= best
    ? ADVICE_COPY.language.strongBand
    : ADVICE_COPY.language.lowerBand;
}

export function adviceFor(program: EvaluatorProgram, answers: EvaluatorAnswers): AdviceCard[] {
  const academic = selectedOption(questionFor(program, QUESTION_KEYS.academic), answers);
  const gap = answers[QUESTION_KEYS.studyGap];
  const bank = answers[QUESTION_KEYS.bank];

  return [
    {
      icon: ADVICE_COPY.academic.icon,
      title: ADVICE_COPY.academic.title,
      body:
        academic && academic.points >= 1.5
          ? ADVICE_COPY.academic.strong
          : ADVICE_COPY.academic.standard,
    },
    {
      icon: ADVICE_COPY.language.icon,
      title: ADVICE_COPY.language.title,
      body: languageAdvice(program, answers),
    },
    {
      icon: ADVICE_COPY.studyGap.icon,
      title: ADVICE_COPY.studyGap.title,
      body: gap === GAP_OPTION_IDS.none ? ADVICE_COPY.studyGap.none : ADVICE_COPY.studyGap.present,
    },
    {
      icon: ADVICE_COPY.financial.icon,
      title: ADVICE_COPY.financial.title,
      body:
        bank === BANK_OPTION_IDS.under30
          ? ADVICE_COPY.financial.limited
          : ADVICE_COPY.financial.general,
    },
  ];
}

export function recapFor(
  program: EvaluatorProgram,
  answers: EvaluatorAnswers
): EvaluatorRecapItem[] {
  return visibleQuestions(program, answers).map((question) => {
    const option = selectedOption(question, answers);
    return { question: question.label, answer: option ? option.label : "" };
  });
}

export function resultFor(program: EvaluatorProgram, answers: EvaluatorAnswers): EvaluatorResult {
  const score = scoreFor(program, answers);
  return {
    score,
    tag: tagFor(score),
    destinations: destinationsFor(answers),
    advice: adviceFor(program, answers),
    recap: recapFor(program, answers),
  };
}

export function summaryText(program: EvaluatorProgram, result: EvaluatorResult): string {
  return [
    "Hope Consultants - Student Profile Evaluation Report",
    "",
    `Program level: ${program.label}`,
    `Overall score: ${result.score.toFixed(2)} / 10`,
    `Profile status: ${result.tag}`,
    "",
    "Answers:",
    ...result.recap.map((item) => `- ${item.question} ${item.answer}`),
    "",
    "Recommended destinations:",
    ...result.destinations.map((country) => `- ${country.name}`),
  ].join("\n");
}

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function csvText(program: EvaluatorProgram, result: EvaluatorResult): string {
  const rows: string[][] = [
    ["Field", "Value"],
    ["Program level", program.label],
    ["Overall score", result.score.toFixed(2)],
    ["Profile status", result.tag],
    ...result.recap.map((item) => [item.question, item.answer]),
    ["Recommended destinations", result.destinations.map((country) => country.name).join("; ")],
  ];
  return rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
}

export function mailtoHref(
  recipient: string,
  program: EvaluatorProgram,
  result: EvaluatorResult
): string {
  const subject = "Hope Consultants - Student Profile Evaluation Report";
  const body = summaryText(program, result);
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
