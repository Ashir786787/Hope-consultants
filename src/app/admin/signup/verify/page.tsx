import type { Metadata } from "next";

import { AdminLoginCard } from "@/components/admin/admin-login-card";
import { AdminSignupVerify } from "@/components/admin/admin-signup-verify";

export const metadata: Metadata = {
  title: "Verify admin sign up | Hope Consultants",
  description: "Verify your admin sign up with the code from the panel owner.",
  robots: { index: false, follow: false },
};

export default function AdminSignupVerifyPage() {
  return (
    <AdminLoginCard>
      <AdminSignupVerify email="" />
    </AdminLoginCard>
  );
}
