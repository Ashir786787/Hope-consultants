import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";

import {
  mongoDeleteOne,
  mongoEnsureIndex,
  mongoFindOne,
  mongoUpdateOne,
} from "@/lib/mongo";
import type { DraftAnswers } from "@/lib/forms/answers";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const DRAFT_TTL_SECONDS = 60 * 60 * 24 * 30;

export interface FormDraftRecord {
  token: string;
  currentSection: string;
  answers: DraftAnswers;
  updatedAt: string;
}

export function createDraftToken(): string {
  return randomBytes(24).toString("hex");
}

export async function readFormDraftToken(cookieName: string): Promise<string | null> {
  const store = await cookies();
  return store.get(cookieName)?.value ?? null;
}

function secure(): boolean {
  return process.env.NODE_ENV === "production";
}

export function formDraftCookieHeader(cookieName: string, token: string): string {
  const parts = [
    `${cookieName}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${MAX_AGE_SECONDS}`,
  ];
  if (secure()) parts.push("Secure");
  return parts.join("; ");
}

export function clearedFormDraftCookieHeader(cookieName: string): string {
  const parts = [
    `${cookieName}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=0",
  ];
  if (secure()) parts.push("Secure");
  return parts.join("; ");
}

const ensuredCollections = new Set<string>();

export async function ensureFormDraftIndexes(collection: string): Promise<void> {
  if (ensuredCollections.has(collection)) return;
  await mongoEnsureIndex(collection, { updatedAt: -1 });
  await mongoEnsureIndex(collection, { purgeAt: 1 }, { expireAfterSeconds: 0 });
  ensuredCollections.add(collection);
}

export async function saveFormDraft(input: {
  collection: string;
  token: string;
  currentSection: string;
  answers: DraftAnswers;
}): Promise<FormDraftRecord> {
  await ensureFormDraftIndexes(input.collection);
  const draft: FormDraftRecord = {
    token: input.token,
    currentSection: input.currentSection,
    answers: input.answers,
    updatedAt: new Date().toISOString(),
  };
  await mongoUpdateOne(
    input.collection,
    { token: input.token },
    { $set: { ...draft, purgeAt: new Date(Date.now() + DRAFT_TTL_SECONDS * 1000) } },
    { upsert: true }
  );
  return draft;
}

export async function loadFormDraft(
  collection: string,
  token: string
): Promise<FormDraftRecord | null> {
  if (!token) return null;
  const record = await mongoFindOne<FormDraftRecord & { _id?: unknown }>(collection, { token });
  if (!record) return null;
  return {
    token: record.token,
    currentSection: record.currentSection,
    answers: record.answers,
    updatedAt: record.updatedAt,
  };
}

export async function deleteFormDraft(collection: string, token: string): Promise<number> {
  if (!token) return 0;
  return mongoDeleteOne(collection, { token });
}
