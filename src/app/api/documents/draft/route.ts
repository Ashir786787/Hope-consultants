import { NextResponse } from "next/server";

import {
  createDraftToken,
  formDraftCookieHeader,
  readFormDraftToken,
  saveFormDraft,
} from "@/lib/forms/draft-store";
import { getSeedFormDefinition } from "@/lib/forms/definitions";
import { clientIp } from "@/lib/request-meta";
import { rateLimit } from "@/lib/rate-limit";
import type { DraftAnswers } from "@/lib/forms/answers";

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
  const limit = rateLimit(`documents-draft:${ip}`, DRAFT_LIMIT, DRAFT_WINDOW_MS);
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

  const definition = getSeedFormDefinition("documents");
  const currentSection =
    typeof body.currentSection === "string"
      ? body.currentSection
      : definition.sections[0].key;
  const answers = body.answers as DraftAnswers;

  const existingToken = await readFormDraftToken(definition.draftCookieName);
  if (!existingToken) {
    const token = createDraftToken();
    const draft = await saveFormDraft({
      collection: definition.draftCollection,
      token,
      currentSection,
      answers,
    });
    return NextResponse.json(
      { draft },
      { headers: { "Set-Cookie": formDraftCookieHeader(definition.draftCookieName, token) } }
    );
  }

  const draft = await saveFormDraft({
    collection: definition.draftCollection,
    token: existingToken,
    currentSection,
    answers,
  });
  return NextResponse.json({ draft });
}
