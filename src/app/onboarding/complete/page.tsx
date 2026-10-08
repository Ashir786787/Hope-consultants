import type { Metadata } from "next";

import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { CONFIRMATION_COPY, TOTAL_PAGES, progressLabel } from "@/lib/onboarding/sections";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function OnboardingCompletePage() {
  return (
    <div className="flex flex-col gap-10">
      <OnboardingProgress page={TOTAL_PAGES} total={TOTAL_PAGES} label={progressLabel(TOTAL_PAGES)} />

      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {CONFIRMATION_COPY.heading}
        </h1>
        <p className="max-w-prose text-lg leading-8 text-hope-midnight/85">
          {CONFIRMATION_COPY.intro}
        </p>
        <p className="text-base font-semibold text-hope-midnight">{CONFIRMATION_COPY.introLabel}</p>
        <ol className="flex flex-col gap-4">
          {CONFIRMATION_COPY.steps.map((step, index) => (
            <li key={step} className="flex items-start gap-3 text-base leading-7">
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-hope-ember text-sm font-bold text-hope-midnight"
              >
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="rounded-xl bg-hope-midnight/5 px-4 py-3 text-sm leading-6 text-hope-midnight/85">
          {CONFIRMATION_COPY.note}
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-hope-midnight/10 pt-6">
        <p className="max-w-prose text-base leading-7 text-hope-midnight">
          {CONFIRMATION_COPY.closing}
        </p>
        <p className="text-sm font-semibold text-hope-fog">{CONFIRMATION_COPY.signature}</p>
      </div>
    </div>
  );
}