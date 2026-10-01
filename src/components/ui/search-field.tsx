"use client";

import { useId } from "react";

import { Input } from "@/components/ui/input";

type SearchFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
};

export function SearchField({ label, placeholder, value, onValueChange }: SearchFieldProps) {
  const id = useId();

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <Input
        id={id}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onValueChange(event.target.value)}
        className="h-11 w-full max-w-md"
      />
    </div>
  );
}
