import Link from "next/link";

import { Button } from "@/components/ui/button";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { TOTAL_PAGES, WELCOME_COPY, progressLabel, sectionHref } from "@/lib/onboarding/sections";

export default function OnboardingWelcomePage() {
  return (
    <div className="flex flex-col gap-10">
      <OnboardingProgress page={1} total={TOTAL_PAGES} label={progressLabel(1)} />

      <div className="flex flex-col gap-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-hope-ember">
          Hope Consultants
        </p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {WELCOME_COPY.heading}
        </h1>
        <p className="max-w-prose text-lg leading-8 text-hope-midnight/85">{WELCOME_COPY.intro}</p>
        <p className="max-w-prose text-base leading-7 text-hope-midnight">{WELCOME_COPY.body}</p>
        <ul className="flex flex-col gap-2">
          {WELCOME_COPY.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3 text-base leading-7">
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-hope-ember" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <p className="max-w-prose text-base leading-7 text-hope-midnight">
          {WELCOME_COPY.accuracyNote}
        </p>
        <p className="rounded-xl bg-hope-midnight/5 px-4 py-3 text-sm leading-6 text-hope-midnight/85">
          {WELCOME_COPY.privacyNote}
        </p>
      </div>

      <div className="flex flex-col gap-4 border-t border-hope-midnight/10 pt-6">
        <Button
          nativeButton={false}
          render={<Link href={sectionHref("personal-information")} />}
          className="min-h-11 w-full sm:w-auto"
        >
          Start the form
        </Button>
        <p className="text-sm leading-6 text-hope-fog">{WELCOME_COPY.closing}</p>
      </div>
    </div>
  );
}