import { randomUUID } from "node:crypto";

import {
  mongoCount,
  mongoDeleteOne,
  mongoEnsureIndex,
  mongoFind,
  mongoFindOne,
  mongoInsertOne,
  mongoUpdateOne,
} from "@/lib/mongo";
import { getSeedFormDefinition } from "@/lib/forms/definitions";
import { deleteFormDraft } from "@/lib/forms/draft-store";
import { validateForm } from "@/lib/forms/validate";
import type { DraftAnswers } from "@/lib/forms/answers";
import type { FormSubmissionStatus } from "@/lib/forms/types";

export const DOCUMENT_SUBMISSIONS = "documentSubmissions";

export interface DocumentSubmission {
  id: string;
  studentId: string;
  fullName: string;
  applyingFor: string;
  status: FormSubmissionStatus;
  notes: string;
  sourcePage: string;
  submittedAt: string;
  answers: DraftAnswers;
}

export interface DocumentSummary {
  id: string;
  studentId: string;
  fullName: string;
  applyingFor: string;
  status: FormSubmissionStatus;
  submittedAt: string;
}

let indexesPromise: Promise<void> | null = null;

export async function ensureDocumentIndexes(): Promise<void> {
  if (!indexesPromise) {
    indexesPromise = buildIndexes().catch((error) => {
      indexesPromise = null;
      throw error;
    });
  }
  return indexesPromise;
}

async function buildIndexes(): Promise<void> {
  await mongoEnsureIndex(DOCUMENT_SUBMISSIONS, { id: 1 }, { unique: true });
  await mongoEnsureIndex(DOCUMENT_SUBMISSIONS, { submittedAt: -1 });
  await mongoEnsureIndex(DOCUMENT_SUBMISSIONS, { status: 1 });
  await mongoEnsureIndex(DOCUMENT_SUBMISSIONS, { status: 1, submittedAt: -1 });
  await mongoEnsureIndex(DOCUMENT_SUBMISSIONS, { studentId: 1 });
}

function toSummary(submission: DocumentSubmission): DocumentSummary {
  return {
    id: submission.id,
    studentId: submission.studentId,
    fullName: submission.fullName,
    applyingFor: submission.applyingFor,
    status: submission.status,
    submittedAt: submission.submittedAt,
  };
}

function fieldText(answers: DraftAnswers, sectionKey: string, fieldKey: string): string {
  const value = answers[sectionKey]?.[fieldKey];
  return typeof value === "string" ? value.trim() : "";
}

export async function createDocumentSubmission(input: {
  answers: DraftAnswers;
  draftToken: string;
  sourcePage: string;
}): Promise<DocumentSubmission> {
  await ensureDocumentIndexes();
  const definition = getSeedFormDefinition("documents");
  const errors = validateForm(definition, input.answers);
  if (Object.keys(errors).length > 0) {
    throw new Error("The document answers are incomplete.");
  }

  const details = definition.sections[0].key;
  const submission: DocumentSubmission = {
    id: randomUUID(),
    studentId: fieldText(input.answers, details, "studentId"),
    fullName: fieldText(input.answers, details, "fullName"),
    applyingFor: fieldText(input.answers, details, "applyingFor"),
    status: "New",
    notes: "",
    sourcePage: input.sourcePage,
    submittedAt: new Date().toISOString(),
    answers: input.answers,
  };

  await mongoInsertOne(DOCUMENT_SUBMISSIONS, { ...submission });
  await deleteFormDraft(definition.draftCollection, input.draftToken);
  return submission;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function listDocumentSubmissions(query?: string): Promise<DocumentSummary[]> {
  const trimmed = query?.trim() ?? "";
  const filter = trimmed
    ? {
        $or: [
          { fullName: { $regex: escapeRegExp(trimmed), $options: "i" } },
          { studentId: { $regex: escapeRegExp(trimmed), $options: "i" } },
        ],
      }
    : {};
  const rows = await mongoFind<DocumentSubmission>(DOCUMENT_SUBMISSIONS, filter, {
    sort: { submittedAt: -1 },
  });
  return rows.map(toSummary);
}

export async function findDocumentSubmissionById(
  id: string
): Promise<DocumentSubmission | null> {
  return mongoFindOne<DocumentSubmission>(DOCUMENT_SUBMISSIONS, { id });
}

export async function countDocumentByStatus(): Promise<Record<FormSubmissionStatus, number>> {
  const rows = await mongoFind<{ status: FormSubmissionStatus }>(
    DOCUMENT_SUBMISSIONS,
    {},
    { projection: { status: 1 } }
  );
  const counts: Record<FormSubmissionStatus, number> = {
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

export async function countDocumentSubmissions(): Promise<number> {
  return mongoCount(DOCUMENT_SUBMISSIONS, {});
}

export async function updateDocumentSubmission(
  id: string,
  patch: Partial<Pick<DocumentSubmission, "status" | "notes">>
): Promise<void> {
  await mongoUpdateOne(DOCUMENT_SUBMISSIONS, { id }, { $set: patch });
}

export async function deleteDocumentSubmission(id: string): Promise<number> {
  return mongoDeleteOne(DOCUMENT_SUBMISSIONS, { id });
}
