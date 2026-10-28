import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createAdmin,
  deleteAdmin,
  emailIsRegistered,
  ensureAdminUserIndexes,
  listAdmins,
  toAdminSummary,
} from "@/lib/admin/admin-user";
import { hasSection } from "@/lib/admin/permissions";
import { requireAdminForApi } from "@/lib/admin/require-admin";
import { sendAdminInvitationEmail } from "@/lib/email/send-admin-registered";
import { isMailConfigured } from "@/lib/email/transporter";

import { ADMIN_PANEL_SECTIONS } from "@/lib/admin/types";

const createSchema = z.object({
  name: z.string().trim().min(1, "Enter their name.").max(80, "That name is too long."),
  email: z.string().trim().email("That email address does not look right."),
  role: z.string().trim().min(1, "Enter a role.").max(40, "That role is too long."),
  password: z.string().min(8, "Use at least 8 characters.").optional().or(z.literal("")),
  setPassword: z.boolean().optional(),
  permissions: z.array(z.enum(ADMIN_PANEL_SECTIONS)).optional().nullable(),
  contentCollections: z.array(z.string()).optional().nullable(),
});

const PASSWORD_BCRYPT_ROUNDS = 12;

export async function GET() {
  const admin = await requireAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!hasSection(admin, "admins")) {
    return NextResponse.json(
      { error: "You do not have access to this section." },
      { status: 403 }
    );
  }

  await ensureAdminUserIndexes();
  const admins = await listAdmins();
  return NextResponse.json({ admins: admins.map(toAdminSummary) });
}

export async function POST(request: Request) {
  const admin = await requireAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!hasSection(admin, "admins")) {
    return NextResponse.json(
      { error: "You do not have access to this section." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the details and try again." },
      { status: 400 }
    );
  }

  const { name, email, role, password, setPassword, permissions, contentCollections } = parsed.data;
  if (await emailIsRegistered(email)) {
    return NextResponse.json(
      { error: "An admin with that email address already exists." },
      { status: 409 }
    );
  }

  if (setPassword && password && password.length >= 8) {
    const passwordHash = await hash(password, PASSWORD_BCRYPT_ROUNDS);
    const created = await createAdmin({
      name,
      email,
      role,
      passwordHash,
      isActive: true,
      hasCompletedFirstLogin: true,
      isAccessRequest: false,
      firstLoginVerifiedAt: new Date().toISOString(),
      purgeAt: null,
      permissions: permissions ?? null,
      contentCollections: contentCollections ?? null,
    });
    return NextResponse.json({ admin: toAdminSummary(created) }, { status: 201 });
  }

  if (!isMailConfigured()) {
    return NextResponse.json(
      { error: "Email is not configured on this server, so a new admin cannot be created." },
      { status: 503 }
    );
  }

  const created = await createAdmin({
    name,
    email,
    role,
    permissions: permissions ?? null,
    contentCollections: contentCollections ?? null,
  });

  try {
    await sendAdminInvitationEmail(created);
  } catch {
    await deleteAdmin(created.id);
    return NextResponse.json(
      { error: "We could not email the invitation, so no account was created." },
      { status: 502 }
    );
  }

  return NextResponse.json({ admin: toAdminSummary(created) }, { status: 201 });
}
