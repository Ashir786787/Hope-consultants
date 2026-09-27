import nodemailer from "nodemailer";

export const MAIL_BRAND = "Hope Consultants";

type MailTransport = ReturnType<typeof nodemailer.createTransport>;

type MailGlobals = {
  __hopeMailTransport?: MailTransport;
};

function credentials(): { user: string; pass: string } {
  const user = process.env.GMAIL_USER ?? process.env.SMTP_USER ?? "";
  const pass = process.env.GMAIL_APP_PASSWORD ?? process.env.SMTP_PASS ?? "";
  return { user, pass };
}

export function isMailConfigured(): boolean {
  const { user, pass } = credentials();
  return user.trim().length > 0 && pass.trim().length > 0;
}

export function senderAddress(): string {
  return `${MAIL_BRAND} <${credentials().user}>`;
}

function transport(): MailTransport {
  const { user, pass } = credentials();
  if (user.trim().length === 0 || pass.trim().length === 0) {
    throw new Error("Admin email is not configured: set GMAIL_USER and GMAIL_APP_PASSWORD.");
  }
  const globals = globalThis as unknown as MailGlobals;
  if (!globals.__hopeMailTransport) {
    globals.__hopeMailTransport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user, pass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }
  return globals.__hopeMailTransport;
}

export async function sendAdminMail(input: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> {
  await transport().sendMail({
    to: input.to,
    from: senderAddress(),
    subject: input.subject,
    text: input.text,
  });
}
