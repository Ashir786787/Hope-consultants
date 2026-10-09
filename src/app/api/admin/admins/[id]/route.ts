import { NextResponse } from "next/server";
import { z } from "zod";

import {
  deleteAdmin,
  findAdminById,
  setAdminActive,
  toAdminSummary,
  updateAdmin,
} from "@/lib/admin/admin-user";
import { hasSection } from "@/lib/admin/permissions";
import { requireAdminForApi } from "@/lib/admin/require-admin";
import { ADMIN_PANEL_SECTIONS } from "@/lib/admin/types";
import { CONTENT_KEYS, isContentKey } from "@/lib/content/schemas";

const patchSchema = z
  .object({
    role: z.string().trim().min(1, "Enter a role.").max(40, "That role is too long."),
    isActive: z.boolean(),
    permissions: z
      .array(z.enum(ADMIN_PANEL_SECTIONS))
      .min(1, "Keep at least one section.")
      .max(ADMIN_PANEL_SECTIONS.length, "That is too many sections.")
      .nullable(),
    contentCollections: z
      .array(z.string().refine(isContentKey, "Unknown content category."))
      .min(1, "Keep at least one content category.")
      .max(CONTENT_KEYS.length, "That is too many content categories.")
      .nullable(),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, "Nothing to change.");

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const current = await requireAdminForApi();
  if (!current) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!hasSection(current, "admins")) {
    return NextResponse.json(
      { error: "You do not have access to this section." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const target = await findAdminById(id);
  if (!target) {
    return NextResponse.json({ error: "That admin no longer exists." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the details and try again." },
      { status: 400 }
    );
  }

  if (
    (parsed.data.permissions !== undefined ||
      parsed.data.contentCollections !== undefined) &&
    !current.isOwner
  ) {
    return NextResponse.json(
      { error: "Only the owner can change roles." },
      { status: 403 }
    );
  }

  const { role, isActive, permissions, contentCollections } = parsed.data;
  if (target.isOwner && isActive === false) {
    return NextResponse.json(
      { error: "The owner account cannot be deactivated." },
      { status: 409 }
    );
  }
  if (isActive === true && target.isAccessRequest && !target.hasCompletedFirstLogin) {
    return NextResponse.json(
      { error: "A waiting request is approved by the one-time code, not from this page." },
      { status: 409 }
    );
  }

  if (role !== undefined) {
    await updateAdmin(id, { role });
  }
  if (isActive !== undefined) {
    await setAdminActive(id, isActive);
  }
  if (permissions !== undefined) {
    await updateAdmin(id, { permissions });
  }
  if (contentCollections !== undefined) {
    await updateAdmin(id, { contentCollections });
  }

  const updated = await findAdminById(id);
  return NextResponse.json({ admin: updated ? toAdminSummary(updated) : null });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const current = await requireAdminForApi();
  if (!current) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!hasSection(current, "admins")) {
    return NextResponse.json(
      { error: "You do not have access to this section." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const target = await findAdminById(id);
  if (!target) {
    return NextResponse.json({ error: "That admin no longer exists." }, { status: 404 });
  }
  if (target.isOwner) {
    return NextResponse.json(
      { error: "The owner account cannot be deleted." },
      { status: 409 }
    );
  }
  if (target.id === current.id) {
    return NextResponse.json(
      { error: "You cannot delete your own account." },
      { status: 409 }
    );
  }

  await deleteAdmin(id);
  return NextResponse.json({ ok: true });
}
