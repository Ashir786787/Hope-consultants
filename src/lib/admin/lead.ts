import { randomUUID } from "node:crypto";

import {
  mongoCount,
  mongoEnsureIndex,
  mongoFind,
  mongoFindOne,
  mongoInsertOne,
  mongoUpdateOne,
} from "@/lib/mongo";
import type { Lead, LeadStatus } from "@/lib/admin/types";

const COLLECTION = "leads";

export async function ensureLeadIndexes(): Promise<void> {
  await mongoEnsureIndex(COLLECTION, { submittedAt: -1 });
  await mongoEnsureIndex(COLLECTION, { status: 1 });
}

export async function createLead(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
  sourcePage: string;
}): Promise<Lead> {
  await ensureLeadIndexes();
  const lead: Lead = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
    status: "New",
    sourcePage: input.sourcePage,
    notes: "",
    submittedAt: new Date().toISOString(),
  };
  await mongoInsertOne(COLLECTION, { ...lead });
  return lead;
}

export async function listLeads(): Promise<Lead[]> {
  return mongoFind<Lead>(COLLECTION, {}, { sort: { submittedAt: -1 } });
}

export async function countLeads(): Promise<number> {
  return mongoCount(COLLECTION, {});
}

export async function findLeadById(id: string): Promise<Lead | null> {
  return mongoFindOne<Lead>(COLLECTION, { id });
}

export async function countLeadsByStatus(): Promise<Record<LeadStatus, number>> {
  const rows = await mongoFind<{ status: LeadStatus }>(COLLECTION, {}, { projection: { status: 1 } });
  const counts: Record<LeadStatus, number> = {
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

export async function updateLead(
  id: string,
  patch: Partial<Pick<Lead, "status" | "notes">>
): Promise<void> {
  await mongoUpdateOne(COLLECTION, { id }, { $set: patch });
}

export interface LeadDay {
  date: string;
  count: number;
}

function dayKey(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export async function leadsOverTime(days: number): Promise<LeadDay[]> {
  const today = new Date();
  const start = new Date(today.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
  start.setUTCHours(0, 0, 0, 0);

  const rows = await mongoFind<{ submittedAt: string }>(
    COLLECTION,
    { submittedAt: { $gte: start.toISOString() } },
    { projection: { submittedAt: 1 } }
  );

  const counts = new Map<string, number>();
  for (let offset = 0; offset < days; offset += 1) {
    counts.set(dayKey(new Date(start.getTime() + offset * 24 * 60 * 60 * 1000)), 0);
  }
  for (const row of rows) {
    const submitted = new Date(row.submittedAt);
    if (Number.isNaN(submitted.getTime())) continue;
    const key = dayKey(submitted);
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()].map(([date, count]) => ({ date, count }));
}
