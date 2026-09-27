"use client";

import { ChevronDown } from "lucide-react";

import { adminControlClass } from "@/components/admin/admin-ui";
import { lineCount } from "@/lib/admin/content-form";
import type { FieldDef } from "@/lib/content/schemas";

const MONO = "font-mono text-sm leading-6";

export function AdminFieldInput({
  field,
  value,
  error,
  describedBy,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  error?: string;
  describedBy?: string;
  onChange: (value: unknown) => void;
}) {
  const id = `field-${field.key}`;
  const control = adminControlClass(Boolean(error));
  const shared = {
    id,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy,
    "aria-required": field.required || undefined,
  };
  const text = typeof value === "string" ? value : "";

  switch (field.kind) {
    case "textarea":
    case "liststrings":
    case "json": {
      const rows =
        field.kind === "json" ? 8 : field.kind === "liststrings" ? 5 : 4;
      const tall = field.kind === "json" || field.kind === "liststrings";
      return (
        <textarea
          {...shared}
          rows={rows}
          value={text}
          spellCheck={!tall}
          onChange={(event) => onChange(event.target.value)}
          className={`${control} ${tall ? MONO : ""} resize-y py-2.5`}
        />
      );
    }
    case "number":
      return (
        <input
          {...shared}
          type="number"
          value={typeof value === "number" ? value : 0}
          onChange={(event) => onChange(Number(event.target.value))}
          className={control}
        />
      );
    case "select":
      return (
        <div className="relative">
          <select
            {...shared}
            value={text}
            onChange={(event) => onChange(event.target.value)}
            className={`${control} min-h-11 appearance-none pr-10`}
          >
            {(field.options ?? []).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-hope-fog"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </div>
      );
    case "date":
      return (
        <input
          {...shared}
          type="date"
          value={text}
          onChange={(event) => onChange(event.target.value)}
          className={control}
        />
      );
    default:
      return (
        <input
          {...shared}
          type="text"
          value={text}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`${control} min-h-11`}
        />
      );
  }
}

export function fieldFootnote(field: FieldDef, value: unknown): string | null {
  if (field.kind === "liststrings") {
    const count = lineCount(value);
    return `${count} ${count === 1 ? "entry" : "entries"}`;
  }
  if (field.kind === "text" || field.kind === "textarea") {
    const text = typeof value === "string" ? value : "";
    if (!text) return null;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return field.kind === "textarea"
      ? `${words} words · ${text.length} characters`
      : `${text.length} characters`;
  }
  return null;
}
