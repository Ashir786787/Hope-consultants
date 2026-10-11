const MAX_IMAGE_BYTES = 1_500_000;

const ACCEPTED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
]);

const REQUEST_TIMEOUT_MS = 15_000;

export class ImageImportError extends Error {}

export async function importRemoteImage(url: string): Promise<string> {
  let target: URL;
  try {
    target = new URL(url);
  } catch {
    throw new ImageImportError("That does not look like a valid image link.");
  }

  if (target.protocol !== "https:" && target.protocol !== "http:") {
    throw new ImageImportError("Image links must start with https:// or http://.");
  }

  let response: Response;
  try {
    response = await fetch(target, {
      headers: { "User-Agent": "HopeConsultantsAdmin/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new ImageImportError("That image could not be downloaded.");
  }

  if (!response.ok) {
    throw new ImageImportError(`That image link responded with a ${response.status} error.`);
  }

  const contentType = (response.headers.get("content-type") ?? "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (!ACCEPTED_IMAGE_TYPES.has(contentType)) {
    throw new ImageImportError("That link does not point to a JPG, PNG, WebP, or AVIF image.");
  }

  const declaredLength = Number(response.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_IMAGE_BYTES) {
    throw new ImageImportError("That image is larger than the 1.5 MB limit.");
  }

  if (!response.body) {
    throw new ImageImportError("That image could not be read.");
  }

  const chunks: Uint8Array[] = [];
  let total = 0;
  const reader = response.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      total += value.byteLength;
      if (total > MAX_IMAGE_BYTES) {
        await reader.cancel();
        throw new ImageImportError("That image is larger than the 1.5 MB limit.");
      }
      chunks.push(value);
    }
  }
  reader.releaseLock();

  const buffer = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const base64 = Buffer.from(buffer).toString("base64");
  return `data:${contentType};base64,${base64}`;
}