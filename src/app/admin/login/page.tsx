import type { Metadata } from "next";

import { AdminLoginFlow } from "@/components/admin/admin-login-flow";
import { OTP_RESEND_COOLDOWN_SECONDS } from "@/lib/admin/otp-challenge";

export const metadata: Metadata = {
  title: "Admin sign in | Hope Consultants",
  description: "Sign in to the Hope Consultants admin panel.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <AdminLoginFlow resendCooldown={OTP_RESEND_COOLDOWN_SECONDS} />;
}
