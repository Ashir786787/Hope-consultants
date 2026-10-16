import fs from "node:fs/promises";
import path from "node:path";

import { mongoConfigured, mongoRead, mongoWrite } from "@/lib/mongo";
import { FORM_KEYS, getSeedFormDefinition } from "@/lib/forms/definitions";
import type { FormDefinition, FormKey } from "@/lib/forms/types";

const DATA_DIR = path.join(process.cwd(), "data", "forms");

function mongoKey(key: FormKey): string {
  return `form-definition:${key}`;
}

function definitionFile(key: FormKey): string {
  return path.join(DATA_DIR, `${key}.json`);
}

async function readDefinitionFile(key: FormKey): Promise<unknown | null> {
  try {
    const raw = await fs.readFile(definitionFile(key), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function getFormDefinition(key: FormKey): Promise<FormDefinition> {
  if (mongoConfigured()) {
    const existing = await mongoRead(mongoKey(key));
    if (existing !== null) return existing as FormDefinition;
    const seed = getSeedFormDefinition(key);
    await mongoWrite(mongoKey(key), seed);
    return seed;
  }
  const existing = await readDefinitionFile(key);
  if (existing !== null) return existing as FormDefinition;
  return getSeedFormDefinition(key);
}

export async function listFormDefinitions(): Promise<FormDefinition[]> {
  return Promise.all(FORM_KEYS.map((key) => getFormDefinition(key)));
}

export async function saveFormDefinition(
  key: FormKey,
  definition: FormDefinition
): Promise<void> {
  if (mongoConfigured()) {
    await mongoWrite(mongoKey(key), definition);
    return;
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(definitionFile(key), JSON.stringify(definition, null, 2), "utf8");
}
