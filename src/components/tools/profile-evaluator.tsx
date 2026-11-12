"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { EvaluatorProgramStep } from "@/components/tools/evaluator-program-step";
import { EvaluatorQuestionStep } from "@/components/tools/evaluator-question-step";
import { EvaluatorResults } from "@/components/tools/evaluator-results";
import { ENGLISH_OPTION_IDS, QUESTION_KEYS, type ProgramLevel } from "@/lib/data/profile-evaluator";
import {
  programFor,
  resultFor,
  visibleQuestions,
  type EvaluatorAnswers,
} from "@/lib/profile-evaluator/score";

type Phase = "program" | "questions" | "results";

export function ProfileEvaluator({ recipientEmail }: { recipientEmail: string }) {
  const [phase, setPhase] = useState<Phase>("program");
  const [programId, setProgramId] = useState<ProgramLevel | null>(null);
  const [answers, setAnswers] = useState<EvaluatorAnswers>({});
  const [index, setIndex] = useState(0);
  const stepRef = useRef<HTMLDivElement>(null);

  const program = programId ? programFor(programId) : null;
  const questions = useMemo(
    () => (program ? visibleQuestions(program, answers) : []),
    [program, answers]
  );
  const current = phase === "questions" ? questions[index] : undefined;
  const result = useMemo(
    () => (program && phase === "results" ? resultFor(program, answers) : null),
    [program, phase, answers]
  );

  useEffect(() => {
    if (phase === "program") return;
    stepRef.current?.focus();
  }, [phase, index]);

  function selectProgram(level: ProgramLevel) {
    if (level !== programId) {
      setAnswers({});
      setIndex(0);
    }
    setProgramId(level);
    setPhase("questions");
  }

  function selectAnswer(key: string, optionId: string) {
    setAnswers((previous) => {
      const next = { ...previous, [key]: optionId };
      if (key === QUESTION_KEYS.english && optionId !== ENGLISH_OPTION_IDS.ielts) {
        delete next[QUESTION_KEYS.cefr];
      }
      return next;
    });
  }

  function goNext() {
    if (!current) return;
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      return;
    }
    setPhase("results");
  }

  function goBack() {
    if (index === 0) {
      setPhase("program");
      return;
    }
    setIndex(index - 1);
  }

  function reset() {
    setPhase("program");
    setProgramId(null);
    setAnswers({});
    setIndex(0);
  }

  return (
    <div className="evaluator-page flex flex-col gap-6">
      {phase === "questions" && current ? (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
          <p className="text-sm font-semibold text-hope-fog">
            {`Question ${index + 1} of ${questions.length}`}
          </p>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-hope-midnight/10"
            role="progressbar"
            aria-label="Assessment progress"
            aria-valuemin={0}
            aria-valuemax={questions.length}
            aria-valuenow={index + 1}
          >
            <div
              className="h-full w-full origin-left rounded-full bg-hope-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `scaleX(${(index + 1) / questions.length})` }}
            />
          </div>
        </div>
      ) : null}

      <div ref={stepRef} tabIndex={-1} className="outline-none">
        {phase === "program" ? <EvaluatorProgramStep onSelect={selectProgram} /> : null}
        {phase === "questions" && current ? (
          <EvaluatorQuestionStep
            question={current}
            value={answers[current.key]}
            isLast={index + 1 === questions.length}
            onSelect={(optionId) => selectAnswer(current.key, optionId)}
            onBack={goBack}
            onNext={goNext}
          />
        ) : null}
        {phase === "results" && program && result ? (
          <EvaluatorResults
            program={program}
            result={result}
            recipientEmail={recipientEmail}
            onReset={reset}
          />
        ) : null}
      </div>
    </div>
  );
}
