"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { AdminAlert, AdminButton } from "@/components/admin/admin-ui";
import {
  AdminFormFieldEditor,
  type ConditionFieldOption,
} from "@/components/admin/admin-form-field-editor";
import type { FormDefinition, FormField, FormSection } from "@/lib/forms/types";

function slugify(value: string): string {
  const base = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base.length > 0 ? base : "item";
}

function uniqueSlug(seed: string, used: Set<string>): string {
  const base = slugify(seed);
  let candidate = base;
  let counter = 2;
  while (used.has(candidate)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  return candidate;
}

const labelClass = "text-xs font-semibold uppercase tracking-wide text-hope-fog";
const controlClass =
  "min-h-11 w-full rounded-lg border border-hope-midnight/20 bg-hope-white px-3 text-sm text-hope-midnight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember";

export function AdminFormBuilder({ definition }: { definition: FormDefinition }) {
  const router = useRouter();
  const [draft, setDraft] = useState<FormDefinition>(definition);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function replaceSection(index: number, next: FormSection) {
    setDraft((prev) => {
      const sections = prev.sections.map((section, position) =>
        position === index ? next : section
      );
      return { ...prev, sections };
    });
    setSaved(false);
  }

  function removeSection(index: number) {
    setDraft((prev) => ({ ...prev, sections: prev.sections.filter((_, i) => i !== index) }));
    setSaved(false);
  }

  function moveSection(index: number, direction: -1 | 1) {
    setDraft((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.sections.length) return prev;
      const sections = [...prev.sections];
      [sections[index], sections[target]] = [sections[target], sections[index]];
      return { ...prev, sections };
    });
    setSaved(false);
  }

  function addSection() {
    setDraft((prev) => {
      const used = new Set(prev.sections.map((section) => section.slug));
      const usedKeys = new Set(prev.sections.map((section) => section.key));
      const name = `Section ${prev.sections.length + 1}`;
      const section: FormSection = {
        key: uniqueSlug(name, usedKeys),
        slug: uniqueSlug(name, used),
        order: prev.sections.length + 2,
        title: name,
        description: "",
        fields: [],
      };
      return { ...prev, sections: [...prev.sections, section] };
    });
    setSaved(false);
  }

  function addField(sectionIndex: number) {
    const section = draft.sections[sectionIndex];
    const used = new Set(section.fields.map((field) => field.key));
    const name = `New field ${section.fields.length + 1}`;
    const field: FormField = {
      key: uniqueSlug(name, used),
      label: name,
      kind: "text",
    };
    replaceSection(sectionIndex, { ...section, fields: [...section.fields, field] });
  }

  async function save() {
    setPending(true);
    setError(null);
    setSaved(false);
    try {
      const response = await fetch(`/api/admin/forms/${draft.key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(payload?.error ?? "Could not save the form.");
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-hope-midnight/10 bg-hope-white p-6">
        <p className="text-sm text-hope-fog">
          Editing the structure of the live public form. Removing a field hides it from the form;
          hidden fields keep their saved answers. Changing a field key disconnects it from answers
          already saved under the old key.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <AdminButton type="button" variant="primary" disabled={pending} onClick={save}>
            {pending ? "Saving…" : "Save form"}
          </AdminButton>
          <span className="text-sm text-hope-fog">
            {draft.sections.length} section{draft.sections.length === 1 ? "" : "s"} ·{" "}
            {draft.sections.reduce((total, section) => total + section.fields.length, 0)} fields
          </span>
        </div>
        {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}
        {saved ? <AdminAlert tone="success">Form saved.</AdminAlert> : null}
      </div>

      {draft.sections.map((section, sectionIndex) => {
        const conditionFields: ConditionFieldOption[] = section.fields
          .filter((field) => !field.archived)
          .map((field) => ({ key: field.key, label: field.label }));
        return (
          <section
            key={`${section.key}-${sectionIndex}`}
            className="flex flex-col gap-4 rounded-2xl border border-hope-midnight/10 bg-hope-white p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-hope-midnight">
                Section {sectionIndex + 1}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Move section up"
                  disabled={sectionIndex === 0}
                  onClick={() => moveSection(sectionIndex, -1)}
                  className="inline-flex size-11 items-center justify-center rounded-lg border border-hope-midnight/30 text-hope-midnight transition-colors hover:bg-hope-midnight/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowUp className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Move section down"
                  disabled={sectionIndex === draft.sections.length - 1}
                  onClick={() => moveSection(sectionIndex, 1)}
                  className="inline-flex size-11 items-center justify-center rounded-lg border border-hope-midnight/30 text-hope-midnight transition-colors hover:bg-hope-midnight/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowDown className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Remove section"
                  onClick={() => removeSection(sectionIndex)}
                  className="inline-flex size-11 items-center justify-center rounded-lg border border-hope-midnight/30 text-hope-midnight transition-colors hover:bg-hope-midnight/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
                >
                  <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className={labelClass}>Title</span>
                <input
                  value={section.title}
                  onChange={(event) =>
                    replaceSection(sectionIndex, { ...section, title: event.target.value })
                  }
                  className={controlClass}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className={labelClass}>URL slug</span>
                <input
                  value={section.slug}
                  onChange={(event) =>
                    replaceSection(sectionIndex, { ...section, slug: event.target.value })
                  }
                  className={`${controlClass} font-mono`}
                />
              </label>
            </div>

            <label className="flex flex-col gap-1">
              <span className={labelClass}>Description</span>
              <textarea
                value={section.description}
                rows={3}
                onChange={(event) =>
                  replaceSection(sectionIndex, { ...section, description: event.target.value })
                }
                className={`${controlClass} py-2`}
              />
            </label>

            <div className="flex flex-col gap-3">
              {section.fields.map((field, fieldIndex) => (
                <AdminFormFieldEditor
                  key={`${field.key}-${fieldIndex}`}
                  field={field}
                  index={fieldIndex}
                  conditionFields={conditionFields.filter((option) => option.key !== field.key)}
                  canMoveUp={fieldIndex > 0}
                  canMoveDown={fieldIndex < section.fields.length - 1}
                  onChange={(next) => {
                    const fields = section.fields.map((entry, i) =>
                      i === fieldIndex ? next : entry
                    );
                    replaceSection(sectionIndex, { ...section, fields });
                  }}
                  onMoveUp={() => {
                    if (fieldIndex === 0) return;
                    const fields = [...section.fields];
                    [fields[fieldIndex - 1], fields[fieldIndex]] = [
                      fields[fieldIndex],
                      fields[fieldIndex - 1],
                    ];
                    replaceSection(sectionIndex, { ...section, fields });
                  }}
                  onMoveDown={() => {
                    if (fieldIndex >= section.fields.length - 1) return;
                    const fields = [...section.fields];
                    [fields[fieldIndex + 1], fields[fieldIndex]] = [
                      fields[fieldIndex],
                      fields[fieldIndex + 1],
                    ];
                    replaceSection(sectionIndex, { ...section, fields });
                  }}
                  onRemove={() => {
                    const fields = section.fields.filter((_, i) => i !== fieldIndex);
                    replaceSection(sectionIndex, { ...section, fields });
                  }}
                />
              ))}
              <div>
                <AdminButton
                  type="button"
                  variant="secondary"
                  onClick={() => addField(sectionIndex)}
                >
                  <Plus className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  Add field
                </AdminButton>
              </div>
            </div>
          </section>
        );
      })}

      <div>
        <AdminButton type="button" variant="secondary" onClick={addSection}>
          <Plus className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Add section
        </AdminButton>
      </div>
    </div>
  );
}
