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

function buildRegisteredConfirmationHtml(admin: AdminUser): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background-color:#f7f7f7;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding:24px 16px;">
          <table role="presentation" width="100%" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background-color:#000C38;padding:24px 32px;">
                <div style="color:#ffffff;font-size:18px;font-weight:bold;">${MAIL_BRAND}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 16px 0;color:#090909;font-size:16px;line-height:24px;">Hello ${admin.name},</p>
                <p style="margin:0 0 16px 0;color:#090909;font-size:16px;line-height:24px;">You have been successfully registered as <strong>${admin.role}</strong> in ${MAIL_BRAND}.</p>
                <p style="margin:0 0 24px 0;color:#090909;font-size:16px;line-height:24px;">You can sign in to the admin panel using the link below.</p>
                <p style="margin:0 0 32px 0;">
                  <a href="${PANEL_URL}" style="display:inline-block;background-color:#FFB703;color:#000C38;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;">Sign in to admin panel</a>
                </p>
                <p style="margin:0;color:#6C757D;font-size:14px;line-height:20px;">If you did not expect this email, you can ignore it.</p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#f7f7f7;padding:16px 32px;color:#6C757D;font-size:12px;line-height:18px;">
                ${MAIL_BRAND}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildRegisteredConfirmationText(admin: AdminUser): string {
  return [
    "Hello,",
    "",
    `You have been successfully registered as ${admin.role} in ${MAIL_BRAND}.`,
    "",
    `Name: ${admin.name}`,
    `Email: ${admin.email}`,
    `Role: ${admin.role}`,
    "",
    "Sign in here:",
    PANEL_URL,
    "",
    "If you did not expect this email, you can ignore it.",
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

export async function sendAdminRegisteredConfirmationEmail(admin: AdminUser): Promise<void> {
  await sendAdminMail({
    to: admin.email,
    subject: `You're registered at ${MAIL_BRAND}`,
    text: buildRegisteredConfirmationText(admin),
    html: buildRegisteredConfirmationHtml(admin),
  });
}

export async function sendAdminActivatedEmail(input: {
  admin: AdminUser;
  ownerEmails: string[];
  ip: string | null;
}): Promise<void> {
  await Promise.all(
    input.ownerEmails.map((ownerEmail) =>
      sendAdminMail({
        to: ownerEmail,
        subject: `New admin registered on ${MAIL_BRAND}`,
        text: buildOwnerNoticeText(input.admin, input.ip),
      })
    )
  );
}
