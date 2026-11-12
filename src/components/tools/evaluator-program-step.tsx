"use client";

import { ArrowRight } from "lucide-react";

import { PROGRAMS, type ProgramLevel } from "@/lib/data/profile-evaluator";

export function EvaluatorProgramStep({ onSelect }: { onSelect: (level: ProgramLevel) => void }) {
  return (
    <div className="hope-card hope-card--light flex flex-col gap-6 p-5 sm:p-8">
      <h2 className="font-display text-xl font-semibold leading-snug text-hope-midnight sm:text-2xl">
        Which degree are you applying for?
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {PROGRAMS.map((program) => (
          <button
            key={program.id}
            type="button"
            onClick={() => onSelect(program.id)}
            className="group flex min-h-32 flex-col items-start gap-2 rounded-2xl border border-hope-midnight/15 bg-hope-white p-5 text-left transition-colors hover:border-hope-ember hover:bg-[rgb(var(--hope-ember-rgb)/0.06)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
          >
            <span className="font-display text-lg font-semibold text-hope-midnight">
              {program.label}
            </span>
            <span className="text-sm leading-6 text-hope-fog">{program.description}</span>
            <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-hope-midnight">
              Start
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
