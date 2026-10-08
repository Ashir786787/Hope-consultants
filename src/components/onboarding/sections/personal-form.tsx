"use client";

import { OnboardingSectionForm } from "@/components/onboarding/onboarding-section-form";
import { TextField } from "@/components/onboarding/onboarding-inputs";
import { OnboardingChoiceField } from "@/components/onboarding/onboarding-field";
import { OnboardingRadioField } from "@/components/onboarding/onboarding-choice-fields";
import { GENDER_OPTIONS } from "@/lib/onboarding/schema";
import { sectionHref } from "@/lib/onboarding/sections";

export function PersonalForm() {
  return (
    <OnboardingSectionForm section="personal" nextHref={sectionHref("education-background")}>
      {({ errors, text, setValue }) => (
        <>
          <TextField
            id="fullName"
            label="Full name (as per your documents)"
            value={text("fullName")}
            onChange={(value) => setValue("fullName", value)}
            error={errors.fullName}
          />
          <TextField
            id="parentName"
            label="Parent or guardian name"
            value={text("parentName")}
            onChange={(value) => setValue("parentName", value)}
            error={errors.parentName}
          />
          <TextField
            id="dateOfBirth"
            label="Date of birth"
            type="date"
            value={text("dateOfBirth")}
            onChange={(value) => setValue("dateOfBirth", value)}
            error={errors.dateOfBirth}
          />
          <OnboardingChoiceField label="Gender" field="gender" error={errors.gender}>
            <OnboardingRadioField
              name="gender"
              options={GENDER_OPTIONS}
              value={text("gender")}
              onChange={(value) => setValue("gender", value)}
              invalid={Boolean(errors.gender)}
            />
          </OnboardingChoiceField>
          <TextField
            id="nationality"
            label="Nationality"
            value={text("nationality")}
            onChange={(value) => setValue("nationality", value)}
            error={errors.nationality}
          />
          <TextField
            id="passportNumber"
            label="Passport or CNIC number"
            hint="CNIC like 12123-1212321-2, or a passport number like AK1234567."
            value={text("passportNumber")}
            onChange={(value) => setValue("passportNumber", value)}
            error={errors.passportNumber}
          />
          <TextField
            id="contactNumber"
            label="WhatsApp number"
            type="tel"
            inputMode="tel"
            placeholder="+92 3XX XXXXXXX"
            value={text("contactNumber")}
            onChange={(value) => setValue("contactNumber", value)}
            error={errors.contactNumber}
          />
          <TextField
            id="email"
            label="Email address"
            type="email"
            inputMode="email"
            value={text("email")}
            onChange={(value) => setValue("email", value)}
            error={errors.email}
          />
          <TextField
            id="currentCity"
            label="Current city"
            value={text("currentCity")}
            onChange={(value) => setValue("currentCity", value)}
            error={errors.currentCity}
          />
          <TextField
            id="domicile"
            label="Domicile"
            hint="The district recorded on your CNIC."
            value={text("domicile")}
            onChange={(value) => setValue("domicile", value)}
            error={errors.domicile}
          />
        </>
      )}
    </OnboardingSectionForm>
  );
}