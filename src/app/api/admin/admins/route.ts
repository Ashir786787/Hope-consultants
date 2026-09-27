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
import { requireAdminForApi } from "@/lib/admin/require-admin";
import { sendAdminInvitationEmail } from "@/lib/email/send-admin-registered";
import { isMailConfigured } from "@/lib/email/transporter";

const createSchema = z.object({
  name: z.string().trim().min(1, "Enter their name.").max(80, "That name is too long."),
  email: z.string().trim().email("That email address does not look right."),
  role: z.string().trim().min(1, "Enter a role.").max(40, "That role is too long."),
});

export async function GET() {
  const admin = await requireAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
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

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the details and try again." },
      { status: 400 }
    );
  }

  const { name, email, role } = parsed.data;
  if (await emailIsRegistered(email)) {
    return NextResponse.json(
      { error: "An admin with that email address already exists." },
      { status: 409 }
    );
  }

  if (!isMailConfigured()) {
    return NextResponse.json(
      { error: "Email is not configured on this server, so a new admin cannot be created." },
      { status: 503 }
    );
  }

  const created = await createAdmin({ name, email, role });

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
