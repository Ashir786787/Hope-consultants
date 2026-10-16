import Link from "next/link";

import { Button } from "@/components/ui/button";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import type { FormDefinition } from "@/lib/forms/types";

export function FormWelcome({ definition }: { definition: FormDefinition }) {
  const totalPages = definition.sections.length + 1;
  const firstSection = definition.sections[0];
  const { welcome } = definition;

  return (
    <div className="flex flex-col gap-10">
      <OnboardingProgress page={1} total={totalPages} label={`Page 1 of ${totalPages}`} />

      <div className="flex flex-col gap-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-hope-ember">
          Hope Consultants
        </p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {welcome.heading}
        </h1>
        <p className="max-w-prose text-lg leading-8 text-hope-midnight/85">{welcome.intro}</p>
        {welcome.body ? (
          <p className="max-w-prose text-base leading-7 text-hope-midnight">{welcome.body}</p>
        ) : null}
        {welcome.benefits && welcome.benefits.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {welcome.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-base leading-7">
                <span
                  aria-hidden="true"
                  className="mt-2.5 size-1.5 shrink-0 rounded-full bg-hope-ember"
                />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {welcome.accuracyNote ? (
          <p className="max-w-prose text-base leading-7 text-hope-midnight">
            {welcome.accuracyNote}
          </p>
        ) : null}
        {welcome.privacyNote ? (
          <p className="rounded-xl bg-hope-midnight/5 px-4 py-3 text-sm leading-6 text-hope-midnight/85">
            {welcome.privacyNote}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 border-t border-hope-midnight/10 pt-6">
        <Button
          nativeButton={false}
          render={<Link href={`/${definition.slug}/${firstSection.slug}`} />}
          className="min-h-11 w-full sm:w-auto"
        >
          Start the form
        </Button>
        {welcome.closing ? (
          <p className="text-sm leading-6 text-hope-fog">{welcome.closing}</p>
        ) : null}
      </div>
    </div>
  );
}
