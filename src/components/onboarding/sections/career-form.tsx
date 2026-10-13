"use client";

import { OnboardingSectionForm } from "@/components/onboarding/onboarding-section-form";
import { OnboardingChoiceField } from "@/components/onboarding/onboarding-field";
import { OnboardingRadioField } from "@/components/onboarding/onboarding-choice-fields";
import {
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/onboarding/onboarding-inputs";
import {
  CONTACT_SOURCE_OPTIONS,
  LONG_TERM_PLAN_OPTIONS,
  YES_NO_MAYBE_OPTIONS,
} from "@/lib/onboarding/schema";
import { sectionHref } from "@/lib/onboarding/sections";

export function CareerForm() {
  return (
    <OnboardingSectionForm section="career" nextHref={sectionHref("consent")}>
      {({ errors, text, setValue }) => (
        <>
          <TextAreaField
            id="motivation"
            label="Why do you want to study abroad?"
            rows={6}
            value={text("motivation")}
            onChange={(value) => setValue("motivation", value)}
            error={errors.motivation}
          />
          <OnboardingChoiceField
            label="Are you willing to work part-time while studying?"
            field="partTimeWork"
            error={errors.partTimeWork}
          >
            <OnboardingRadioField
              name="partTimeWork"
              options={YES_NO_MAYBE_OPTIONS}
              value={text("partTimeWork")}
              onChange={(value) => setValue("partTimeWork", value)}
              invalid={Boolean(errors.partTimeWork)}
            />
          </OnboardingChoiceField>
          <SelectField
            id="longTermPlan"
            label="Long-term plan after graduation"
            options={LONG_TERM_PLAN_OPTIONS}
            value={text("longTermPlan")}
            onChange={(value) => setValue("longTermPlan", value)}
            error={errors.longTermPlan}
          />
          <SelectField
            id="contactSource"
            label="How did you contacted us"
            options={CONTACT_SOURCE_OPTIONS}
            value={text("contactSource")}
            onChange={(value) => setValue("contactSource", value)}
            error={errors.contactSource}
          />
          <TextField
            id="contactUsername"
            label="Provide us your username from which you have contacted us"
            value={text("contactUsername")}
            onChange={(value) => setValue("contactUsername", value)}
            error={errors.contactUsername}
          />
        </>
      )}
    </OnboardingSectionForm>
  );
}