import type { CollectionSchema } from "@/lib/content/schemas";

export type FieldMap = Record<string, unknown>;

export function toRecords(raw: unknown): FieldMap[] {
  if (Array.isArray(raw)) return raw as FieldMap[];
  if (raw === null || raw === undefined) return [];
  return [raw as FieldMap];
}

function isBlank(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  return false;
}

export function validateContentForm(
  schema: CollectionSchema,
  form: FieldMap,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of schema.fields) {
    const value = form[field.key];
    if (field.required && isBlank(value)) {
      errors[field.key] = `${field.label} is required.`;
      continue;
    }
    if (field.kind === "json") {
      const text = typeof value === "string" ? value.trim() : "";
      if (!text) continue;
      try {
        JSON.parse(text);
      } catch {
        errors[field.key] = "This is not valid JSON. Fix it or clear the field.";
      }
    }
  }
  return errors;
}

export function recordTitle(
  schema: CollectionSchema,
  record: FieldMap,
  index: number,
): string {
  const raw = record[schema.titleKey];
  const text = typeof raw === "string" ? raw.trim() : "";
  return text || `Item ${index + 1}`;
}

export function recordMeta(
  schema: CollectionSchema,
  record: FieldMap,
): string {
  for (const field of schema.fields) {
    if (field.key === schema.titleKey) continue;
    const raw = record[field.key];
    if (typeof raw === "string" && raw.trim()) {
      return raw.trim().replace(/\s+/g, " ").slice(0, 96);
    }
    if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
  }
  return "";
}

export function recordSearchText(
  schema: CollectionSchema,
  record: FieldMap,
): string {
  const parts: string[] = [];
  for (const field of schema.fields) {
    const raw = record[field.key];
    if (typeof raw === "string") parts.push(raw);
    else if (typeof raw === "number" || typeof raw === "boolean") {
      parts.push(String(raw));
    }
  }
  return parts.join(" ").toLowerCase();
}

export function lineCount(value: unknown): number {
  if (typeof value !== "string") return 0;
  return value.split("\n").filter((line) => line.trim().length > 0).length;
}
