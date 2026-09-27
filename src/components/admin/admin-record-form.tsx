"use client";

import type { RefObject } from "react";
import { Loader2, RotateCcw, Save } from "lucide-react";

import { AdminImageField } from "@/components/admin/admin-image-field";
import { AdminFieldInput, fieldFootnote } from "@/components/admin/admin-field-input";
import { AdminSwitch } from "@/components/admin/admin-switch";
import {
  adminHelpClass,
  adminLabelClass,
  AdminButton,
} from "@/components/admin/admin-ui";
import type { FieldMap } from "@/lib/admin/content-form";
import type { CollectionSchema, FieldDef } from "@/lib/content/schemas";

const WIDE = new Set<FieldDef["kind"]>(["textarea", "liststrings", "json", "image"]);

export function AdminRecordForm({
  schema,
  form,
  errors,
  dirty,
  saving,
  heading,
  headingRef,
  onField,
  onPickImage,
  onSave,
  onDiscard,
  onToast,
}: {
  schema: CollectionSchema;
  form: FieldMap;
  errors: Record<string, string>;
  dirty: boolean;
  saving: boolean;
  heading: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onField: (field: FieldDef, value: unknown) => void;
  onPickImage: (field: FieldDef, file: File) => void;
  onSave: () => void;
  onDiscard: () => void;
  onToast: (text: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-hope-midnight/10 bg-hope-white p-5 shadow-[0_1px_2px_rgb(var(--hope-midnight-rgb)/0.06),0_24px_48px_-32px_rgb(var(--hope-midnight-rgb)/0.2)] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-xl font-semibold text-hope-midnight focus-visible:outline-none"
          >
            {heading}
          </h2>
          {dirty ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-hope-ember bg-hope-ember/15 px-3 py-1 text-xs font-bold text-hope-midnight">
              Unsaved changes
            </span>
          ) : (
            <span className="text-xs font-medium text-hope-fog">No changes yet</span>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
          {schema.fields.map((field) => {
            const value = form[field.key];
            const error = errors[field.key];
            const note = fieldFootnote(field, value);
            const helpId = `help-${field.key}`;
            const errorId = `error-${field.key}`;
            const noteId = `note-${field.key}`;
            const describedBy =
              [error ? errorId : null, field.help ? helpId : null, note ? noteId : null]
                .filter(Boolean)
                .join(" ") || undefined;

            return (
              <div
                key={field.key}
                className={`flex flex-col gap-2 ${WIDE.has(field.kind) ? "md:col-span-2" : ""}`}
              >
                <label htmlFor={`field-${field.key}`} className={adminLabelClass()}>
                  {field.label}
                  {field.required ? (
                    <>
                      <span aria-hidden="true" className="ml-0.5">
                        *
                      </span>
                      <span className="sr-only"> (required)</span>
                    </>
                  ) : null}
                </label>

                {field.kind === "image" ? (
                  <AdminImageField
                    id={`field-${field.key}`}
                    value={typeof value === "string" ? value : ""}
                    onPick={(file) => onPickImage(field, file)}
                    onChange={(next) => onField(field, next)}
                    onClear={() => onField(field, "")}
                    onError={(message) => onToast(message)}
                  />
                ) : field.kind === "boolean" ? (
                  <AdminSwitch
                    id={`field-${field.key}`}
                    checked={Boolean(value)}
                    label={field.help ?? "Enabled"}
                    onChange={(next) => onField(field, next)}
                  />
                ) : (
                  <AdminFieldInput
                    field={field}
                    value={value}
                    error={error}
                    describedBy={describedBy}
                    onChange={(next) => onField(field, next)}
                  />
                )}

                {error ? (
                  <p id={errorId} role="alert" className="text-sm font-semibold text-hope-midnight">
                    <span aria-hidden="true" className="mr-1.5">
                      !
                    </span>
                    {error}
                  </p>
                ) : null}
                {field.help && field.kind !== "boolean" ? (
                  <p id={helpId} className={adminHelpClass()}>
                    {field.help}
                  </p>
                ) : null}
                {note ? (
                  <p id={noteId} className="text-xs text-hope-fog tabular-nums">
                    {note}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="sticky bottom-4 z-10 flex flex-col-reverse gap-3 rounded-2xl border border-hope-midnight/15 bg-hope-white/95 p-3 shadow-[0_1px_2px_rgb(var(--hope-midnight-rgb)/0.06),0_24px_48px_-24px_rgb(var(--hope-midnight-rgb)/0.3)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="px-1 text-sm text-hope-fog">
          {saving
            ? "Saving to your content store…"
            : dirty
              ? "Save to publish, or discard your edits."
              : "Edit any field above to get started."}
        </p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <AdminButton
            variant="secondary"
            onClick={onDiscard}
            disabled={saving || !dirty}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {schema.singleton ? "Reload" : "Discard"}
          </AdminButton>
          <AdminButton
            variant="primary"
            onClick={onSave}
            disabled={saving || !dirty}
            className="w-full sm:w-auto"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Save className="size-4" strokeWidth={1.75} aria-hidden="true" />
            )}
            {saving ? "Saving…" : "Save changes"}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
