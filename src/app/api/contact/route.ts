import { NextResponse } from "next/server";
import { z } from "zod";

import { isMailConfigured, sendContactMail } from "@/lib/mail";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name."),
  email: z.string().trim().email("That email address does not look right."),
  subject: z.string().trim().min(3, "A short subject helps us route it."),
  message: z.string().trim().min(10, "Please add a little more detail."),
});

const FROM_FALLBACK = "no-reply@hopeconsultants.example";
const SUBJECT_PREFIX = "[Hope Consultants]";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Please complete all fields.";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  if (!isMailConfigured()) {
    return NextResponse.json(
      { error: "The contact form is not switched on yet. Please email us directly instead." },
      { status: 503 }
    );
  }

  const { name, email, subject, message } = parsed.data;
  const text = `Name: ${name}\nEmail: ${email}\n\n${message}`;

  try {
    await sendContactMail({
      to: process.env.CONTACT_TO ?? "",
      from: process.env.CONTACT_FROM ?? process.env.SMTP_USER ?? FROM_FALLBACK,
      replyTo: email,
      subject: `${SUBJECT_PREFIX} ${subject}`,
      text,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "We could not send your message right now. Please email us directly instead." },
      { status: 502 }
    );
  }
}