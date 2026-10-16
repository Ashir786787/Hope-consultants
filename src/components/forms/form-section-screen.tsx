"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { FormDraftProvider } from "@/components/forms/form-draft";
import { FormSaveIndicator } from "@/components/forms/form-save-indicator";
import { FormSection } from "@/components/forms/form-section";
import type { DraftAnswers } from "@/lib/forms/answers";
import type { FormDefinition } from "@/lib/forms/types";

export function FormSectionScreen({
  definition,
  sectionKey,
  initialAnswers,
  draftEndpoint,
  submitEndpoint,
  completeHref,
}: {
  definition: FormDefinition;
  sectionKey: string;
  initialAnswers: DraftAnswers;
  draftEndpoint: string;
  submitEndpoint: string;
  completeHref: string;
}) {
  const index = definition.sections.findIndex((section) => section.key === sectionKey);
  const section = definition.sections[index];
  const totalPages = definition.sections.length + 1;
  const page = index + 2;
  const isLast = index === definition.sections.length - 1;
  const baseHref = `/${definition.slug}`;
  const backHref = index === 0 ? baseHref : `${baseHref}/${definition.sections[index - 1].slug}`;
  const nextHref = isLast ? completeHref : `${baseHref}/${definition.sections[index + 1].slug}`;
  const uploadEndpoint = `/api/forms/${definition.key}/uploads`;

  return (
    <FormDraftProvider
      definition={definition}
      section={sectionKey}
      draftEndpoint={draftEndpoint}
      initialDraft={initialAnswers}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <OnboardingProgress
            page={page}
            total={totalPages}
            label={`Page ${page} of ${totalPages}`}
          />
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-hope-ember">
            Section {index + 1} of {definition.sections.length}
          </p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {section.title}
          </h1>
          <p className="max-w-prose text-base leading-7 text-hope-midnight/85">
            {section.description}
          </p>
        </div>

        <FormSection
          definition={definition}
          section={section}
          isLast={isLast}
          nextHref={nextHref}
          completeHref={completeHref}
          submitEndpoint={submitEndpoint}
          uploadEndpoint={uploadEndpoint}
        />

        <div className="flex flex-col gap-4 border-t border-hope-midnight/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button
            nativeButton={false}
            render={<Link href={backHref} />}
            variant="secondary"
            className="min-h-11 w-full sm:w-auto"
          >
            Back
          </Button>
          <FormSaveIndicator />
        </div>

        <p className="text-sm leading-6 text-hope-fog">
          {isLast
            ? "Your answers are sent only to the Hope Consultants team."
            : "Your answers are saved as you go, so you can close this page and come back later on the same device."}
        </p>
      </div>
    </FormDraftProvider>
  );
}
