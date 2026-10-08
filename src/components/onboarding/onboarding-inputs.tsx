"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingField } from "@/components/onboarding/onboarding-field";

const CONTROL =
  "min-h-11 w-full rounded-lg border border-hope-midnight/20 bg-hope-white px-3 py-2 text-base md:text-base text-hope-midnight placeholder:text-hope-fog focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember aria-invalid:border-hope-ember";

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  required = true,
  type = "text",
  inputMode,
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
  type?: "text" | "date" | "email" | "tel";
  inputMode?: "text" | "email" | "tel" | "numeric";
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <OnboardingField id={id} label={label} error={error} hint={hint} required={required}>
      <Input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? true : undefined}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        className={CONTROL}
      />
    </OnboardingField>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  required = true,
  rows = 4,
  maxLength = 4000,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
}) {
  return (
    <OnboardingField id={id} label={label} error={error} hint={hint} required={required}>
      <Textarea
        id={id}
        name={id}
        value={value}
        rows={rows}
        maxLength={maxLength}
        required={required}
        aria-invalid={error ? true : undefined}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
        className={`${CONTROL} min-h-32 max-h-72`}
      />
    </OnboardingField>
  );
}

export function SelectField({
  id,
  label,
  options,
  value,
  onChange,
  error,
  hint,
  required = true,
  placeholder = "Select an option",
}: {
  id: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <OnboardingField id={id} label={label} error={error} hint={hint} required={required}>
      <select
        id={id}
        name={id}
        value={value}
        required={required}
        aria-invalid={error ? true : undefined}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => onChange(event.target.value)}
        className={CONTROL}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </OnboardingField>
  );
}

export function ConsentCheckbox({
  id,
  label,
  checked,
  onChange,
  error,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3 rounded-xl border border-hope-midnight/15 bg-hope-white p-4 text-base leading-6 has-[:checked]:border-hope-ember has-[:checked]:bg-hope-ember/5"
      >
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(next: boolean) => onChange(next)}
          aria-invalid={error ? true : undefined}
          className="mt-0.5 size-5"
        />
        <span>{label}</span>
      </label>
      {error ? (
        <p role="alert" className="text-sm leading-6 text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}