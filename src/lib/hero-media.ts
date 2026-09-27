import { existsSync } from "node:fs";
import path from "node:path";

export type HeroMedia = {
  mp4?: string;
  webm?: string;
  poster?: string;
  still?: string;
};

const CANDIDATES = {
  mp4: "hero-background.mp4",
  webm: "hero-background.webm",
  poster: "hero-background-poster.jpg",
  still: "hero-background.jpg",
} as const;

export function resolveHeroMedia(): HeroMedia {
  const directory = path.join(process.cwd(), "public", "hero");
  const media: HeroMedia = {};

  for (const key of Object.keys(CANDIDATES) as Array<keyof HeroMedia>) {
    const file = CANDIDATES[key];
    if (existsSync(path.join(directory, file))) {
      media[key] = `/hero/${file}`;
    }
  }

  return media;
}

export function hasHeroMedia(media: HeroMedia): boolean {
  return Boolean(media.mp4 || media.webm || media.poster || media.still);
}
