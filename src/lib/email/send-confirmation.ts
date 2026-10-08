import { isMailConfigured, MAIL_BRAND, sendAdminMail } from "@/lib/email/transporter";
import { CONFIRMATION_COPY } from "@/lib/onboarding/sections";

const CONTACT_CONFIRMATION_TEXT = [
  "Thank you — your message has been sent. A real person reads it and usually replies within two working days.",
  "",
  CONFIRMATION_COPY.signature,
].join("\n");

function onboardingConfirmationText(): string {
  return [
    CONFIRMATION_COPY.heading,
    "",
    CONFIRMATION_COPY.intro,
    "",
    CONFIRMATION_COPY.introLabel,
    ...CONFIRMATION_COPY.steps.map((step, index) => `${index + 1}. ${step}`),
    "",
    CONFIRMATION_COPY.note,
    "",
    CONFIRMATION_COPY.closing,
    "",
    CONFIRMATION_COPY.signature,
  ].join("\n");
}

export async function sendOnboardingConfirmation(to: string): Promise<void> {
  if (!isMailConfigured()) return;
  await sendAdminMail({
    to,
    subject: `${MAIL_BRAND} — we have received your form`,
    text: onboardingConfirmationText(),
  });
}

export async function sendContactConfirmation(to: string): Promise<void> {
  if (!isMailConfigured()) return;
  await sendAdminMail({
    to,
    subject: `${MAIL_BRAND} — we have received your message`,
    text: CONTACT_CONFIRMATION_TEXT,
  });
}
