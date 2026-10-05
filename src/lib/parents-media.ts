import fs from "node:fs";
import path from "node:path";

const OWN_BASENAMES = [
  "parents-consultation",
  "parents-session",
  "family-consultation",
  "parents",
] as const;
const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"] as const;
const LIBRARY_CANDIDATES = [
  "/parents/parents-consultation.jpg",
  "/parents/parents-consultation.png",
  "/parents/parents-consultation.webp",
] as const;

function exists(candidate: string): boolean {
  const rel = candidate.startsWith("/") ? candidate.slice(1) : candidate;
  return fs.existsSync(path.join(process.cwd(), "public", rel));
}

function firstExisting(candidates: readonly string[]): string | null {
  for (const c of candidates) {
    if (exists(c)) return c;
  }
  return null;
}

export function resolveParentsImage(): string | null {
  const own = firstExisting(
    OWN_BASENAMES.flatMap((basename) =>
      EXTENSIONS.map((extension) => `/parents/${basename}${extension}`),
    ),
  );
  if (own) return own;
  return firstExisting(LIBRARY_CANDIDATES);
}
