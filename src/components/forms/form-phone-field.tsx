"use client";

import { OnboardingField } from "@/components/onboarding/onboarding-field";
import { CONTROL } from "@/components/onboarding/onboarding-inputs";
import { PHONE_COUNTRIES } from "@/lib/data/phone-countries";
import { composePhoneValue, phoneCountryByIso, splitPhoneValue } from "@/lib/forms/phone";

const SELECT_CONTROL =
  "min-h-11 w-full rounded-lg border border-hope-midnight/20 bg-hope-white px-3 py-2 text-base text-hope-midnight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember";

export function FormPhoneField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  required = true,
  placeholder,
  maxLength = 300,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  const { country, national } = splitPhoneValue(value);
  const nationalPlaceholder = placeholder?.replace(/^\+\d+\s*/, "");

  function selectCountry(iso: string) {
    const next = phoneCountryByIso(iso) ?? country;
    onChange(composePhoneValue(next, national));
  }

  function editNational(next: string) {
    onChange(composePhoneValue(country, next));
  }

  return (
    <OnboardingField id={id} label={label} error={error} hint={hint} required={required}>
      <div className="flex gap-2">
        <div className="w-40 shrink-0 sm:w-48">
          <select
            aria-label="Country code"
            value={country.iso}
            onChange={(event) => selectCountry(event.target.value)}
            className={SELECT_CONTROL}
          >
            {PHONE_COUNTRIES.map((entry) => (
              <option key={entry.iso} value={entry.iso}>
                {entry.name} (+{entry.dialCode})
              </option>
            ))}
          </select>
        </div>
        <input
          id={id}
          name={id}
          type="tel"
          inputMode="tel"
          value={national}
          maxLength={maxLength}
          placeholder={nationalPlaceholder}
          required={required}
          aria-invalid={error ? true : undefined}
          onChange={(event) => editNational(event.target.value)}
          className={`${CONTROL} min-w-0 flex-1`}
        />
      </div>
    </OnboardingField>
  );
}
