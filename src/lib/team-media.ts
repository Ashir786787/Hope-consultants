import fs from "node:fs";
import path from "node:path";

const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"] as const;

function exists(candidate: string): boolean {
  const rel = candidate.startsWith("/") ? candidate.slice(1) : candidate;
  return fs.existsSync(path.join(process.cwd(), "public", rel));
}

export function resolveTeamImage(image?: string): string | null {
  if (!image) return null;
  if (EXTENSIONS.some((extension) => image.endsWith(extension)) && exists(image)) {
    return image;
  }
  const basename = image.replace(/\.(jpe?g|png|webp|avif)$/i, "");
  for (const extension of EXTENSIONS) {
    const candidate = `${basename}${extension}`;
    if (exists(candidate)) return candidate;
  }
  return null;
}