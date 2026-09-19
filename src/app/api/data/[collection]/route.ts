import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/auth";
import { getCollection, isCollection, saveCollection } from "@/lib/store";

type RouteContext = { params: Promise<{ collection: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { collection } = await context.params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: "Unknown collection." }, { status: 400 });
  }
  const data = await getCollection(collection);
  return NextResponse.json({ collection, data });
}

export async function PUT(request: Request, context: RouteContext) {
  const { collection } = await context.params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: "Unknown collection." }, { status: 400 });
  }
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body || !("data" in body)) {
    return NextResponse.json({ error: "Missing data." }, { status: 400 });
  }
  await saveCollection(collection, body.data);
  return NextResponse.json({ ok: true });
}