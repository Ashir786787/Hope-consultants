import { compare, hash } from "bcryptjs";
import { NextResponse } from "next/server";

import {
  countOpenAccessRequests,
  findAdminByEmail,
  listOwnerEmails,
  maxOpenAccessRequests,
  recordAdminLogin,
  requestAdminAccess,
  setInitialPassword,
} from "@/lib/admin/admin-user";
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
import { startSession } from "@/lib/admin/session";
import { clientIp } from "@/lib/request-meta";
import { sendOtpEmail } from "@/lib/email/send-otp";
import { isMailConfigured } from "@/lib/email/transporter";

const GENERIC_FAILURE = "Invalid email or password";
const DECOY_PASSWORD_HASH = "$2b$12$Hu91QJp1o4SwRmrBfdu7LuwJd9LWYiUTK5.Uzrr7QoKKum/VjmxEe";
const PASSWORD_BCRYPT_ROUNDS = 12;
export const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (email.trim().length === 0 || password.length === 0) {
    return NextResponse.json({ error: GENERIC_FAILURE }, { status: 401 });
  }

  const ip = clientIp(request);
  let admin = await findAdminByEmail(email);

  if (admin?.hasCompletedFirstLogin) {
    const passwordMatches =
      admin.passwordHash !== null && (await compare(password, admin.passwordHash));
    if (!passwordMatches || !admin.isActive) {
      if (passwordMatches) await compare(password, DECOY_PASSWORD_HASH);
      return NextResponse.json({ error: GENERIC_FAILURE }, { status: 401 });
    }
    await recordAdminLogin(admin.id);
    await startSession(admin.id);
    return NextResponse.json({ ok: true });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Choose a password of at least ${MIN_PASSWORD_LENGTH} characters.` },
      { status: 400 }
    );
  }

  if (admin) {
    if (!admin.isActive && !admin.isAccessRequest) {
      await compare(password, DECOY_PASSWORD_HASH);
      return NextResponse.json({ error: GENERIC_FAILURE }, { status: 401 });
    }
    await setInitialPassword(admin.id, await hash(password, PASSWORD_BCRYPT_ROUNDS));
  } else {
    const open = await countOpenAccessRequests();
    if (open >= maxOpenAccessRequests()) {
      return NextResponse.json(
        {
          error:
            "There are already access requests waiting for approval. Please contact the panel owner directly.",
        },
        { status: 429 }
      );
    }
    const passwordHash = await hash(password, PASSWORD_BCRYPT_ROUNDS);
    try {
      admin = await requestAdminAccess({ email, passwordHash, ip });
    } catch {
      admin = await findAdminByEmail(email);
      if (!admin) {
        return NextResponse.json(
          { error: "We could not start your sign-in. Please try again." },
          { status: 502 }
        );
      }
      await setInitialPassword(admin.id, passwordHash);
    }
  }

  const existing = await findChallenge(admin.id, "first_login");
  const hasActiveCode =
    existing !== null &&
    !isChallengeVerified(existing) &&
    !isChallengeExpired(existing) &&
    !isChallengeExhausted(existing);

  if (hasActiveCode && existing) {
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

  return NextResponse.json({ otpRequired: true, retryAfter: OTP_RESEND_COOLDOWN_SECONDS });
}
