import { NextResponse } from "next/server";

import { isMailConfigured, sendContactMail } from "@/lib/mail";
import {
  createDocumentSubmission,
  ensureDocumentIndexes,
} from "@/lib/forms/submissions";
import { getSeedFormDefinition } from "@/lib/forms/definitions";
import { clearedFormDraftCookieHeader, readFormDraftToken } from "@/lib/forms/draft-store";
import { validateForm } from "@/lib/forms/validate";
import { clientIp, refererPath } from "@/lib/request-meta";
import { rateLimit } from "@/lib/rate-limit";
import type { DraftAnswers } from "@/lib/forms/answers";

const SUBMIT_LIMIT = 6;
const SUBMIT_WINDOW_MS = 60 * 60 * 1000;

const FROM_FALLBACK = "no-reply@hopeconsultants.example";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function summaryText(answers: DraftAnswers, detailsKey: string, documentsKey: string): string {
  const details = answers[detailsKey] ?? {};
  const documents = answers[documentsKey] ?? {};
  const uploads = Object.entries(documents)
    .map(([key, value]) => {
      const count = Array.isArray(value) ? value.length : 0;
      return count > 0 ? `${key}: ${count} file(s)` : null;
    })
    .filter((entry): entry is string => entry !== null);

  return [
    `Full name: ${typeof details.fullName === "string" ? details.fullName : ""}`,
    `Student ID: ${typeof details.studentId === "string" ? details.studentId : ""}`,
    `Applying for: ${typeof details.applyingFor === "string" ? details.applyingFor : ""}`,
    "",
    "Uploaded documents:",
    ...(uploads.length > 0 ? uploads : ["None"]),
  ].join("\n");
}

export async function POST(request: Request) {
  const ip = clientIp(request) ?? "unknown";
  const limit = rateLimit(`documents-submit:${ip}`, SUBMIT_LIMIT, SUBMIT_WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many submissions from this connection. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);
  if (!isPlainObject(body)) {
    return NextResponse.json(
      { error: "We could not read your answers. Please reload the page and try again." },
      { status: 400 }
    );
  }

  const definition = getSeedFormDefinition("documents");
  const answers = body as DraftAnswers;
  const errors = validateForm(definition, answers);
  if (Object.keys(errors).length > 0) {
    const firstError = Object.values(errors)[0] ?? "Please complete every required field.";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const existingToken = await readFormDraftToken(definition.draftCookieName);
  const draftToken = existingToken ?? "";

  try {
    await ensureDocumentIndexes();
    await createDocumentSubmission({
      answers,
      draftToken,
      sourcePage: refererPath(request),
    });
  } catch {
    return NextResponse.json(
      { error: "We could not save your submission right now. Please try again." },
      { status: 500 }
    );
  }

  const detailsKey = definition.sections[0].key;
  const documentsKey = definition.sections[1]?.key ?? definition.sections[0].key;

  if (isMailConfigured()) {
    sendContactMail({
      to: process.env.CONTACT_TO ?? "",
      from: process.env.CONTACT_FROM ?? process.env.SMTP_USER ?? FROM_FALLBACK,
      subject: "[Hope Consultants] New document submission",
      text: summaryText(answers, detailsKey, documentsKey),
    }).catch(() => null);
  }

  return NextResponse.json(
    { ok: true },
    { headers: { "Set-Cookie": clearedFormDraftCookieHeader(definition.draftCookieName) } }
  );
}
