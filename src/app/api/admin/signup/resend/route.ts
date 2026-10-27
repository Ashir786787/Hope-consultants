import { NextResponse } from "next/server";

import { findAdminByEmail, listOwnerEmails } from "@/lib/admin/admin-user";
import {
  createChallenge,
  deleteChallenge,
  findChallenge,
  generateOtpCode,
  hashOtpCode,
  isChallengeExhausted,
  isChallengeExpired,
  isChallengeVerified,
  OTP_RESEND_COOLDOWN_SECONDS,
  resendCooldownSeconds,
} from "@/lib/admin/otp-challenge";
import { clientIp } from "@/lib/request-meta";
import { sendOtpEmail } from "@/lib/email/send-otp";
import { isMailConfigured, MailDeliveryError } from "@/lib/email/transporter";
import { cookies } from "next/headers";

const PENDING_COOKIE = "hope_admin_signup_pending";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const normalizedEmail = normalizeEmail(email);

  if (normalizedEmail.length === 0) {
    return NextResponse.json({ error: "Enter your email address." }, { status: 400 });
  }

  const store = await cookies();
  const pending = store.get(PENDING_COOKIE)?.value;
  if (pending !== normalizedEmail) {
    return NextResponse.json({ error: "Complete sign up first to request a new code." }, { status: 401 });
  }

  const admin = await findAdminByEmail(normalizedEmail);
  const mayProceed =
    admin !== null &&
    !admin.hasCompletedFirstLogin &&
    (admin.isActive || admin.isAccessRequest);

  if (!mayProceed || !admin) {
    return NextResponse.json({ ok: true, retryAfter: OTP_RESEND_COOLDOWN_SECONDS });
  }

  const ip = clientIp(request);
  const existing = await findChallenge(admin.id, "first_login");
  if (existing && !isChallengeVerified(existing) && !isChallengeExpired(existing) && !isChallengeExhausted(existing)) {
    const cooldown = resendCooldownSeconds(existing);
    if (cooldown > 0) {
      return NextResponse.json({ error: `Wait ${cooldown} seconds before requesting another code.`, retryAfter: cooldown }, { status: 429 });
    }
  }

  if (!isMailConfigured()) {
    return NextResponse.json({ error: "One-time codes are not configured on this server." }, { status: 503 });
  }

  const code = generateOtpCode();
  await createChallenge({
    adminUserId: admin.id,
    purpose: "first_login",
    codeHash: await hashOtpCode(code),
    ip,
  });
  try {
    await sendOtpEmail({
      approverEmails: await listOwnerEmails(),
      code,
      purpose: "first_login",
      requesterEmail: admin.email,
      requesterIp: ip,
    });
  } catch (error) {
    await deleteChallenge(admin.id, "first_login");
    return NextResponse.json(
      {
        error: "We could not reach the panel owner with your code. Please try again.",
        reason: error instanceof MailDeliveryError ? error.reason : "unknown",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, retryAfter: OTP_RESEND_COOLDOWN_SECONDS });
}
