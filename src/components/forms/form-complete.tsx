import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import type { FormDefinition } from "@/lib/forms/types";

export function FormComplete({ definition }: { definition: FormDefinition }) {
  const totalPages = definition.sections.length + 1;
  const { confirmation } = definition;

  return (
    <div className="flex flex-col gap-10">
      <OnboardingProgress
        page={totalPages}
        total={totalPages}
        label={`Page ${totalPages} of ${totalPages}`}
      />

      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {confirmation.heading}
        </h1>
        <p className="max-w-prose text-lg leading-8 text-hope-midnight/85">
          {confirmation.intro}
        </p>
        {confirmation.introLabel ? (
          <p className="text-base font-semibold text-hope-midnight">{confirmation.introLabel}</p>
        ) : null}
        {confirmation.steps && confirmation.steps.length > 0 ? (
          <ol className="flex flex-col gap-4">
            {confirmation.steps.map((step, index) => (
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
        ) : null}
        {confirmation.note ? (
          <p className="rounded-xl bg-hope-midnight/5 px-4 py-3 text-sm leading-6 text-hope-midnight/85">
            {confirmation.note}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 border-t border-hope-midnight/10 pt-6">
        {confirmation.closing ? (
          <p className="max-w-prose text-base leading-7 text-hope-midnight">
            {confirmation.closing}
          </p>
        ) : null}
        {confirmation.signature ? (
          <p className="text-sm font-semibold text-hope-fog">{confirmation.signature}</p>
        ) : null}
      </div>
    </div>
  );
}
