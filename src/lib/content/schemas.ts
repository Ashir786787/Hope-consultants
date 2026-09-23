export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "liststrings"
  | "image"
  | "date";

export interface FieldDef {
  key: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  help?: string;
}

export interface CollectionSchema {
  key: string;
  label: string;
  singular: string;
  titleKey: string;
  /** Single object instead of an array of records (e.g. site settings) */
  singleton?: boolean;
  fields: FieldDef[];
}

export const SCHEMAS: readonly CollectionSchema[] = [
  {
    key: "services",
    label: "Services",
    singular: "Service",
    titleKey: "name",
    fields: [
      { key: "slug", label: "Slug", kind: "text", required: true },
      { key: "name", label: "Name", kind: "text", required: true },
      { key: "shortName", label: "Short name (nav/cards)", kind: "text" },
      { key: "description", label: "Description", kind: "textarea", required: true },
      {
        key: "deliverables",
        label: "Deliverables",
        kind: "liststrings",
        help: "One item per line.",
      },
    ],
  },
  {
    key: "countries",
    label: "Countries",
    singular: "Country",
    titleKey: "name",
    fields: [
      { key: "slug", label: "Slug", kind: "text", required: true },
      { key: "name", label: "Name", kind: "text", required: true },
      { key: "flag", label: "Flag (one emoji)", kind: "text" },
      { key: "tagline", label: "Tagline", kind: "text" },
      { key: "description", label: "Description", kind: "textarea", required: true },
      { key: "englishFriendly", label: "English widely spoken (IELTS waiver likely)", kind: "boolean" },
      {
        key: "intakes",
        label: "Academic intakes",
        kind: "liststrings",
        help: "One intake per line, e.g. Fall / Spring.",
      },
      {
        key: "requirements",
        label: "Requirements",
        kind: "liststrings",
        help: "One requirement per line.",
      },
      {
        key: "popularFields",
        label: "Popular fields",
        kind: "liststrings",
        help: "One field per line.",
      },
      { key: "cost.tuitionEurMin", label: "Tuition (EUR) — from", kind: "number" },
      { key: "cost.tuitionEurMax", label: "Tuition (EUR) — to", kind: "number" },
      { key: "cost.livingEurMin", label: "Living (EUR/month) — from", kind: "number" },
      { key: "cost.livingEurMax", label: "Living (EUR/month) — to", kind: "number" },
      {
        key: "cost.band",
        label: "Cost band",
        kind: "select",
        options: ["low", "medium", "high"],
      },
      { key: "cost.fundedByDefault", label: "Funding is the norm (low/no tuition)", kind: "boolean" },
      { key: "tuitionNote", label: "Tuition note", kind: "textarea" },
      { key: "visaNote", label: "Visa note", kind: "textarea" },
    ],
  },
  {
    key: "testimonials",
    label: "Testimonials",
    singular: "Student story",
    titleKey: "name",
    fields: [
      { key: "id", label: "ID", kind: "text" },
      { key: "name", label: "Name", kind: "text", required: true },
      { key: "destination", label: "Destination", kind: "text" },
      { key: "quote", label: "Quote", kind: "textarea", required: true },
      { key: "outcome", label: "Outcome", kind: "text" },
    ],
  },
  {
    key: "scholarships",
    label: "Scholarships",
    singular: "Scholarship",
    titleKey: "name",
    fields: [
      { key: "name", label: "Name", kind: "text", required: true },
      { key: "provider", label: "Provider", kind: "text" },
      { key: "country", label: "Country", kind: "text" },
      { key: "covers", label: "Covers", kind: "textarea" },
      { key: "advice", label: "Advice / honesty note", kind: "textarea" },
    ],
  },
  {
    key: "resources",
    label: "Resources",
    singular: "Resource",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "category", label: "Category", kind: "text" },
      { key: "description", label: "Description", kind: "textarea" },
    ],
  },
  {
    key: "process",
    label: "Process",
    singular: "Step",
    titleKey: "title",
    fields: [
      { key: "step", label: "Step number", kind: "number" },
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "description", label: "Description", kind: "textarea" },
    ],
  },
  {
    key: "blog",
    label: "Blog",
    singular: "Blog post",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "slug", label: "Slug", kind: "text", help: "Auto-filled from the title." },
      { key: "excerpt", label: "Excerpt (shown on the blog list)", kind: "textarea" },
      { key: "content", label: "Content", kind: "textarea", required: true, help: "Paragraphs separated by a blank line." },
      { key: "coverImage", label: "Cover image", kind: "image", help: "Max ~1.5 MB, JPG/PNG/WebP." },
      { key: "author", label: "Author", kind: "text" },
      { key: "publishedAt", label: "Publish date", kind: "date" },
      { key: "published", label: "Visible on the site", kind: "boolean" },
    ],
  },
  {
    key: "site",
    label: "Site settings",
    singular: "Site settings",
    titleKey: "email",
    singleton: true,
    fields: [
      { key: "email", label: "Contact email", kind: "text" },
      { key: "phone", label: "Phone (displayed)", kind: "text" },
      { key: "phoneHref", label: "Phone (for tel: links)", kind: "text" },
      { key: "whatsapp", label: "WhatsApp number", kind: "text" },
    ],
  },
];

