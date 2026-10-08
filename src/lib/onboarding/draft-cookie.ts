import { cookies } from "next/headers";

export const ONBOARDING_DRAFT_COOKIE = "hope_onboarding_draft";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function draftCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

export async function readDraftToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ONBOARDING_DRAFT_COOKIE)?.value ?? null;
}

export function draftCookieHeader(token: string): string {
  const parts = [
    `${ONBOARDING_DRAFT_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${MAX_AGE_SECONDS}`,
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

export function clearedDraftCookieHeader(): string {
  const parts = [
    `${ONBOARDING_DRAFT_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=0",
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}