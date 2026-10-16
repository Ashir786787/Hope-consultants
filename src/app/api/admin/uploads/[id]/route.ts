import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { GridFSBucket, ObjectId } from "mongodb";

import { requireAdminForApi } from "@/lib/admin/require-admin";
import { mongoConfigured, mongoDb, mongoFindOne } from "@/lib/mongo";

export const runtime = "nodejs";

interface GridFSFileRecord {
  filename: string;
  length?: number;
  metadata?: { contentType?: string };
}

const HEX_24 = /^[0-9a-fA-F]{24}$/;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!mongoConfigured()) {
    return NextResponse.json(
      { error: "Files are unavailable right now." },
      { status: 503 }
    );
  }

  const { id } = await params;
  if (!HEX_24.test(id)) {
    return NextResponse.json({ error: "Unknown file." }, { status: 404 });
  }

  const objectId = new ObjectId(id);
  const record = await mongoFindOne<GridFSFileRecord>("uploads.files", { _id: objectId });
  if (!record) {
    return NextResponse.json({ error: "That file no longer exists." }, { status: 404 });
  }

  const bucket = new GridFSBucket(await mongoDb(), { bucketName: "uploads" });
  const stream = bucket.openDownloadStream(objectId);
  const body = Readable.toWeb(stream) as ReadableStream;

  const headers = new Headers();
  headers.set("Content-Type", record.metadata?.contentType ?? "application/octet-stream");
  headers.set("Content-Disposition", `inline; filename="${encodeURIComponent(record.filename)}"`);
  headers.set("Cache-Control", "private, no-store");
  if (typeof record.length === "number") {
    headers.set("Content-Length", String(record.length));
  }

  return new Response(body, { headers });
}
