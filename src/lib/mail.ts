import nodemailer from "nodemailer";

export interface ContactMail {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  text: string;
}

export function isMailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.CONTACT_TO &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
}

export async function sendContactMail(mail: ContactMail): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER ?? "",
      pass: process.env.SMTP_PASS ?? "",
    },
  });
  await transporter.sendMail(mail);
}