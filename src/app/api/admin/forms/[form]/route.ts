import { NextResponse } from "next/server";
import { z } from "zod";

import { hasSection } from "@/lib/admin/permissions";
import { requireAdminForApi } from "@/lib/admin/require-admin";
import { getSeedFormDefinition, isFormKey } from "@/lib/forms/definitions";
import { getFormDefinition, saveFormDefinition } from "@/lib/forms/store";
import type { FormDefinition } from "@/lib/forms/types";

const FIELD_KINDS = [
  "text",
  "textarea",
  "email",
  "tel",
  "date",
  "select",
  "radio",
  "checkbox-group",
  "id-number",
  "file",
  "consent",
] as const;

const conditionSchema = z.object({
  field: z.string().trim().min(1),
  equals: z.array(z.string()),
});

const fieldSchema = z.object({
  key: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_-]+$/, "Field keys may only contain letters, numbers, - and _."),
  label: z.string().trim().min(1, "Every field needs a label."),
  kind: z.enum(FIELD_KINDS),
  required: z.boolean().optional(),
  requiredWhen: conditionSchema.optional(),
  showWhen: conditionSchema.optional(),
  options: z.array(z.string()).optional(),
  hint: z.string().optional(),
  placeholder: z.string().optional(),
  inputMode: z.enum(["text", "email", "tel", "numeric"]).optional(),
  maxLength: z.number().int().positive().optional(),
  rows: z.number().int().positive().optional(),
  multiple: z.boolean().optional(),
  minDigits: z.number().int().positive().optional(),
  pattern: z.string().optional(),
  patternMessage: z.string().optional(),
  requiredMessage: z.string().optional(),
  invalidMessage: z.string().optional(),
  archived: z.boolean().optional(),
});

const sectionSchema = z.object({
  key: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_-]+$/, "Section keys may only contain letters, numbers, - and _."),
  slug: z.string().trim().min(1, "Every section needs a URL slug."),
  order: z.number(),
  title: z.string().trim().min(1, "Every section needs a title."),
  description: z.string(),
  fields: z.array(fieldSchema),
});

const welcomeSchema = z.object({
  heading: z.string(),
  intro: z.string(),
  body: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  accuracyNote: z.string().optional(),
  privacyNote: z.string().optional(),
  closing: z.string().optional(),
});

const confirmationSchema = z.object({
  heading: z.string(),
  intro: z.string(),
  introLabel: z.string().optional(),
  steps: z.array(z.string()).optional(),
  note: z.string().optional(),
  closing: z.string().optional(),
  signature: z.string().optional(),
});

const definitionSchema = z.object({
  key: z.enum(["onboarding", "documents"]),
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string(),
  storageKey: z.string().min(1),
  draftCookieName: z.string().min(1),
  draftCollection: z.string().min(1),
  welcome: welcomeSchema,
  confirmation: confirmationSchema,
  sections: z.array(sectionSchema).min(1, "A form needs at least one section."),
});

function validateUniqueness(definition: FormDefinition): string | null {
  const sectionKeys = new Set<string>();
  const slugs = new Set<string>();
  for (const section of definition.sections) {
    if (sectionKeys.has(section.key)) return `Duplicate section key "${section.key}".`;
    if (slugs.has(section.slug)) return `Duplicate section slug "${section.slug}".`;
    sectionKeys.add(section.key);
    slugs.add(section.slug);
    const fieldKeys = new Set<string>();
    for (const field of section.fields) {
      if (fieldKeys.has(field.key)) {
        return `Duplicate field key "${field.key}" in section "${section.title}".`;
      }
      fieldKeys.add(field.key);
    }
  }
  return null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ form: string }> }
) {
  const admin = await requireAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!hasSection(admin, "forms")) {
    return NextResponse.json({ error: "You do not have access to this section." }, { status: 403 });
  }

  const { form } = await params;
  if (!isFormKey(form)) {
    return NextResponse.json({ error: "Unknown form." }, { status: 404 });
  }

  const definition = await getFormDefinition(form);
  return NextResponse.json({ definition });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ form: string }> }
) {
  const admin = await requireAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!hasSection(admin, "forms")) {
    return NextResponse.json({ error: "You do not have access to this section." }, { status: 403 });
  }

  const { form } = await params;
  if (!isFormKey(form)) {
    return NextResponse.json({ error: "Unknown form." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = definitionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the form and try again." },
      { status: 400 }
    );
  }
  if (parsed.data.key !== form) {
    return NextResponse.json({ error: "That form does not match." }, { status: 400 });
  }

  const seed = getSeedFormDefinition(form);
  const definition: FormDefinition = {
    ...parsed.data,
    key: seed.key,
    slug: seed.slug,
    storageKey: seed.storageKey,
    draftCookieName: seed.draftCookieName,
    draftCollection: seed.draftCollection,
    sections: parsed.data.sections.map((section, index) => ({
      ...section,
      order: index + 2,
    })),
  };

  const duplicate = validateUniqueness(definition);
  if (duplicate) {
    return NextResponse.json({ error: duplicate }, { status: 400 });
  }

  await saveFormDefinition(form, definition);
  return NextResponse.json({ ok: true });
}
