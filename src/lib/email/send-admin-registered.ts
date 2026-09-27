import type { AdminUser } from "@/lib/admin/types";
import { MAIL_BRAND, sendAdminMail } from "@/lib/email/transporter";

const PANEL_URL = "https://www.hopeconsultants.pk/admin/login";

function buildInvitationText(admin: AdminUser): string {
  return [
    "Hello,",
    "",
    `An administrator at ${MAIL_BRAND} has added you as an admin.`,
    "",
    `Name: ${admin.name}`,
    `Email: ${admin.email}`,
    `Role: ${admin.role}`,
    "",
    "Sign in here:",
    PANEL_URL,
    "",
    "When you sign in for the first time, you will choose your own password. Nothing was",
    "sent to you and nothing is stored until you type it, so there is no password to",
    "misplace or share.",
    "",
    "We will then email a one-time verification code to the panel owner, who will give it",
    "to you directly. The code is never sent to your own address.",
    "",
    "If you were not expecting this email, you can ignore it. The account cannot be used",
    "until you choose a password yourself.",
    "",
    MAIL_BRAND,
  ].join("\n");
}

function buildOwnerNoticeText(admin: AdminUser, ip: string | null): string {
  return [
    "Hello,",
    "",
    `${admin.name} has completed verification and can now sign in to the ${MAIL_BRAND}`,
    "admin panel.",
    "",
    `Name: ${admin.name}`,
    `Email: ${admin.email}`,
    `Role: ${admin.role}`,
    `Verified: ${admin.firstLoginVerifiedAt ?? "just now"}`,
    `IP address: ${ip ?? "not recorded"}`,
    "",
    "You are receiving this because you own the admin panel. If this was not expected, remove",
    "the account on the admin users page.",
    "",
    MAIL_BRAND,
  ].join("\n");
}

export async function sendAdminInvitationEmail(admin: AdminUser): Promise<void> {
  await sendAdminMail({
    to: admin.email,
    subject: `Your ${MAIL_BRAND} admin account`,
    text: buildInvitationText(admin),
  });
}

export async function sendAdminActivatedEmail(input: {
  admin: AdminUser;
  ownerEmails: string[];
  ip: string | null;
}): Promise<void> {
  for (const ownerEmail of input.ownerEmails) {
    await sendAdminMail({
      to: ownerEmail,
      subject: `New admin registered on ${MAIL_BRAND}`,
      text: buildOwnerNoticeText(input.admin, input.ip),
    });
  }
}
