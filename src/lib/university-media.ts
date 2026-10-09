import fs from "node:fs";
import path from "node:path";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"] as const;

export type UniversityMedia = {
  src: string;
  name: string;
};

export function resolveUniversityMedia(): UniversityMedia[] {
  const dir = path.join(process.cwd(), "public", "university-images");
  if (!fs.existsSync(dir)) return [];

  const items: UniversityMedia[] = [];

  for (const file of fs.readdirSync(dir)) {
    const extension = path.extname(file).toLowerCase();
    if (!IMAGE_EXTENSIONS.includes(extension as (typeof IMAGE_EXTENSIONS)[number])) continue;

    const name = file
      .slice(0, -extension.length)
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!name) continue;

    items.push({ src: `/university-images/${encodeURIComponent(file)}`, name });
  }

  return items.sort((a, b) => a.name.localeCompare(b.name));
}