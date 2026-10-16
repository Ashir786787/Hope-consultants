import { randomBytes, randomInt, randomUUID } from "node:crypto";

import {
  mongoCount,
  mongoDeleteOne,
  mongoEnsureIndex,
  mongoFind,
  mongoFindOne,
  mongoInsertOne,
  mongoUpdateOne,
} from "@/lib/mongo";
import { getFormDefinition } from "@/lib/forms/store";
import { validateForm } from "@/lib/forms/validate";
import type { DraftAnswers } from "@/lib/forms/answers";
import type {
  OnboardingAnswers,
  OnboardingDraft,
  OnboardingStatus,
  OnboardingSummary,
} from "@/lib/onboarding/types";

const SUBMISSIONS = "onboardingSubmissions";
const DRAFTS = "onboardingDrafts";

const DRAFT_TTL_SECONDS = 60 * 60 * 24 * 30;

let indexesPromise: Promise<void> | null = null;

export async function ensureOnboardingIndexes(): Promise<void> {
  if (!indexesPromise) {
    indexesPromise = buildIndexes().catch((error) => {
      indexesPromise = null;
      throw error;
    });
  }
  return indexesPromise;
}

async function buildIndexes(): Promise<void> {
  await mongoEnsureIndex(SUBMISSIONS, { submittedAt: -1 });
  await mongoEnsureIndex(SUBMISSIONS, { status: 1 });
  await mongoEnsureIndex(SUBMISSIONS, { caseNumber: 1 });
  await mongoEnsureIndex(DRAFTS, { updatedAt: -1 });
  await mongoEnsureIndex(
    DRAFTS,
    { purgeAt: 1 },
    { expireAfterSeconds: 0 }
  );
}

export function createDraftToken(): string {
  return randomBytes(24).toString("hex");
}

type LooseSubmission = Record<string, unknown>;

function pickText(source: unknown, key: string): string {
  if (typeof source === "object" && source !== null) {
    const value = (source as Record<string, unknown>)[key];
    if (typeof value === "string") return value;
  }
  return "";
}

function pickList(source: unknown, key: string): string[] {
  if (typeof source === "object" && source !== null) {
    const value = (source as Record<string, unknown>)[key];
    if (Array.isArray(value)) return value.filter((entry): entry is string => typeof entry === "string");
  }
  return [];
}

function toSummary(row: LooseSubmission): OnboardingSummary {
  return {
    id: typeof row.id === "string" ? row.id : "",
    caseNumber: typeof row.caseNumber === "string" ? row.caseNumber : "",
    fullName: pickText(row.personal, "fullName"),
    email: pickText(row.personal, "email"),
    contactNumber: pickText(row.personal, "contactNumber"),
    countryNames: pickList(row.preferences, "interestedCountries"),
    desiredLevel: pickText(row.preferences, "desiredLevel"),
    studyBudget: pickText(row.preferences, "studyBudget"),
    lookingForScholarships: pickText(row.preferences, "lookingForScholarships"),
    status: row.status as OnboardingStatus,
    submittedAt: typeof row.submittedAt === "string" ? row.submittedAt : "",
  };
}

const CASE_NUMBER_PREFIX = "HC";

async function nextCaseNumber(): Promise<string> {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const digits = String(randomInt(0, 1_000_000)).padStart(6, "0");
    const candidate = `${CASE_NUMBER_PREFIX}-${year}-${digits}`;
    const existing = await mongoFindOne<{ id: string }>(SUBMISSIONS, { caseNumber: candidate });
    if (!existing) return candidate;
  }
  return `${CASE_NUMBER_PREFIX}-${year}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function createSubmission(input: {
  answers: DraftAnswers;
  draftToken: string;
  sourcePage: string;
}): Promise<void> {
  await ensureOnboardingIndexes();
  const definition = await getFormDefinition("onboarding");
  const errors = validateForm(definition, input.answers);
  if (Object.keys(errors).length > 0) {
    throw new Error("The onboarding answers are incomplete.");
  }

  const id = randomUUID();
  const caseNumber = await nextCaseNumber();

  const submission: LooseSubmission = {
    ...input.answers,
    id,
    caseNumber,
    status: "New",
    notes: "",
    sourcePage: input.sourcePage,
    submittedAt: new Date().toISOString(),
  };

  await mongoInsertOne(SUBMISSIONS, submission);
  await deleteDraft(input.draftToken);
}

export async function listSubmissions(query?: string): Promise<OnboardingSummary[]> {
  const trimmed = query?.trim() ?? "";
  const filter = trimmed
    ? {
        $or: [
          { "personal.fullName": { $regex: escapeRegExp(trimmed), $options: "i" } },
          { caseNumber: { $regex: escapeRegExp(trimmed), $options: "i" } },
        ],
      }
    : {};
  const rows = await mongoFind<LooseSubmission>(SUBMISSIONS, filter, {
    sort: { submittedAt: -1 },
  });
  return rows.map(toSummary);
}

export async function countSubmissions(): Promise<number> {
  return mongoCount(SUBMISSIONS, {});
}

export async function findSubmissionById(id: string): Promise<LooseSubmission | null> {
  return mongoFindOne<LooseSubmission>(SUBMISSIONS, { id });
}

export async function countSubmissionsByStatus(): Promise<Record<OnboardingStatus, number>> {
  const rows = await mongoFind<{ status: OnboardingStatus }>(
    SUBMISSIONS,
    {},
    { projection: { status: 1 } }
  );
  const counts: Record<OnboardingStatus, number> = {
    New: 0,
    Contacted: 0,
    Converted: 0,
    Lost: 0,
  };
  for (const row of rows) {
    if (row.status in counts) counts[row.status] += 1;
  }
  return counts;
}

export async function updateSubmission(
  id: string,
  patch: Partial<{ status: OnboardingStatus; notes: string }>
): Promise<void> {
  await mongoUpdateOne(SUBMISSIONS, { id }, { $set: patch });
}

export async function deleteSubmission(id: string): Promise<number> {
  return mongoDeleteOne(SUBMISSIONS, { id });
}

export async function saveDraft(input: {
  token: string;
  currentSection: string;
  answers: Partial<OnboardingAnswers>;
}): Promise<OnboardingDraft> {
  await ensureOnboardingIndexes();
  const draft: OnboardingDraft = {
    token: input.token,
    currentSection: input.currentSection,
    answers: input.answers,
    updatedAt: new Date().toISOString(),
  };
  await mongoUpdateOne(
    DRAFTS,
    { token: input.token },
    {
      $set: {
        ...draft,
        purgeAt: new Date(Date.now() + DRAFT_TTL_SECONDS * 1000),
      },
    },
    { upsert: true }
  );
  return draft;
}

export async function loadDraft(token: string): Promise<OnboardingDraft | null> {
  if (!token) return null;
  return mongoFindOne<OnboardingDraft>(DRAFTS, { token });
}

export async function deleteDraft(token: string): Promise<number> {
  if (!token) return 0;
  return mongoDeleteOne(DRAFTS, { token });
}