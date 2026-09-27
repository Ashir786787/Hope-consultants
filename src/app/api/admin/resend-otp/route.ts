import { NextResponse } from "next/server";

import { findAdminByEmail, listOwnerEmails } from "@/lib/admin/admin-user";
import {
  createChallenge,
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
import { isMailConfigured } from "@/lib/email/transporter";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";

  if (email.trim().length === 0) {
    return NextResponse.json({ error: "Enter your email address." }, { status: 400 });
  }

  const admin = await findAdminByEmail(email);
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
      return NextResponse.json(
        { error: `Wait ${cooldown} seconds before requesting another code.`, retryAfter: cooldown },
        { status: 429 }
      );
    }
  }

  if (!isMailConfigured()) {
    return NextResponse.json(
      { error: "One-time codes are not configured on this server." },
      { status: 503 }
    );
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
  } catch {
    return NextResponse.json(
      { error: "We could not reach the panel owner with your code. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, retryAfter: OTP_RESEND_COOLDOWN_SECONDS });
}
