import type { DraftAnswers, FieldValue } from "@/lib/forms/answers";
import type { FormDefinition, FormField, FormSection } from "@/lib/forms/types";

export interface AnswerFileRow {
  id: string;
  name: string;
}

export interface AnswerRow {
  label: string;
  value: string;
  files: AnswerFileRow[];
}

export interface AnswerGroup {
  title: string;
  rows: AnswerRow[];
}

function asText(value: FieldValue): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === "object") return "";
    return value.join(", ");
  }
  return "";
}

function asFiles(value: FieldValue): AnswerFileRow[] {
  if (!Array.isArray(value)) return [];
  const rows: AnswerFileRow[] = [];
  for (const entry of value) {
    if (entry && typeof entry === "object" && "id" in entry && "name" in entry) {
      rows.push({ id: String(entry.id), name: String(entry.name) });
    }
  }
  return rows;
}

function rowFor(field: FormField, value: FieldValue): AnswerRow {
  const files = asFiles(value);
  const text = asText(value);
  return {
    label: field.label,
    value: files.length > 0 ? `${files.length} file(s)` : text === "" ? "—" : text,
    files,
  };
}

function visibleInSection(section: FormSection): FormField[] {
  return section.fields.filter((field) => !field.archived);
}

export function buildDefinitionGroups(
  definition: FormDefinition,
  answers: DraftAnswers
): AnswerGroup[] {
  const groups: AnswerGroup[] = [];
  for (const section of definition.sections) {
    const rows: AnswerRow[] = [];
    for (const field of visibleInSection(section)) {
      const row = rowFor(field, answers[section.key]?.[field.key]);
      if (row.files.length > 0) rows.push(row);
      else if (row.value !== "—") rows.push(row);
    }
    if (rows.length > 0) groups.push({ title: section.title, rows });
  }
  return groups;
}
