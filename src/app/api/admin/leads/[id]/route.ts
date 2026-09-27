import { NextResponse } from "next/server";
import { z } from "zod";

import { findLeadById, updateLead } from "@/lib/admin/lead";
import { requireAdminForApi } from "@/lib/admin/require-admin";
import { LEAD_STATUSES } from "@/lib/admin/types";

const patchSchema = z
  .object({
    status: z.enum(LEAD_STATUSES),
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

  const { id } = await params;
  const lead = await findLeadById(id);
  if (!lead) {
    return NextResponse.json({ error: "That enquiry no longer exists." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the details and try again." },
      { status: 400 }
    );
  }

  await updateLead(id, parsed.data);
  return NextResponse.json({ ok: true });
}
