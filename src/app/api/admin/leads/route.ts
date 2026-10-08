import { NextResponse } from "next/server";

import { listLeads } from "@/lib/admin/lead";
import { hasSection } from "@/lib/admin/permissions";
import { requireAdminForApi } from "@/lib/admin/require-admin";

export async function GET() {
  const admin = await requireAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!hasSection(admin, "leads")) {
    return NextResponse.json(
      { error: "You do not have access to this section." },
      { status: 403 }
    );
  }

  return NextResponse.json({ leads: await listLeads() });
}
