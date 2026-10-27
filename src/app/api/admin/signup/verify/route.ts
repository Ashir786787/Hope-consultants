import { NextResponse } from "next/server";

import {
  findAdminByEmail,
  listOwnerEmails,
  recordAdminLogin,
  recordFirstLoginVerified,
} from "@/lib/admin/admin-user";
import {
  findChallenge,
  isChallengeExhausted,
  isChallengeExpired,
  isChallengeVerified,
  markChallengeFailed,
  markChallengeVerified,
  OTP_MAX_ATTEMPTS,
  registerFailedAttempt,
  verifyOtpCode,
} from "@/lib/admin/otp-challenge";
import { startSession } from "@/lib/admin/session";
import { clientIp } from "@/lib/request-meta";
import { sendAdminActivatedEmail, sendAdminRegisteredConfirmationEmail } from "@/lib/email/send-admin-registered";
import { cookies } from "next/headers";

const INVALID_CODE = "That code is not correct.";
const PENDING_COOKIE = "hope_admin_signup_pending";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const code = typeof body?.code === "string" ? body.code.trim() : "";

  const normalizedEmail = normalizeEmail(email);

  if (normalizedEmail.length === 0 || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
  }

  const store = await cookies();
  const pending = store.get(PENDING_COOKIE)?.value;
  if (pending !== normalizedEmail) {
    return NextResponse.json({ error: "Complete sign up first to verify." }, { status: 401 });
  }

  const admin = await findAdminByEmail(normalizedEmail);
  if (!admin || (!admin.isActive && !admin.isAccessRequest)) {
    return NextResponse.json({ error: INVALID_CODE }, { status: 401 });
  }

  const challenge = await findChallenge(admin.id, "first_login");
  if (!challenge || isChallengeVerified(challenge)) {
    return NextResponse.json({ error: "Request a new code to continue." }, { status: 401 });
  }
  if (isChallengeExpired(challenge) || isChallengeExhausted(challenge)) {
    await markChallengeFailed(challenge, clientIp(request));
    return NextResponse.json({ error: "That code has expired. Request a new one." }, { status: 401 });
  }

  const ip = clientIp(request);
  if (!(await verifyOtpCode(code, challenge.codeHash))) {
    const attempts = await registerFailedAttempt(challenge);
    if (attempts >= OTP_MAX_ATTEMPTS) {
      await markChallengeFailed({ ...challenge, attempts }, ip);
      return NextResponse.json({ error: "Too many incorrect attempts. Request a new code." }, { status: 401 });
    }
    return NextResponse.json({ error: `${INVALID_CODE} ${OTP_MAX_ATTEMPTS - attempts} attempts remaining.` }, { status: 401 });
  }

  const verifiedAt = new Date().toISOString();
  await markChallengeVerified(challenge, ip);
  await recordAdminLogin(admin.id);
  await startSession(admin.id);

  if (challenge.purpose === "first_login" && !admin.hasCompletedFirstLogin) {
    await recordFirstLoginVerified(admin.id);
    const updatedAdmin = { ...admin, isActive: true, isAccessRequest: false, hasCompletedFirstLogin: true, firstLoginVerifiedAt: verifiedAt };
    try {
      await sendAdminRegisteredConfirmationEmail(updatedAdmin);
    } catch {
    }
    const ownerEmails = await listOwnerEmails(admin.id);
    if (ownerEmails.length > 0) {
      try {
        await sendAdminActivatedEmail({ admin: updatedAdmin, ownerEmails, ip });
      } catch {
      }
    }
    store.delete(PENDING_COOKIE);
    return NextResponse.json({ ok: true });
  }

  store.delete(PENDING_COOKIE);
  return NextResponse.json({ ok: true });
}
