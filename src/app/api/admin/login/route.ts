import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

import { findAdminByEmail, recordAdminLogin } from "@/lib/admin/admin-user";
import { startSession } from "@/lib/admin/session";

const GENERIC_FAILURE = "Invalid email or password";
const DECOY_PASSWORD_HASH = "$2b$12$Hu91QJp1o4SwRmrBfdu7LuwJd9LWYiUTK5.Uzrr7QoKKum/VjmxEe";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (email.trim().length === 0 || password.length === 0) {
    return NextResponse.json({ error: GENERIC_FAILURE }, { status: 401 });
  }

  const admin = await findAdminByEmail(email);

  if (!admin?.hasCompletedFirstLogin || !admin.isActive) {
    await compare(password, DECOY_PASSWORD_HASH);
    return NextResponse.json({ error: GENERIC_FAILURE }, { status: 401 });
  }

  const passwordMatches =
    admin.passwordHash !== null && (await compare(password, admin.passwordHash));
  if (!passwordMatches) {
    await compare(password, DECOY_PASSWORD_HASH);
    return NextResponse.json({ error: GENERIC_FAILURE }, { status: 401 });
  }

  await recordAdminLogin(admin.id);
  await startSession(admin.id);
  return NextResponse.json({ ok: true });
}
