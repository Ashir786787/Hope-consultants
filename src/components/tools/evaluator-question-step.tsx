"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "cn";
import type { EvaluatorQuestion } from "@/lib/data/profile-evaluator";

export type EvaluatorQuestionStepProps = {
  question: EvaluatorQuestion;
  value: string | undefined;
  isLast: boolean;
  onSelect: (optionId: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function EvaluatorQuestionStep({
  question,
  value,
  isLast,
  onSelect,
  onBack,
  onNext,
}: EvaluatorQuestionStepProps) {
  return (
    <div className="hope-card hope-card--light flex flex-col gap-6 p-5 sm:p-8">
      <fieldset className="flex flex-col gap-4">
        <legend className="font-display text-xl font-semibold leading-snug text-hope-midnight sm:text-2xl">
          {question.label}
        </legend>
        <div className="grid gap-3">
          {question.options.map((option) => {
            const id = `${question.key}-${option.id}`;
            const checked = value === option.id;
            return (
              <div key={option.id} className="relative">
                <input
                  id={id}
                  type="radio"
                  name={question.key}
                  value={option.id}
                  checked={checked}
                  onChange={() => onSelect(option.id)}
                  className="peer sr-only"
                />
                <label
                  htmlFor={id}
                  className={cn(
                    "flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-base font-medium transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-hope-ember",
                    checked
                      ? "border-hope-midnight bg-hope-midnight text-hope-white"
                      : "border-hope-midnight/15 bg-hope-white text-hope-midnight hover:border-hope-midnight/40 hover:bg-[rgb(var(--hope-ember-rgb)/0.06)]"
                  )}
                >
                  <span
                    className={cn(
                      "grid size-5 shrink-0 place-items-center rounded-full border",
                      checked ? "border-hope-ember" : "border-hope-midnight/30"
                    )}
                  >
                    <span
                      className={cn(
                        "size-2.5 rounded-full bg-hope-ember transition-transform duration-200",
                        checked ? "scale-100" : "scale-0"
                      )}
                    />
                  </span>
                  <span>{option.label}</span>
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Back
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={onNext}
          disabled={!value}
          className="w-full sm:w-auto"
        >
          {isLast ? "Calculate Score" : "Next"}
          {isLast ? null : (
            <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  );
}
