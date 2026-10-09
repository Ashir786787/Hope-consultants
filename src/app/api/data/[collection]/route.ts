import { NextResponse } from "next/server";

import { hasContentCollection, hasSection } from "@/lib/admin/permissions";
import { requireAdminForApi } from "@/lib/admin/require-admin";
import { getCollection, isCollection, saveCollection } from "@/lib/store";

type RouteContext = { params: Promise<{ collection: string }> };

function forbidden(message: string) {
  return NextResponse.json({ error: message }, { status: 403 });
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
  await saveCollection(collection, body.data);
  return NextResponse.json({ ok: true });
}
