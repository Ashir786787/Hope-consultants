import { compare, hash } from "bcryptjs";
import { NextResponse } from "next/server";

import { setPassword } from "@/lib/admin/admin-user";
import {
  findChallenge,
  isChallengeExpired,
  isChallengeVerified,
  markChallengeFailed,
  markChallengeVerified,
  OTP_MAX_ATTEMPTS,
  registerFailedAttempt,
  verifyOtpCode,
} from "@/lib/admin/otp-challenge";
import { requireAdminForApi } from "@/lib/admin/require-admin";
import { clientIp } from "@/lib/request-meta";

const INVALID_CODE = "That code is not right.";
const PASSWORD_BCRYPT_ROUNDS = 12;
const MIN_NEW_PASSWORD_LENGTH = 8;

export async function POST(request: Request) {
  const admin = await requireAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Enter all six digits of the code." }, { status: 400 });
  }
  if (password.length < MIN_NEW_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Use at least ${MIN_NEW_PASSWORD_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const challenge = await findChallenge(admin.id, "password_change");
  if (!challenge || isChallengeVerified(challenge) || isChallengeExpired(challenge)) {
    return NextResponse.json(
      { error: "Request a new code, then enter it with your new password." },
      { status: 400 }
    );
  }

  const ip = clientIp(request);
  if (!(await verifyOtpCode(code, challenge.codeHash))) {
    const attempts = await registerFailedAttempt(challenge);
    if (attempts >= OTP_MAX_ATTEMPTS) {
      await markChallengeFailed({ ...challenge, attempts }, ip);
      return NextResponse.json(
        { error: "Too many incorrect attempts. Request a new code." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: `${INVALID_CODE} ${OTP_MAX_ATTEMPTS - attempts} attempts remaining.` },
      { status: 401 }
    );
  }

  if (admin.passwordHash && (await compare(password, admin.passwordHash))) {
    return NextResponse.json(
      { error: "That is already your password. Choose a different one." },
      { status: 400 }
    );
  }

  await markChallengeVerified(challenge, ip);
  await setPassword(admin.id, await hash(password, PASSWORD_BCRYPT_ROUNDS));

  return NextResponse.json({ ok: true });
}
