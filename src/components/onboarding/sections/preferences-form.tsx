"use client";

import { OnboardingSectionForm } from "@/components/onboarding/onboarding-section-form";
import {
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/onboarding/onboarding-inputs";
import { OnboardingCheckboxGroup } from "@/components/onboarding/onboarding-choice-fields";
import { OnboardingChoiceField } from "@/components/onboarding/onboarding-field";
import {
  COUNTRY_OPTIONS,
  STUDY_LEVEL_OPTIONS,
  YES_NO_MAYBE_OPTIONS,
} from "@/lib/onboarding/schema";
import { sectionHref } from "@/lib/onboarding/sections";

export function PreferencesForm() {
  return (
    <OnboardingSectionForm section="preferences" nextHref={sectionHref("financial-and-family-info")}>
      {({ errors, text, list, setValue, toggleValue }) => (
        <>
          <SelectField
            id="desiredLevel"
            label="Desired level of study"
            options={STUDY_LEVEL_OPTIONS}
            value={text("desiredLevel")}
            onChange={(value) => setValue("desiredLevel", value)}
            error={errors.desiredLevel}
          />
          <TextField
            id="preferredField"
            label="Preferred field of study"
            value={text("preferredField")}
            onChange={(value) => setValue("preferredField", value)}
            error={errors.preferredField}
          />
          <OnboardingChoiceField
            label="Interested countries"
            field="interestedCountries"
            hint="Choose every country you are open to."
            error={errors.interestedCountries}
          >
            <OnboardingCheckboxGroup
              name="interestedCountries"
              options={COUNTRY_OPTIONS}
              values={list("interestedCountries")}
              onToggle={(option) => toggleValue("interestedCountries", option)}
            />
          </OnboardingChoiceField>
          <TextAreaField
            id="studyBudget"
            label="Study budget"
            hint="An approximate yearly amount in PKR or EUR is fine."
            rows={3}
            maxLength={300}
            value={text("studyBudget")}
            onChange={(value) => setValue("studyBudget", value)}
            error={errors.studyBudget}
          />
          <SelectField
            id="lookingForScholarships"
            label="Are you looking for scholarships?"
            options={YES_NO_MAYBE_OPTIONS}
            value={text("lookingForScholarships")}
            onChange={(value) => setValue("lookingForScholarships", value)}
            error={errors.lookingForScholarships}
          />
        </>
      )}
    </OnboardingSectionForm>
  );
}