import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { OnboardingDraftProvider } from "@/components/onboarding/onboarding-draft";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { OnboardingSaveIndicator } from "@/components/onboarding/onboarding-save-indicator";
import { PersonalForm } from "@/components/onboarding/sections/personal-form";
import { EducationForm } from "@/components/onboarding/sections/education-form";
import { PreferencesForm } from "@/components/onboarding/sections/preferences-form";
import { FinancialForm } from "@/components/onboarding/sections/financial-form";
import { DocumentsForm } from "@/components/onboarding/sections/documents-form";
import { CareerForm } from "@/components/onboarding/sections/career-form";
import { ConsentForm } from "@/components/onboarding/sections/consent-form";
import { toDraftAnswers } from "@/lib/onboarding/answers";
import { readDraftToken } from "@/lib/onboarding/draft-cookie";
import { loadDraft } from "@/lib/onboarding/submission";
import {
  findOnboardingSection,
  previousSectionHref,
  progressLabel,
} from "@/lib/onboarding/sections";
import type { OnboardingSectionKey } from "@/lib/onboarding/sections";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

const FORMS: Record<OnboardingSectionKey, () => React.JSX.Element> = {
  personal: PersonalForm,
  education: EducationForm,
  preferences: PreferencesForm,
  financial: FinancialForm,
  documents: DocumentsForm,
  career: CareerForm,
  consent: ConsentForm,
};

async function loadSectionState() {
  try {
    const token = await readDraftToken();
    const stored = token ? await loadDraft(token).catch(() => null) : null;
    return toDraftAnswers(stored?.answers);
  } catch {
    return toDraftAnswers(null);
  }
}

export default async function OnboardingSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: slug } = await params;
  const section = findOnboardingSection(slug);
  if (!section) notFound();

  const answers = await loadSectionState();
  const Form = FORMS[section.key];
  const backHref = previousSectionHref(section.slug);
  const isLast = section.key === "consent";

  return (
    <OnboardingDraftProvider section={section.key} initialDraft={answers}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <OnboardingProgress
            page={section.order}
            total={8}
            label={progressLabel(section.order)}
          />
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-hope-ember">
            Section {section.order - 1} of 7
          </p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {section.title}
          </h1>
          <p className="max-w-prose text-base leading-7 text-hope-midnight/85">
            {section.description}
          </p>
        </div>

        <Form />

        <div className="flex flex-col gap-4 border-t border-hope-midnight/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button
            nativeButton={false}
            render={<Link href={backHref ?? "/onboarding"} />}
            variant="secondary"
            className="min-h-11 w-full sm:w-auto"
          >
            Back
          </Button>
          <OnboardingSaveIndicator />
        </div>

        <p className="text-sm leading-6 text-hope-fog">
          {isLast
            ? "Your answers are sent only to the Hope Consultants team."
            : "Your answers are saved as you go, so you can close this page and come back later on the same device."}
        </p>
      </div>
    </OnboardingDraftProvider>
  );
}