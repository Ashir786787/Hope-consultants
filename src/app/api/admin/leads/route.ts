import { NextResponse } from "next/server";

import { listLeads } from "@/lib/admin/lead";
import { requireAdminForApi } from "@/lib/admin/require-admin";

export async function GET() {
  const admin = await requireAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  return NextResponse.json({ leads: await listLeads() });
}
