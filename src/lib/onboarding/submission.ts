import { randomBytes, randomUUID } from "node:crypto";

import {
  mongoCount,
  mongoDeleteOne,
  mongoEnsureIndex,
  mongoFind,
  mongoFindOne,
  mongoInsertOne,
  mongoUpdateOne,
} from "@/lib/mongo";
import { onboardingSchema } from "@/lib/onboarding/schema";
import type {
  OnboardingAnswers,
  OnboardingDraft,
  OnboardingStatus,
  OnboardingSubmission,
  OnboardingSummary,
} from "@/lib/onboarding/types";

const SUBMISSIONS = "onboardingSubmissions";
const DRAFTS = "onboardingDrafts";

const DRAFT_TTL_SECONDS = 60 * 60 * 24 * 30;

export async function ensureOnboardingIndexes(): Promise<void> {
  await mongoEnsureIndex(SUBMISSIONS, { submittedAt: -1 });
  await mongoEnsureIndex(SUBMISSIONS, { status: 1 });
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

function toSummary(submission: OnboardingSubmission): OnboardingSummary {
  return {
    id: submission.id,
    fullName: submission.personal.fullName,
    email: submission.personal.email,
    contactNumber: submission.personal.contactNumber,
    countryNames: submission.preferences.interestedCountries,
    desiredLevel: submission.preferences.desiredLevel,
    studyBudget: submission.preferences.studyBudget,
    lookingForScholarships: submission.preferences.lookingForScholarships,
    status: submission.status,
    submittedAt: submission.submittedAt,
  };
}

export async function createSubmission(input: {
  answers: OnboardingAnswers;
  draftToken: string;
  sourcePage: string;
}): Promise<OnboardingSubmission> {
  await ensureOnboardingIndexes();
  const parsed = onboardingSchema.safeParse(input.answers);
  if (!parsed.success) {
    throw new Error("The onboarding answers are incomplete.");
  }

  const id = randomUUID();

  const submission: OnboardingSubmission = {
    ...parsed.data,
    id,
    status: "New",
    notes: "",
    sourcePage: input.sourcePage,
    submittedAt: new Date().toISOString(),
  };

  await mongoInsertOne(SUBMISSIONS, { ...submission });
  await deleteDraft(input.draftToken);
  return submission;
}

export async function listSubmissions(): Promise<OnboardingSummary[]> {
  const rows = await mongoFind<OnboardingSubmission>(SUBMISSIONS, {}, { sort: { submittedAt: -1 } });
  return rows.map(toSummary);
}

export async function countSubmissions(): Promise<number> {
  return mongoCount(SUBMISSIONS, {});
}

export async function findSubmissionById(id: string): Promise<OnboardingSubmission | null> {
  return mongoFindOne<OnboardingSubmission>(SUBMISSIONS, { id });
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
  patch: Partial<Pick<OnboardingSubmission, "status" | "notes">>
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