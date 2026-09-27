import type { OtpPurpose } from "@/lib/admin/types";
import { OTP_TTL_MINUTES } from "@/lib/admin/otp-challenge";
import { MAIL_BRAND, sendAdminMail } from "@/lib/email/transporter";

const SUBJECT_LINE: Record<OtpPurpose, string> = {
  first_login: `${MAIL_BRAND} admin access code`,
  password_change: `${MAIL_BRAND} password change code`,
};

const ACTION_LINE: Record<OtpPurpose, string> = {
  first_login:
    "Someone is trying to sign in to the admin panel for the first time and needs you to approve it.",
  password_change:
    "Someone who is already signed in to the admin panel is trying to change their password and needs you to approve it.",
};

export interface OtpDelivery {
  approverEmails: string[];
  code: string;
  purpose: OtpPurpose;
  requesterEmail: string;
  requesterIp: string | null;
}

function buildText(input: OtpDelivery): string {
  return [
    "Hello,",
    "",
    ACTION_LINE[input.purpose],
    "",
    `Email address: ${input.requesterEmail}`,
    `IP address: ${input.requesterIp ?? "not recorded"}`,
    "",
    "Give this code to them only if you recognise them and expected this request:",
    "",
    input.code,
    "",
    `This code expires in ${OTP_TTL_MINUTES} minutes and is never emailed to the person who`,
    "asked for it. It is not stored either, only a locked hash of it.",
    "",
    "If you were not expecting this, do not share the code. The person stays locked out,",
    "and you can remove their request on the admin users page.",
    "",
    MAIL_BRAND,
  ].join("\n");
}

export async function sendOtpEmail(input: OtpDelivery): Promise<void> {
  if (!/^\d{6}$/.test(input.code)) {
    throw new Error("OTP email requires a six digit code.");
  }
  if (input.approverEmails.length === 0) {
    throw new Error("OTP email requires at least one owner address to deliver to.");
  }

  const failures: string[] = [];
  for (const to of input.approverEmails) {
    try {
      await sendAdminMail({
        to,
        subject: SUBJECT_LINE[input.purpose],
        text: buildText(input),
      });
    } catch (error) {
      failures.push(`${to}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (failures.length === input.approverEmails.length) {
    throw new Error(`No approver received the code. ${failures.join(" | ")}`);
  }
}
