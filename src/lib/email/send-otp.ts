import type { OtpPurpose } from "@/lib/admin/types";
import { OTP_TTL_MINUTES } from "@/lib/admin/otp-challenge";
import {
  MAIL_BRAND,
  MailDeliveryError,
  sendAdminMail,
  type MailFailureReason,
} from "@/lib/email/transporter";

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
    throw new MailDeliveryError("rejected", "OTP email requires a six digit code.");
  }
  if (input.approverEmails.length === 0) {
    throw new MailDeliveryError(
      "not_configured",
      "OTP email requires at least one owner address to deliver to."
    );
  }

  const results = await Promise.allSettled(
    input.approverEmails.map((to) =>
      sendAdminMail({
        to,
        subject: SUBJECT_LINE[input.purpose],
        text: buildText(input),
      })
    )
  );

  const failures: { to: string; reason: MailFailureReason; detail: string }[] = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") return;
    const error = result.reason;
    failures.push({
      to: input.approverEmails[index],
      reason: error instanceof MailDeliveryError ? error.reason : "unknown",
      detail: error instanceof Error ? error.message : String(error),
    });
  });

  if (failures.length === input.approverEmails.length) {
    throw new MailDeliveryError(
      failures[0]?.reason ?? "unknown",
      failures.map((failure) => `${failure.to}: ${failure.detail}`).join(" | ")
    );
  }
}
