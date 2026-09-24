export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "liststrings"
  | "image"
  | "date"
  | "json";

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
      { key: "description", label: "Description", kind: "textarea", required: true },
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
      { key: "position", label: "Position (homepage order)", kind: "number" },
      {
        key: "group",
        label: "Group",
        kind: "select",
        options: ["one", "two"],
        help: "Group decides the order the country appears in listings.",
      },
      {
        key: "costBand",
        label: "Cost band",
        kind: "select",
        options: ["low", "medium", "high"],
        help: "Used by the cost filter on /countries.",
      },
      { key: "financialInsight", label: "Key financial insight", kind: "textarea" },
      { key: "intro", label: "Intro", kind: "textarea", required: true },
      { key: "sections", label: "Sections (advanced JSON)", kind: "json", help: "Optional. Leave blank unless you know the data shape." },
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
      { key: "id", label: "ID", kind: "text" },
      { key: "name", label: "Name", kind: "text", required: true },
      {
        key: "group",
        label: "Group",
        kind: "select",
        options: ["spotlight", "fully-funded", "partially-funded"],
      },
      { key: "country", label: "Country", kind: "text" },
      { key: "level", label: "Level", kind: "text" },
      { key: "deadline", label: "Deadline", kind: "text" },
      { key: "benefits", label: "What it covers", kind: "textarea" },
      { key: "eligibility", label: "Who can apply", kind: "textarea" },
      { key: "applyAt", label: "Apply at", kind: "text" },
      { key: "source", label: "Official source", kind: "text" },
      {
        key: "universities",
        label: "Universities we help with",
        kind: "liststrings",
        help: "One university per line.",
      },
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
    case "json":
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
    const raw = getPath(record, field.key);
    if (field.kind === "liststrings") {
      flat[field.key] = Array.isArray(raw) ? raw.join("\n") : "";
      continue;
    }
    if (field.kind === "json") {
      flat[field.key] =
        typeof raw === "string"
          ? raw
          : JSON.stringify(raw ?? null, null, 2);
      continue;
    }
    flat[field.key] = raw;
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
        ? String(raw).split("\n").map((line) => line.trim()).filter(Boolean)
        : [];
      if (lines.length > 0) setPath(record, field.key, lines);
      continue;
    }
    if (field.kind === "json") {
      const text = typeof raw === "string" ? raw.trim() : "";
      if (text) {
        try {
          setPath(record, field.key, JSON.parse(text) as unknown);
        } catch {
          setPath(record, field.key, null);
        }
      }
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