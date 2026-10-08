"use client";

import { OnboardingSectionForm } from "@/components/onboarding/onboarding-section-form";
import {
  SelectField,
  TextField,
} from "@/components/onboarding/onboarding-inputs";
import {
  OnboardingRadioField,
} from "@/components/onboarding/onboarding-choice-fields";
import { OnboardingChoiceField } from "@/components/onboarding/onboarding-field";
import { ENGLISH_TEST_OPTIONS, QUALIFICATION_OPTIONS } from "@/lib/onboarding/schema";
import { sectionHref } from "@/lib/onboarding/sections";

export function EducationForm() {
  return (
    <OnboardingSectionForm section="education" nextHref={sectionHref("study-abroad-preferences")}>
      {({ errors, text, setValue }) => (
        <>
          <SelectField
            id="highestQualification"
            label="Highest qualification"
            options={QUALIFICATION_OPTIONS}
            value={text("highestQualification")}
            onChange={(value) => setValue("highestQualification", value)}
            error={errors.highestQualification}
          />
          <TextField
            id="degreeTitle"
            label="Degree title"
            value={text("degreeTitle")}
            onChange={(value) => setValue("degreeTitle", value)}
            error={errors.degreeTitle}
          />
          <TextField
            id="fieldOfStudy"
            label="Field of study"
            value={text("fieldOfStudy")}
            onChange={(value) => setValue("fieldOfStudy", value)}
            error={errors.fieldOfStudy}
          />
          <TextField
            id="institutionName"
            label="University or college name"
            value={text("institutionName")}
            onChange={(value) => setValue("institutionName", value)}
            error={errors.institutionName}
          />
          <TextField
            id="yearOfPassing"
            label="Year of passing"
            inputMode="numeric"
            placeholder="2024"
            value={text("yearOfPassing")}
            onChange={(value) => setValue("yearOfPassing", value)}
            error={errors.yearOfPassing}
          />
          <TextField
            id="grade"
            label="CGPA or percentage"
            hint="For example 3.4/4.0 or 82%."
            value={text("grade")}
            onChange={(value) => setValue("grade", value)}
            error={errors.grade}
          />
          <OnboardingChoiceField label="English proficiency test" field="englishTest" error={errors.englishTest}>
            <OnboardingRadioField
              name="englishTest"
              options={ENGLISH_TEST_OPTIONS}
              value={text("englishTest")}
              onChange={(value) => setValue("englishTest", value)}
              invalid={Boolean(errors.englishTest)}
            />
          </OnboardingChoiceField>
          {text("englishTest") === "Other" ? (
            <TextField
              id="englishTestOther"
              label="Please specify the test"
              required={text("englishTest") === "Other"}
              value={text("englishTestOther")}
              onChange={(value) => setValue("englishTestOther", value)}
              error={errors.englishTestOther}
            />
          ) : null}
          <TextField
            id="englishTestScore"
            label="Test score"
            required={false}
            hint="Leave blank if you have not taken the test yet."
            value={text("englishTestScore")}
            onChange={(value) => setValue("englishTestScore", value)}
            error={errors.englishTestScore}
          />
        </>
      )}
    </OnboardingSectionForm>
  );
}