import fs from "node:fs/promises";
import path from "node:path";

import { mongoConfigured, mongoRead, mongoWrite } from "@/lib/mongo";
import { defaultSite } from "@/lib/site";

export type DataCollection =
  | "services"
  | "countries"
  | "testimonials"
  | "scholarships"
  | "resources"
  | "process"
  | "blog"
  | "site";

export const COLLECTIONS: readonly DataCollection[] = [
  "services",
  "countries",
  "testimonials",
  "scholarships",
  "resources",
  "process",
  "blog",
  "site",
];

export function isCollection(value: string): value is DataCollection {
  return (COLLECTIONS as readonly string[]).includes(value);
}

const DATA_DIR = path.join(process.cwd(), "data");

function collectionFile(collection: DataCollection): string {
  return path.join(DATA_DIR, `${collection}.json`);
}

async function readFile(collection: DataCollection): Promise<unknown | null> {
  try {
    const raw = await fs.readFile(collectionFile(collection), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function seed(collection: DataCollection): Promise<unknown> {
  switch (collection) {
    case "services":
      return (await import("@/lib/data/services")).services;
    case "countries":
      return (await import("@/lib/data/countries")).countries;
    case "testimonials":
      return (await import("@/lib/data/testimonials")).testimonials;
    case "scholarships":
      return (await import("@/lib/data/scholarships")).scholarships;
    case "resources":
      return (await import("@/lib/data/resources")).resources;
    case "process":
      return (await import("@/lib/data/process")).processSteps;
    case "blog":
      return (await import("@/lib/data/blog")).blogPosts;
    case "site":
      return defaultSite;
  }
}

export async function getCollection<T>(collection: DataCollection): Promise<T> {
  if (mongoConfigured()) {
    const existing = await mongoRead(collection);
    if (existing !== null) return existing as T;
    const fallback = (await seed(collection)) as T;
    await mongoWrite(collection, fallback);
    return fallback;
  }
  const existing = await readFile(collection);
  if (existing !== null) return existing as T;
  return (await seed(collection)) as T;
}

export async function saveCollection(
  collection: DataCollection,
  value: unknown
): Promise<void> {
  if (mongoConfigured()) {
    await mongoWrite(collection, value);
    return;
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    collectionFile(collection),
    JSON.stringify(value, null, 2),
    "utf8"
  );
}