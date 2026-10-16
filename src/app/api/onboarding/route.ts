import { NextResponse } from "next/server";

import { isMailConfigured, sendContactMail } from "@/lib/mail";
import { sendOnboardingConfirmation } from "@/lib/email/send-confirmation";
import {
  createDraftToken,
  createSubmission,
  ensureOnboardingIndexes,
} from "@/lib/onboarding/submission";
import { getFormDefinition } from "@/lib/forms/store";
import { validateForm } from "@/lib/forms/validate";
import { clearedDraftCookieHeader, readDraftToken } from "@/lib/onboarding/draft-cookie";
import { clientIp, refererPath } from "@/lib/request-meta";
import { rateLimit } from "@/lib/rate-limit";
import type { DraftAnswers } from "@/lib/forms/answers";

const SUBMIT_LIMIT = 6;
const SUBMIT_WINDOW_MS = 60 * 60 * 1000;

const FROM_FALLBACK = "no-reply@hopeconsultants.example";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function summaryText(answers: DraftAnswers): string {
  return [
    `Full name: ${text(answers.personal?.fullName)}`,
    `Email: ${text(answers.personal?.email)}`,
    `Contact: ${text(answers.personal?.contactNumber)}`,
    `Level: ${text(answers.preferences?.desiredLevel)}`,
    `Countries: ${
      Array.isArray(answers.preferences?.interestedCountries)
        ? (answers.preferences?.interestedCountries as string[]).join(", ")
        : ""
    }`,
    `Budget: ${text(answers.preferences?.studyBudget)}`,
    `Scholarships: ${text(answers.preferences?.lookingForScholarships)}`,
  ].join("\n");
}

export async function POST(request: Request) {
  const ip = clientIp(request) ?? "unknown";
  const limit = rateLimit(`onboarding-submit:${ip}`, SUBMIT_LIMIT, SUBMIT_WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many submissions from this connection. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      }
    );
  }

  const body = await request.json().catch(() => null);
  if (!isPlainObject(body)) {
    return NextResponse.json(
      { error: "We could not read your answers. Please reload the page and try again." },
      { status: 400 }
    );
  }

  const definition = await getFormDefinition("onboarding");
  const answers = body as DraftAnswers;
  const errors = validateForm(definition, answers);
  if (Object.keys(errors).length > 0) {
    const firstError = Object.values(errors)[0] ?? "Please complete every section.";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const applicantEmail = text(answers.personal?.email);

  const existingToken = await readDraftToken();
  const draftToken = existingToken ?? createDraftToken();

  try {
    await ensureOnboardingIndexes();
    await createSubmission({
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

  if (isMailConfigured()) {
    sendContactMail({
      to: process.env.CONTACT_TO ?? "",
      from: process.env.CONTACT_FROM ?? process.env.SMTP_USER ?? FROM_FALLBACK,
      replyTo: applicantEmail || undefined,
      subject: "[Hope Consultants] New student onboarding form",
      text: summaryText(answers),
    }).catch(() => null);
  }

  if (applicantEmail) {
    sendOnboardingConfirmation(applicantEmail).catch(() => null);
  }

  return NextResponse.json(
    { ok: true },
    { headers: { "Set-Cookie": clearedDraftCookieHeader() } }
  );
}