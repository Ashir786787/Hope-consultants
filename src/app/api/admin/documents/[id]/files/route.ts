import { NextResponse } from "next/server";
import { GridFSBucket, ObjectId, type Document } from "mongodb";

import { hasSection } from "@/lib/admin/permissions";
import { requireAdminForApi } from "@/lib/admin/require-admin";
import { buildDefinitionGroups } from "@/lib/forms/summary";
import { findDocumentSubmissionById } from "@/lib/forms/submissions";
import { getFormDefinition } from "@/lib/forms/store";
import { createZipStream, type ZipEntry } from "@/lib/forms/zip";
import { mongoConfigured, mongoDb } from "@/lib/mongo";

export const runtime = "nodejs";

const UPLOADS_BUCKET = "uploads";
const HEX_24 = /^[0-9a-fA-F]{24}$/;

function sanitizeSegment(value: string): string {
  const cleaned = value
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  return cleaned.length > 0 ? cleaned : "document";
}

function uniqueName(folder: string, name: string, used: Set<string>): string {
  const candidate = `${folder}/${name}`.toLowerCase();
  if (!used.has(candidate)) {
    used.add(candidate);
    return name;
  }
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const extension = dot > 0 ? name.slice(dot) : "";
  let counter = 1;
  let next = `${base} (${counter})${extension}`;
  while (used.has(`${folder}/${next}`.toLowerCase())) {
    counter += 1;
    next = `${base} (${counter})${extension}`;
  }
  used.add(`${folder}/${next}`.toLowerCase());
  return next;
}

function readGridFs(bucket: GridFSBucket, id: ObjectId): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const stream = bucket.openDownloadStream(id);
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!hasSection(admin, "documents")) {
    return NextResponse.json(
      { error: "You do not have access to this section." },
      { status: 403 }
    );
  }
  if (!mongoConfigured()) {
    return NextResponse.json({ error: "Files are unavailable right now." }, { status: 503 });
  }

  const { id } = await params;
  const submission = await findDocumentSubmissionById(id);
  if (!submission) {
    return NextResponse.json({ error: "That submission no longer exists." }, { status: 404 });
  }

  const definition = await getFormDefinition("documents");
  const groups = buildDefinitionGroups(definition, submission.answers);

  const refs: { folder: string; name: string; objectId: ObjectId }[] = [];
  const usedNames = new Set<string>();
  for (const group of groups) {
    for (const row of group.rows) {
      if (row.files.length === 0) continue;
      const folder = sanitizeSegment(row.label);
      for (const file of row.files) {
        if (!HEX_24.test(file.id)) continue;
        refs.push({ folder, name: uniqueName(folder, sanitizeSegment(file.name), usedNames), objectId: new ObjectId(file.id) });
      }
    }
  }

  if (refs.length === 0) {
    return NextResponse.json({ error: "This submission has no documents." }, { status: 404 });
  }

  const db = await mongoDb();
  const found = await db
    .collection("uploads.files")
    .find({ _id: { $in: refs.map((ref) => ref.objectId) } }, { projection: { _id: 1 } })
    .toArray();
  const existing = new Set((found as Document[]).map((doc) => String(doc._id)));

  const bucket = new GridFSBucket(db, { bucketName: UPLOADS_BUCKET });
  const entries: ZipEntry[] = refs
    .filter((ref) => existing.has(ref.objectId.toHexString()))
    .map((ref) => ({
      path: `${ref.folder}/${ref.name}`,
      load: () => readGridFs(bucket, ref.objectId),
    }));

  if (entries.length === 0) {
    return NextResponse.json({ error: "This submission has no documents." }, { status: 404 });
  }

  const zipName = `${sanitizeSegment(submission.fullName || "documents")}.zip`;
  const asciiName = zipName.replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "'");

  const headers = new Headers();
  headers.set("Content-Type", "application/zip");
  headers.set(
    "Content-Disposition",
    `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(zipName)}`
  );
  headers.set("Cache-Control", "private, no-store");

  return new Response(createZipStream(entries), { headers });
}
