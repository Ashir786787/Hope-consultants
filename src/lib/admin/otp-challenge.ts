import { randomInt, randomUUID } from "node:crypto";

import { compare, hash } from "bcryptjs";

import {
  mongoDeleteOne,
  mongoEnsureIndex,
  mongoFindOne,
  mongoInsertOne,
  mongoUpdateOne,
} from "@/lib/mongo";
import type { OtpChallenge, OtpPurpose } from "@/lib/admin/types";

const COLLECTION = "otpChallenges";

export const OTP_MAX_ATTEMPTS = 5;
export const OTP_TTL_MINUTES = 10;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
export const OTP_BCRYPT_ROUNDS = 10;
export const OTP_RECORD_RETENTION_DAYS = 90;

function retentionDeadline(from: Date): Date {
  return new Date(from.getTime() + OTP_RECORD_RETENTION_DAYS * 24 * 60 * 60 * 1000);
}

export function generateOtpCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export async function hashOtpCode(code: string): Promise<string> {
  return hash(code, OTP_BCRYPT_ROUNDS);
}

export async function verifyOtpCode(code: string, codeHash: string): Promise<boolean> {
  try {
    return await compare(code, codeHash);
  } catch {
    return false;
  }
}

let indexesPromise: Promise<void> | null = null;

export async function ensureOtpIndexes(): Promise<void> {
  if (!indexesPromise) {
    indexesPromise = buildIndexes().catch((error) => {
      indexesPromise = null;
      throw error;
    });
  }
  return indexesPromise;
}

async function buildIndexes(): Promise<void> {
  await mongoEnsureIndex(
    COLLECTION,
    { adminUserId: 1, purpose: 1 },
    { unique: true }
  );
  await mongoEnsureIndex(COLLECTION, { purgeAt: 1 }, { expireAfterSeconds: 0 });
}

export async function createChallenge(input: {
  adminUserId: string;
  purpose: OtpPurpose;
  codeHash: string;
  ip: string | null;
}): Promise<OtpChallenge> {
  await ensureOtpIndexes();
  await mongoDeleteOne(COLLECTION, {
    adminUserId: input.adminUserId,
    purpose: input.purpose,
  });
  const now = new Date();
  const challenge: OtpChallenge = {
    id: randomUUID(),
    adminUserId: input.adminUserId,
    purpose: input.purpose,
    codeHash: input.codeHash,
    expiresAt: new Date(now.getTime() + OTP_TTL_MINUTES * 60 * 1000).toISOString(),
    attempts: 0,
    createdAt: now.toISOString(),
    verifiedAt: null,
    failedAt: null,
    attemptsUsed: 0,
    ip: input.ip,
    purgeAt: retentionDeadline(now),
  };
  await mongoInsertOne(COLLECTION, { ...challenge });
  return challenge;
}

export async function findChallenge(
  adminUserId: string,
  purpose: OtpPurpose
): Promise<OtpChallenge | null> {
  return mongoFindOne<OtpChallenge>(COLLECTION, { adminUserId, purpose });
}

export async function registerFailedAttempt(challenge: OtpChallenge): Promise<number> {
  const attempts = challenge.attempts + 1;
  await mongoUpdateOne(
    COLLECTION,
    { id: challenge.id },
    { $set: { attempts } }
  );
  return attempts;
}

export async function markChallengeVerified(
  challenge: OtpChallenge,
  ip: string | null
): Promise<void> {
  const now = new Date();
  await mongoUpdateOne(COLLECTION, { id: challenge.id }, {
    $set: {
      verifiedAt: now.toISOString(),
      attemptsUsed: challenge.attempts,
      ip: ip ?? challenge.ip,
      purgeAt: retentionDeadline(now),
    },
  });
}

export async function markChallengeFailed(
  challenge: OtpChallenge,
  ip: string | null
): Promise<void> {
  const now = new Date();
  await mongoUpdateOne(COLLECTION, { id: challenge.id }, {
    $set: {
      failedAt: now.toISOString(),
      attemptsUsed: challenge.attempts,
      ip: ip ?? challenge.ip,
      purgeAt: retentionDeadline(now),
    },
  });
}

export function isChallengeExpired(challenge: OtpChallenge): boolean {
  return new Date(challenge.expiresAt).getTime() <= Date.now();
}

export function isChallengeVerified(challenge: OtpChallenge): boolean {
  return typeof challenge.verifiedAt === "string" && challenge.verifiedAt.length > 0;
}

export function isChallengeExhausted(challenge: OtpChallenge): boolean {
  return challenge.attempts >= OTP_MAX_ATTEMPTS;
}

export function attemptsRemaining(challenge: OtpChallenge): number {
  return Math.max(0, OTP_MAX_ATTEMPTS - challenge.attempts);
}

export function resendCooldownSeconds(challenge: OtpChallenge): number {
  const elapsed = Date.now() - new Date(challenge.createdAt).getTime();
  return Math.max(0, Math.ceil((OTP_RESEND_COOLDOWN_SECONDS * 1000 - elapsed) / 1000));
}
