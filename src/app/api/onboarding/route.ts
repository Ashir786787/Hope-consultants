import { NextResponse } from "next/server";

import { isMailConfigured, sendContactMail } from "@/lib/mail";
import { sendOnboardingConfirmation } from "@/lib/email/send-confirmation";
import { onboardingSchema, normaliseFullAnswers } from "@/lib/onboarding/schema";
import {
  createDraftToken,
  createSubmission,
  ensureOnboardingIndexes,
} from "@/lib/onboarding/submission";
import { clearedDraftCookieHeader, readDraftToken } from "@/lib/onboarding/draft-cookie";
import { clientIp, refererPath } from "@/lib/request-meta";
import { rateLimit } from "@/lib/rate-limit";
import type { OnboardingAnswers } from "@/lib/onboarding/types";

const SUBMIT_LIMIT = 6;
const SUBMIT_WINDOW_MS = 60 * 60 * 1000;

const FROM_FALLBACK = "no-reply@hopeconsultants.example";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function summaryText(answers: OnboardingAnswers): string {
  return [
    `Full name: ${answers.personal.fullName}`,
    `Email: ${answers.personal.email}`,
    `Contact: ${answers.personal.contactNumber}`,
    `Level: ${answers.preferences.desiredLevel}`,
    `Countries: ${answers.preferences.interestedCountries.join(", ")}`,
    `Budget: ${answers.preferences.studyBudget}`,
    `Scholarships: ${answers.preferences.lookingForScholarships}`,
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

  const parsed = onboardingSchema.safeParse(normaliseFullAnswers(body));
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Please complete every section.";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const existingToken = await readDraftToken();
  const draftToken = existingToken ?? createDraftToken();

  try {
    await ensureOnboardingIndexes();
    await createSubmission({
      answers: parsed.data,
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
      replyTo: parsed.data.personal.email,
      subject: "[Hope Consultants] New student onboarding form",
      text: summaryText(parsed.data),
    }).catch(() => null);
  }

  sendOnboardingConfirmation(parsed.data.personal.email).catch(() => null);

  return NextResponse.json(
    { ok: true },
    { headers: { "Set-Cookie": clearedDraftCookieHeader() } }
  );
}