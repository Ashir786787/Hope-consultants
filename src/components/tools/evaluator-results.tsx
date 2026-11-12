"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EvaluatorActions } from "@/components/tools/evaluator-actions";
import { EvaluatorAdvice } from "@/components/tools/evaluator-advice";
import { EvaluatorDestinationGrid } from "@/components/tools/evaluator-destination-grid";
import { EvaluatorScoreGauge } from "@/components/tools/evaluator-score-gauge";
import type { EvaluatorProgram } from "@/lib/data/profile-evaluator";
import {
  csvText,
  mailtoHref,
  summaryText,
  type EvaluatorResult,
} from "@/lib/profile-evaluator/score";

export type EvaluatorResultsProps = {
  program: EvaluatorProgram;
  result: EvaluatorResult;
  recipientEmail: string;
  onReset: () => void;
};

export function EvaluatorResults({
  program,
  result,
  recipientEmail,
  onReset,
}: EvaluatorResultsProps) {
  const summary = summaryText(program, result);
  const csv = csvText(program, result);
  const mailto = mailtoHref(recipientEmail, program, result);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
      <div className="hidden print:mb-2 print:block">
        <p className="font-display text-2xl font-semibold text-hope-midnight">
          Hope Consultants - Student Profile Evaluation Report
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        {`Assessment complete. Your score is ${result.score.toFixed(2)} out of 10. ${result.tag}.`}
      </p>

      <div className="hope-card hope-card--light flex flex-col items-center gap-6 p-6 sm:p-10">
        <h2 className="font-display text-2xl font-semibold text-hope-midnight sm:text-3xl">
          Your result
        </h2>
        <EvaluatorScoreGauge score={result.score} tag={result.tag} />
      </div>

      <section className="flex flex-col gap-4" aria-labelledby="evaluator-destinations">
        <h3
          id="evaluator-destinations"
          className="font-display text-xl font-semibold text-hope-midnight sm:text-2xl"
        >
          Recommended destinations
        </h3>
        <EvaluatorDestinationGrid destinations={result.destinations} />
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="evaluator-advice">
        <h3
          id="evaluator-advice"
          className="font-display text-xl font-semibold text-hope-midnight sm:text-2xl"
        >
          Personalised advice
        </h3>
        <EvaluatorAdvice advice={result.advice} />
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="evaluator-recap">
        <h3
          id="evaluator-recap"
          className="font-display text-xl font-semibold text-hope-midnight sm:text-2xl"
        >
          Your answers
        </h3>
        <dl className="rounded-2xl border border-hope-midnight/10 bg-hope-white px-5 py-2 sm:px-6">
          {result.recap.map((item) => (
            <div
              key={item.question}
              className="flex flex-col gap-1 border-b border-hope-midnight/10 py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <dt className="text-sm leading-6 font-semibold text-hope-fog">{item.question}</dt>
              <dd className="text-base font-semibold text-hope-midnight sm:text-right">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <EvaluatorActions csv={csv} mailto={mailto} summary={summary} onReset={onReset} />

      <div className="evaluator-no-print flex flex-col items-start gap-4 rounded-2xl bg-hope-midnight p-6 text-hope-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <h3 className="font-display text-xl font-semibold text-hope-white">
          Talk to an advisor
        </h3>
        <Button nativeButton={false} render={<Link href="/contact" />} size="lg">
          Book a Free Consultation
        </Button>
      </div>
    </div>
  );
}
