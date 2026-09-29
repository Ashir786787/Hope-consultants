import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

export type HeroClip = {
  src: string;
  poster?: string;
};

export type HeroMedia = {
  clips: HeroClip[];
};

const CLIP_FILE = /^hero-clip-(\d+)\.mp4$/;

export function resolveHeroMedia(): HeroMedia {
  const directory = path.join(process.cwd(), "public", "hero");
  if (!existsSync(directory)) return { clips: [] };

  const entries = readdirSync(directory);
  const indexes = new Set<number>();

  for (const entry of entries) {
    const match = CLIP_FILE.exec(entry);
    if (match) indexes.add(Number(match[1]));
  }

  const clips: HeroClip[] = [];

  for (const index of [...indexes].sort((a, b) => a - b)) {
    const poster = `hero-clip-${index}-poster.jpg`;
    clips.push({
      src: `/hero/hero-clip-${index}.mp4`,
      ...(entries.includes(poster) ? { poster: `/hero/${poster}` } : {}),
    });
  }

  return { clips };
}
