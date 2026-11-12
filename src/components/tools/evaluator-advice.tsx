import type { ReactNode } from "react";
import { CalendarClock, GraduationCap, Languages, Wallet } from "lucide-react";

import type { AdviceCard, AdviceIcon } from "@/lib/data/profile-evaluator";

const ICONS: Record<AdviceIcon, ReactNode> = {
  academic: <GraduationCap className="size-5" strokeWidth={1.75} aria-hidden="true" />,
  language: <Languages className="size-5" strokeWidth={1.75} aria-hidden="true" />,
  gap: <CalendarClock className="size-5" strokeWidth={1.75} aria-hidden="true" />,
  financial: <Wallet className="size-5" strokeWidth={1.75} aria-hidden="true" />,
};

export function EvaluatorAdvice({ advice }: { advice: AdviceCard[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {advice.map((card) => (
        <article
          key={card.title}
          className="hope-card hope-card--light flex h-full flex-col gap-3 p-5 sm:p-6"
        >
          <span className="grid size-10 place-items-center rounded-full bg-[rgb(var(--hope-ember-rgb)/0.16)] text-hope-midnight">
            {ICONS[card.icon]}
          </span>
          <h4 className="font-display text-lg font-semibold text-hope-midnight">{card.title}</h4>
          <p className="text-sm leading-6 text-hope-fog">{card.body}</p>
        </article>
      ))}
    </div>
  );
}
