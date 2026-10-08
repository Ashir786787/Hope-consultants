"use client";

import { OnboardingSectionForm } from "@/components/onboarding/onboarding-section-form";
import {
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/onboarding/onboarding-inputs";
import { SPONSOR_OPTIONS } from "@/lib/onboarding/schema";
import { sectionHref } from "@/lib/onboarding/sections";

export function FinancialForm() {
  return (
    <OnboardingSectionForm section="financial" nextHref={sectionHref("documentation-status")}>
      {({ errors, text, setValue }) => (
        <>
          <SelectField
            id="financialSponsor"
            label="Who is funding your studies?"
            options={SPONSOR_OPTIONS}
            value={text("financialSponsor")}
            onChange={(value) => setValue("financialSponsor", value)}
            error={errors.financialSponsor}
          />
          {text("financialSponsor") === "Other" ? (
            <TextField
              id="sponsorOther"
              label="Please specify the sponsor"
              value={text("sponsorOther")}
              onChange={(value) => setValue("sponsorOther", value)}
              error={errors.sponsorOther}
            />
          ) : null}
          <TextField
            id="sponsorOccupation"
            label="Occupation of sponsor"
            value={text("sponsorOccupation")}
            onChange={(value) => setValue("sponsorOccupation", value)}
            error={errors.sponsorOccupation}
          />
          <TextField
            id="householdIncome"
            label="Monthly household income"
            required={false}
            hint="An estimate is fine."
            value={text("householdIncome")}
            onChange={(value) => setValue("householdIncome", value)}
            error={errors.householdIncome}
          />
          <TextAreaField
            id="travelHistory"
            label="International travel history"
            hint="List countries you have visited and the year of each trip."
            rows={4}
            maxLength={300}
            value={text("travelHistory")}
            onChange={(value) => setValue("travelHistory", value)}
            error={errors.travelHistory}
          />
        </>
      )}
    </OnboardingSectionForm>
  );
}