import { NextResponse } from "next/server";
import { z } from "zod";

import { findSubmissionById, updateSubmission } from "@/lib/onboarding/submission";
import { hasSection } from "@/lib/admin/permissions";
import { requireAdminForApi } from "@/lib/admin/require-admin";
import { ONBOARDING_STATUSES } from "@/lib/onboarding/types";

const patchSchema = z
  .object({
    status: z.enum(ONBOARDING_STATUSES),
    notes: z.string().trim().max(2000, "That note is too long.").optional(),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, "Nothing to change.");

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!hasSection(admin, "onboarding")) {
    return NextResponse.json(
      { error: "You do not have access to this section." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const submission = await findSubmissionById(id);
  if (!submission) {
    return NextResponse.json({ error: "That submission no longer exists." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the details and try again." },
      { status: 400 }
    );
  }

  await updateSubmission(id, parsed.data);
  return NextResponse.json({ ok: true });
}