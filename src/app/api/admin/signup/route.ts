import { randomUUID } from "node:crypto";

import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

import {
  ensureAdminUserIndexes,
  findAdminByEmail,
  listOwnerEmails,
} from "@/lib/admin/admin-user";
import {
  createChallenge,
  generateOtpCode,
  hashOtpCode,
  OTP_RESEND_COOLDOWN_SECONDS,
} from "@/lib/admin/otp-challenge";
import { clientIp } from "@/lib/request-meta";
import { sendOtpEmail } from "@/lib/email/send-otp";
import { isMailConfigured, MailDeliveryError } from "@/lib/email/transporter";
import { mongoInsertOne } from "@/lib/mongo";
import { cookies } from "next/headers";

const PASSWORD_BCRYPT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;
const PENDING_COOKIE = "hope_admin_signup_pending";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const confirmPassword = typeof body?.confirmPassword === "string" ? body.confirmPassword : "";

  const normalizedEmail = normalizeEmail(email);

  if (name.length < 2) {
    return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
  }
  if (normalizedEmail.length === 0 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return NextResponse.json({ error: "That email address does not look right." }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json({ error: `Use at least ${MIN_PASSWORD_LENGTH} characters.` }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  const ip = clientIp(request);
  const existing = await findAdminByEmail(normalizedEmail);
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  await ensureAdminUserIndexes();
  const passwordHash = await hash(password, PASSWORD_BCRYPT_ROUNDS);
  const now = new Date();

  const admin = {
    id: randomUUID(),
    name,
    email: normalizedEmail,
    passwordHash,
    role: "Administrator",
    isOwner: false,
    hasCompletedFirstLogin: false,
    isActive: false,
    isAccessRequest: true,
    permissions: null,
    contentCollections: null,
    createdAt: now.toISOString(),
    lastLoginAt: null,
    firstLoginVerifiedAt: null,
    sessionsValidAfter: null,
    purgeAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
  };

  await mongoInsertOne("adminUsers", { ...admin });

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
    return NextResponse.json(
      {
        error: "We could not reach the panel owner with your code. Please try again.",
        reason: error instanceof MailDeliveryError ? error.reason : "unknown",
      },
      { status: 502 }
    );
  }

  const store = await cookies();
  store.set(PENDING_COOKIE, normalizedEmail, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  return NextResponse.json({ otpRequired: true, retryAfter: OTP_RESEND_COOLDOWN_SECONDS });
}
