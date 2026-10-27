import nodemailer from "nodemailer";

export const MAIL_BRAND = "Hope Consultants";

export type MailFailureReason =
  | "not_configured"
  | "auth_failed"
  | "timeout"
  | "network"
  | "rejected"
  | "unknown";

export class MailDeliveryError extends Error {
  readonly reason: MailFailureReason;

  constructor(reason: MailFailureReason, message: string) {
    super(message);
    this.name = "MailDeliveryError";
    this.reason = reason;
  }
}

export type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
};

type MailTransport = ReturnType<typeof nodemailer.createTransport>;

type MailState = {
  transports: Map<string, MailTransport>;
  preferredKey: string | null;
};

type MailGlobals = {
  __hopeMail?: MailState;
};

const CONNECTION_TIMEOUT_MS = 8_000;
const GREETING_TIMEOUT_MS = 8_000;
const SOCKET_TIMEOUT_MS = 15_000;

function state(): MailState {
  const globals = globalThis as unknown as MailGlobals;
  if (!globals.__hopeMail) {
    globals.__hopeMail = { transports: new Map(), preferredKey: null };
  }
  return globals.__hopeMail;
}

function gmailConfig(): MailConfig | null {
  const user = process.env.GMAIL_USER ?? "";
  const pass = process.env.GMAIL_APP_PASSWORD ?? "";
  if (user.trim().length === 0 || pass.trim().length === 0) return null;
  return { host: "smtp.gmail.com", port: 587, secure: false, user, pass };
}

function smtpConfig(): MailConfig | null {
  const user = process.env.SMTP_USER ?? "";
  const pass = process.env.SMTP_PASS ?? "";
  const host = process.env.SMTP_HOST ?? "";
  if (user.trim().length === 0 || pass.trim().length === 0 || host.trim().length === 0) {
    return null;
  }
  const parsed = Number.parseInt(process.env.SMTP_PORT ?? "587", 10);
  const port = Number.isFinite(parsed) && parsed > 0 ? parsed : 587;
  const flag = (process.env.SMTP_SECURE ?? "").trim().toLowerCase();
  const secure = flag === "true" ? true : flag === "false" ? false : port === 465;
  return { host, port, secure, user, pass };
}

export function mailCandidates(): MailConfig[] {
  const candidates: MailConfig[] = [];
  const smtp = smtpConfig();
  const gmail = gmailConfig();
  if (smtp) candidates.push(smtp);
  if (
    gmail &&
    (!smtp ||
      smtp.host !== gmail.host ||
      smtp.port !== gmail.port ||
      smtp.user !== gmail.user ||
      smtp.pass !== gmail.pass)
  ) {
    candidates.push(gmail);
  }
  return candidates;
}

export function isMailConfigured(): boolean {
  return mailCandidates().length > 0;
}

function configKey(config: MailConfig): string {
  return `${config.host}:${config.port}:${config.user}`;
}

function transportFor(config: MailConfig): MailTransport {
  const cache = state();
  const key = configKey(config);
  const existing = cache.transports.get(key);
  if (existing) return existing;
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: CONNECTION_TIMEOUT_MS,
    greetingTimeout: GREETING_TIMEOUT_MS,
    socketTimeout: SOCKET_TIMEOUT_MS,
  });
  cache.transports.set(key, transport);
  return transport;
}

function errorCode(error: unknown): string {
  const code = (error as { code?: unknown } | null)?.code;
  return typeof code === "string" ? code : "";
}

function classifyMailError(error: unknown): {
  reason: MailFailureReason;
  detail: string;
} {
  const detail = error instanceof Error ? error.message : String(error);
  const code = errorCode(error);
  if (code === "EAUTH" || /535|invalid login|authentication failed|bad credentials/i.test(detail)) {
    return { reason: "auth_failed", detail };
  }
  if (code === "ETIMEDOUT" || code === "ESOCKET" || /timed out|timeout/i.test(detail)) {
    return { reason: "timeout", detail };
  }
  if (
    code === "ECONNREFUSED" ||
    code === "ENOTFOUND" ||
    code === "EHOSTUNREACH" ||
    code === "ECONNRESET" ||
    code === "EDNS" ||
    code === "EPIPE"
  ) {
    return { reason: "network", detail };
  }
  if (
    code === "E421" ||
    code === "E450" ||
    code === "E552" ||
    /rejected|blocked|not allowed|unavailable|try again later/i.test(detail)
  ) {
    return { reason: "rejected", detail };
  }
  return { reason: "unknown", detail };
}

export async function sendAdminMail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<void> {
  const candidates = mailCandidates();
  if (candidates.length === 0) {
    throw new MailDeliveryError(
      "not_configured",
      "Admin email is not configured: set SMTP_HOST, SMTP_USER and SMTP_PASS, or GMAIL_USER and GMAIL_APP_PASSWORD."
    );
  }

  const cache = state();
  const preferred = cache.preferredKey;
  const ordered = preferred
    ? [
        ...candidates.filter((config) => configKey(config) === preferred),
        ...candidates.filter((config) => configKey(config) !== preferred),
      ]
    : candidates;

  let reason: MailFailureReason = "unknown";
  let detail = "";

  for (const config of ordered) {
    try {
      await transportFor(config).sendMail({
        to: input.to,
        from: `${MAIL_BRAND} <${config.user}>`,
        subject: input.subject,
        text: input.text,
        ...(input.html ? { html: input.html } : {}),
      });
      cache.preferredKey = configKey(config);
      return;
    } catch (error) {
      const classified = classifyMailError(error);
      reason = classified.reason;
      detail = classified.detail;
    }
  }

  throw new MailDeliveryError(reason, detail);
}