export function schemaFor(key: string): CollectionSchema | undefined {
  return SCHEMAS.find((schema) => schema.key === key);
}

export function defaultValue(field: FieldDef): unknown {
  switch (field.kind) {
    case "number":
      return 0;
    case "boolean":
      return false;
    case "liststrings":
      return "";
    case "select":
      return field.options?.[0] ?? "";
    case "date":
      return new Date().toISOString().slice(0, 10);
    default:
      return "";
  }
}

export function defaultRecord(schema: CollectionSchema): Record<string, unknown> {
  const record: Record<string, unknown> = {};
  for (const field of schema.fields) {
    record[field.key] = defaultValue(field);
  }
  return record;
}

function setPath(target: Record<string, unknown>, dottedKey: string, value: unknown): void {
  const parts = dottedKey.split(".");
  let cursor: Record<string, unknown> = target;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    const next = (cursor[part] as Record<string, unknown> | undefined) ?? {};
    cursor[part] = next;
    cursor = next;
  }
  cursor[parts[parts.length - 1]] = value;
}

function getPath(source: Record<string, unknown>, dottedKey: string): unknown {
  let value: unknown = source;
  for (const part of dottedKey.split(".")) {
    if (typeof value !== "object" || value === null) return undefined;
    value = (value as Record<string, unknown>)[part];
  }
  return value;
}

export function flattenRecord(
  schema: CollectionSchema,
  record: Record<string, unknown>
): Record<string, unknown> {
  const flat: Record<string, unknown> = {};
  for (const field of schema.fields) {
    const raw = field.kind === "liststrings"
      ? (getPath(record, field.key) as string[] | undefined)
      : getPath(record, field.key);
    if (field.kind === "liststrings") {
      flat[field.key] = Array.isArray(raw) ? raw.join("\n") : "";
    } else {
      flat[field.key] = raw;
    }
  }
  return flat;
}

export function unflattenRecord(
  schema: CollectionSchema,
  flat: Record<string, unknown>
): Record<string, unknown> {
  const record: Record<string, unknown> = {};
  for (const field of schema.fields) {
    const raw = flat[field.key];
    if (field.kind === "liststrings") {
      const lines = typeof raw === "string"
        ? raw.split("\n").map((line) => line.trim()).filter(Boolean)
        : [];
      if (lines.length > 0) setPath(record, field.key, lines);
      continue;
    }
    if (raw === undefined || raw === null) continue;
    setPath(record, field.key, raw);
  }
  return record;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}