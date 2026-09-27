import { NextResponse } from "next/server";

import { endSession, readSession } from "@/lib/admin/session";

export async function POST() {
  const session = await readSession();
  if (session) await endSession(session.adminUserId);
  return NextResponse.json({ ok: true });
}
