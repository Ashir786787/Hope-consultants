import { NextResponse } from "next/server";
import { GridFSBucket, ObjectId } from "mongodb";

import { isFormKey } from "@/lib/forms/definitions";
import { UPLOAD_MIME_TYPES, UPLOAD_MAX_BYTES } from "@/lib/forms/uploads";
import { mongoConfigured, mongoDb } from "@/lib/mongo";
import { clientIp } from "@/lib/request-meta";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export const UPLOADS_BUCKET = "uploads";

const UPLOAD_LIMIT = 120;
const UPLOAD_WINDOW_MS = 60 * 60 * 1000;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ form: string }> }
) {
  const { form } = await params;
  if (!isFormKey(form)) {
    return NextResponse.json({ error: "Unknown form." }, { status: 404 });
  }
  if (!mongoConfigured()) {
    return NextResponse.json(
      { error: "File uploads are unavailable right now." },
      { status: 503 }
    );
  }

  const ip = clientIp(request) ?? "unknown";
  const limit = rateLimit(`upload:${form}:${ip}`, UPLOAD_LIMIT, UPLOAD_WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many uploads. Please wait a moment." },
      { status: 429 }
    );
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > UPLOAD_MAX_BYTES) {
    return NextResponse.json(
      { error: "Each file must be 10 MB or smaller." },
      { status: 413 }
    );
  }
  if (!(UPLOAD_MIME_TYPES as readonly string[]).includes(file.type)) {
    return NextResponse.json(
      { error: "Upload a PDF, JPG, PNG or WEBP file." },
      { status: 415 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const bucket = new GridFSBucket(await mongoDb(), { bucketName: UPLOADS_BUCKET });
  const id = new ObjectId();

  await new Promise<void>((resolve, reject) => {
    const stream = bucket.openUploadStreamWithId(id, file.name, {
      metadata: { formKey: form, contentType: file.type, size: file.size },
    });
    stream.on("error", reject);
    stream.on("finish", () => resolve());
    stream.end(buffer);
  });

  return NextResponse.json({
    file: {
      id: id.toHexString(),
      name: file.name,
      size: file.size,
      type: file.type,
    },
  });
}
