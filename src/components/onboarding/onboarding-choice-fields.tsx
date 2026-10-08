"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "cn";

const OPTION_CARD =
  "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-hope-midnight/15 bg-hope-white px-4 py-3 transition-colors hover:border-hope-ember/50 has-[:checked]:border-hope-ember has-[:checked]:bg-hope-ember/5";

export function OnboardingRadioField({
  name,
  options,
  value,
  onChange,
  invalid,
}: {
  name: string;
  options: readonly string[];
  value: string | undefined;
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  return (
    <RadioGroup
      name={name}
      value={value ?? ""}
      onValueChange={(next: string) => onChange(next)}
      aria-invalid={invalid || undefined}
      className="sm:flex sm:flex-wrap"
    >
      {options.map((option) => (
        <label key={option} className={OPTION_CARD}>
          <RadioGroupItem value={option} aria-label={option} />
          <span className="text-base leading-6">{option}</span>
        </label>
      ))}
    </RadioGroup>
  );
}

export function OnboardingCheckboxGroup({
  name,
  options,
  values,
  onToggle,
}: {
  name: string;
  options: readonly string[];
  values: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const checked = values.includes(option);
        return (
          <label key={option} className={cn(OPTION_CARD, checked && "border-hope-ember bg-hope-ember/5")}>
            <Checkbox
              name={name}
              value={option}
              checked={checked}
              onCheckedChange={() => onToggle(option)}
              aria-label={option}
            />
            <span className="text-base leading-6">{option}</span>
          </label>
        );
      })}
    </div>
  );
}