"use client";

import { OnboardingSectionForm } from "@/components/onboarding/onboarding-section-form";
import { OnboardingChoiceField } from "@/components/onboarding/onboarding-field";
import { OnboardingRadioField } from "@/components/onboarding/onboarding-choice-fields";
import { DOCUMENT_STATUS_OPTIONS } from "@/lib/onboarding/schema";
import { sectionHref } from "@/lib/onboarding/sections";

const DOCUMENT_FIELDS = [
  { field: "passportStatus", label: "Passport" },
  { field: "hecIbccStatus", label: "HEC / IBCC equivalence certificate" },
  { field: "mofaAttestationStatus", label: "MOFA attestation" },
  { field: "mofaApostilleStatus", label: "MOFA apostille" },
  { field: "policeClearanceStatus", label: "Police clearance certificate" },
  { field: "bankStatementStatus", label: "Bank statement" },
] as const;

export function DocumentsForm() {
  return (
    <OnboardingSectionForm section="documents" nextHref={sectionHref("career-and-future-plans")}>
      {({ errors, text, setValue }) => (
        <>
          {DOCUMENT_FIELDS.map(({ field, label }) => (
            <OnboardingChoiceField
              key={field}
              field={field}
              label={label}
              hint="Choose Yes if you already have it, No if you do not, or In Process."
              error={errors[field]}
            >
              <OnboardingRadioField
                name={field}
                options={DOCUMENT_STATUS_OPTIONS}
                value={text(field)}
                onChange={(value) => setValue(field, value)}
                invalid={Boolean(errors[field])}
              />
            </OnboardingChoiceField>
          ))}
        </>
      )}
    </OnboardingSectionForm>
  );
}
