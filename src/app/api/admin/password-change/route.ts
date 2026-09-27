import { NextResponse } from "next/server";

import { listOwnerEmails } from "@/lib/admin/admin-user";
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
import { requireAdminForApi } from "@/lib/admin/require-admin";
import { clientIp } from "@/lib/request-meta";
import { sendOtpEmail } from "@/lib/email/send-otp";
import { isMailConfigured } from "@/lib/email/transporter";

export async function POST(request: Request) {
  const admin = await requireAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const ip = clientIp(request);
  const existing = await findChallenge(admin.id, "password_change");
  if (
    existing &&
    !isChallengeVerified(existing) &&
    !isChallengeExpired(existing) &&
    !isChallengeExhausted(existing)
  ) {
    const cooldown = resendCooldownSeconds(existing);
    if (cooldown > 0) {
      return NextResponse.json(
        {
          error: `A code was already sent to the panel owner. Wait ${cooldown} seconds before requesting another.`,
          retryAfter: cooldown,
        },
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
    purpose: "password_change",
    codeHash: await hashOtpCode(code),
    ip,
  });

  try {
    await sendOtpEmail({
      approverEmails: await listOwnerEmails(),
      code,
      purpose: "password_change",
      requesterEmail: admin.email,
      requesterIp: ip,
    });
  } catch {
    return NextResponse.json(
      { error: "We could not reach the panel owner with your code. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ otpRequired: true, retryAfter: OTP_RESEND_COOLDOWN_SECONDS });
}
