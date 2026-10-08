import { NextResponse } from "next/server";

import { createDraftToken, saveDraft } from "@/lib/onboarding/submission";
import { draftCookieHeader, readDraftToken } from "@/lib/onboarding/draft-cookie";
import { clientIp } from "@/lib/request-meta";
import { rateLimit } from "@/lib/rate-limit";
import type { OnboardingAnswers } from "@/lib/onboarding/types";

const DRAFT_LIMIT = 240;
const DRAFT_WINDOW_MS = 60 * 60 * 1000;

interface DraftBody {
  currentSection?: unknown;
  answers?: unknown;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function PUT(request: Request) {
  const ip = clientIp(request) ?? "unknown";
  const limit = rateLimit(`onboarding-draft:${ip}`, DRAFT_LIMIT, DRAFT_WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many autosaves. Please wait a moment." },
      { status: 429 }
    );
  }

  const body = (await request.json().catch(() => null)) as DraftBody | null;
  if (!body || !isPlainObject(body.answers)) {
    return NextResponse.json({ error: "Nothing to save." }, { status: 400 });
  }

  const currentSection =
    typeof body.currentSection === "string" ? body.currentSection : "personal";
  const answers = body.answers as Partial<OnboardingAnswers>;

  let token = await readDraftToken();
  if (!token) {
    token = createDraftToken();
    const draft = await saveDraft({ token, currentSection, answers });
    return NextResponse.json(
      { draft },
      { headers: { "Set-Cookie": draftCookieHeader(token) } }
    );
  }

  const draft = await saveDraft({ token, currentSection, answers });
  return NextResponse.json({ draft });
}
