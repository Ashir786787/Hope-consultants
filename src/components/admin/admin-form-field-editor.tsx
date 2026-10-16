"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

import type { FormField, FormFieldCondition, FormFieldKind } from "@/lib/forms/types";

const KIND_OPTIONS: { value: FormFieldKind; label: string }[] = [
  { value: "text", label: "Short text" },
  { value: "textarea", label: "Long text" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "date", label: "Date" },
  { value: "select", label: "Dropdown" },
  { value: "radio", label: "Single choice" },
  { value: "checkbox-group", label: "Multiple choice" },
  { value: "id-number", label: "ID number" },
  { value: "file", label: "File upload" },
  { value: "consent", label: "Consent checkbox" },
];

const HAS_OPTIONS: FormFieldKind[] = ["select", "radio", "checkbox-group"];

export interface ConditionFieldOption {
  key: string;
  label: string;
}

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

export function AdminFormFieldEditor({
  field,
  index,
  conditionFields,
  canMoveUp,
  canMoveDown,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  field: FormField;
  index: number;
  conditionFields: ConditionFieldOption[];
  canMoveUp: boolean;
  canMoveDown: boolean;
  onChange: (next: FormField) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  const controlClass =
    "min-h-11 w-full rounded-lg border border-hope-midnight/20 bg-hope-white px-3 text-sm text-hope-midnight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember";
  const labelClass = "text-xs font-semibold uppercase tracking-wide text-hope-fog";

  function update(patch: Partial<FormField>) {
    onChange({ ...field, ...patch });
  }

  function setCondition(
    key: "showWhen" | "requiredWhen",
    enabled: boolean,
    current: FormFieldCondition | undefined
  ) {
    if (!enabled) {
      const next = { ...field };
      delete next[key];
      onChange(next);
      return;
    }
    update({
      [key]: current ?? { field: conditionFields[0]?.key ?? "", equals: [] },
    } as Partial<FormField>);
  }

  function setConditionValue(
    key: "showWhen" | "requiredWhen",
    current: FormFieldCondition | undefined,
    patch: Partial<FormFieldCondition>
  ) {
    update({ [key]: { field: "", equals: [], ...current, ...patch } } as Partial<FormField>);
  }

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border p-4 ${
        field.archived ? "border-hope-midnight/10 bg-hope-midnight/5 opacity-70" : "border-hope-midnight/15"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-hope-midnight">
          Field {index + 1}: {field.label || field.key}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Move field up"
            disabled={!canMoveUp}
            onClick={onMoveUp}
            className="inline-flex size-11 items-center justify-center rounded-lg border border-hope-midnight/30 text-hope-midnight transition-colors hover:bg-hope-midnight/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Move field down"
            disabled={!canMoveDown}
            onClick={onMoveDown}
            className="inline-flex size-11 items-center justify-center rounded-lg border border-hope-midnight/30 text-hope-midnight transition-colors hover:bg-hope-midnight/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowDown className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Remove field"
            onClick={onRemove}
            className="inline-flex size-11 items-center justify-center rounded-lg border border-hope-midnight/30 text-hope-midnight transition-colors hover:bg-hope-midnight/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
          >
            <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Label</span>
          <input
            value={field.label}
            onChange={(event) => update({ label: event.target.value })}
            className={controlClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Type</span>
          <select
            value={field.kind}
            onChange={(event) => update({ kind: event.target.value as FormFieldKind })}
            className={controlClass}
          >
            {KIND_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Field key (used for storage)</span>
        <input
          value={field.key}
          onChange={(event) => update({ key: event.target.value })}
          className={`${controlClass} font-mono`}
        />
      </label>

      {HAS_OPTIONS.includes(field.kind) ? (
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Options (one per line)</span>
          <textarea
            value={(field.options ?? []).join("\n")}
            rows={4}
            onChange={(event) =>
              update({
                options: event.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter((line) => line.length > 0),
              })
            }
            className={`${controlClass} py-2 font-mono`}
          />
        </label>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Hint</span>
          <input
            value={field.hint ?? ""}
            onChange={(event) => update({ hint: event.target.value })}
            className={controlClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Placeholder</span>
          <input
            value={field.placeholder ?? ""}
            onChange={(event) => update({ placeholder: event.target.value })}
            className={controlClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Required error message</span>
          <input
            value={field.requiredMessage ?? ""}
            onChange={(event) => update({ requiredMessage: event.target.value })}
            className={controlClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Invalid error message</span>
          <input
            value={field.invalidMessage ?? ""}
            onChange={(event) => update({ invalidMessage: event.target.value })}
            className={controlClass}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm text-hope-midnight">
          <input
            type="checkbox"
            checked={field.required === true}
            onChange={(event) => update({ required: event.target.checked })}
            className="size-4 accent-hope-ember"
          />
          Required
        </label>
        <label className="flex items-center gap-2 text-sm text-hope-midnight">
          <input
            type="checkbox"
            checked={field.multiple === true}
            onChange={(event) => update({ multiple: event.target.checked })}
            className="size-4 accent-hope-ember"
          />
          Allow multiple files
        </label>
        <label className="flex items-center gap-2 text-sm text-hope-midnight">
          <input
            type="checkbox"
            checked={field.archived === true}
            onChange={(event) => update({ archived: event.target.checked })}
            className="size-4 accent-hope-ember"
          />
          Hidden (archived)
        </label>
      </div>

      <div className="flex flex-col gap-3 rounded-lg bg-hope-midnight/5 p-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-hope-midnight">
          <input
            type="checkbox"
            checked={field.showWhen !== undefined}
            onChange={(event) => setCondition("showWhen", event.target.checked, field.showWhen)}
            className="size-4 accent-hope-ember"
          />
          Show this field only when
        </label>
        {field.showWhen ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <select
              value={field.showWhen.field}
              onChange={(event) =>
                setConditionValue("showWhen", field.showWhen, { field: event.target.value })
              }
              className={controlClass}
            >
              <option value="">Choose a field</option>
              {conditionFields.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              value={field.showWhen.equals.join(", ")}
              placeholder="Equal to (comma separated)"
              onChange={(event) =>
                setConditionValue("showWhen", field.showWhen, { equals: parseList(event.target.value) })
              }
              className={controlClass}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
