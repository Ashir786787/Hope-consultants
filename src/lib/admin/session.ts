import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

import { findAdminById, revokeSessions } from "@/lib/admin/admin-user";

const COOKIE_NAME = "hope_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

export interface AdminSession {
  adminUserId: string;
  issuedAtMs: number;
}

function secret(): Uint8Array {
  const value = process.env.JWT_SECRET ?? "";
  if (value.length < 32) {
    throw new Error("JWT_SECRET must be set to at least 32 characters.");
  }
  return new TextEncoder().encode(value);
}

export function isSessionRevoked(
  sessionsValidAfter: string | null,
  issuedAtMs: number
): boolean {
  if (!sessionsValidAfter) return false;
  const revokedFrom = Date.parse(sessionsValidAfter);
  if (Number.isNaN(revokedFrom)) return false;
  return issuedAtMs <= revokedFrom;
}

export async function startSession(adminUserId: string): Promise<void> {
  const token = await new SignJWT({ sub: adminUserId, iatMs: Date.now() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secret());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function refreshSession(): Promise<void> {
  const session = await readSession();
  if (!session) return;
  const admin = await findAdminById(session.adminUserId);
  if (!admin || !admin.isActive) return;
  if (isSessionRevoked(admin.sessionsValidAfter, session.issuedAtMs)) return;
  await startSession(session.adminUserId);
}

export async function endSession(adminUserId: string): Promise<void> {
  await revokeSessions(adminUserId);
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function readSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.sub !== "string" || payload.sub.length === 0) return null;
    return {
      adminUserId: payload.sub,
      issuedAtMs: typeof payload.iatMs === "number" ? payload.iatMs : 0,
    };
  } catch {
    return null;
  }
}
