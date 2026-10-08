"use client";

import { useSectionValues } from "@/components/onboarding/onboarding-draft";
import { OnboardingSubmitForm } from "@/components/onboarding/onboarding-section-form";
import { ConsentCheckbox } from "@/components/onboarding/onboarding-inputs";

export function ConsentForm() {
  const { flag, setValue } = useSectionValues("consent");

  return (
    <OnboardingSubmitForm>
      <ConsentCheckbox
        id="confirmAccuracy"
        label="I confirm that the information I have provided is true and correct to the best of my knowledge."
        checked={flag("confirmAccuracy")}
        onChange={(checked) => setValue("confirmAccuracy", checked)}
      />
      <ConsentCheckbox
        id="allowContact"
        label="I allow HOPE CONSULTANTS to contact me on WhatsApp, by email or by phone about my application."
        checked={flag("allowContact")}
        onChange={(checked) => setValue("allowContact", checked)}
      />
    </OnboardingSubmitForm>
  );
}