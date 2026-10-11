import { NextResponse } from "next/server";

import { ImageImportError, importRemoteImage } from "@/lib/admin/image-import";
import { hasContentCollection, hasSection } from "@/lib/admin/permissions";
import { requireAdminForApi } from "@/lib/admin/require-admin";
import { SCHEMAS } from "@/lib/content/schemas";
import { getCollection, isCollection, saveCollection, type DataCollection } from "@/lib/store";

type RouteContext = { params: Promise<{ collection: string }> };

function forbidden(message: string) {
  return NextResponse.json({ error: message }, { status: 403 });
}

async function localiseImageFields(
  collection: DataCollection,
  data: unknown
): Promise<string | null> {
  const schema = SCHEMAS.find((item) => item.key === collection);
  if (!schema) return null;

  const imageKeys = schema.fields
    .filter((field) => field.kind === "image")
    .map((field) => field.key);
  if (imageKeys.length === 0) return null;

  const records = Array.isArray(data) ? data : data ? [data] : [];
  for (const record of records) {
    if (typeof record !== "object" || record === null) continue;
    for (const key of imageKeys) {
      const value = (record as Record<string, unknown>)[key];
      if (typeof value !== "string" || !/^https?:\/\//.test(value)) continue;
      try {
        (record as Record<string, unknown>)[key] = await importRemoteImage(value);
      } catch (error) {
        const reason =
          error instanceof ImageImportError
            ? error.message
            : "That image could not be downloaded.";
        return `Could not save the ${schema.singular.toLowerCase()} image: ${reason}`;
      }
    }
  }
  return null;
}

export async function GET(_request: Request, context: RouteContext) {
  const { collection } = await context.params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: "Unknown collection." }, { status: 400 });
  }
  const admin = await requireAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasSection(admin, "content") || !hasContentCollection(admin, collection)) {
    return forbidden("You do not have access to this section.");
  }
  const data = await getCollection(collection);
  return NextResponse.json({ collection, data });
}

export async function PUT(request: Request, context: RouteContext) {
  const { collection } = await context.params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: "Unknown collection." }, { status: 400 });
  }
  const admin = await requireAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasSection(admin, "content") || !hasContentCollection(admin, collection)) {
    return forbidden("You do not have access to this section.");
  }
  const body = await request.json().catch(() => null);
  if (!body || !("data" in body)) {
    return NextResponse.json({ error: "Missing data." }, { status: 400 });
  }
  const imageError = await localiseImageFields(collection, body.data);
  if (imageError) {
    return NextResponse.json({ error: imageError }, { status: 400 });
  }
  await saveCollection(collection, body.data);
  return NextResponse.json({ ok: true });
}
