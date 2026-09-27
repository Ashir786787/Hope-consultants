import { NextResponse } from "next/server";

import { requireAdminForApi } from "@/lib/admin/require-admin";

export async function GET() {
  const admin = await requireAdminForApi();
  if (!admin) {
    return NextResponse.json({ authenticated: false });
  }
  return NextResponse.json({
    authenticated: true,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });
}
