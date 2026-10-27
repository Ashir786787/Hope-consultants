import type { Metadata } from "next";

import { AdminSignupFlow } from "@/components/admin/admin-signup-flow";

export const metadata: Metadata = {
  title: "Create admin account | Hope Consultants",
  description: "Sign up for the Hope Consultants admin panel.",
  robots: { index: false, follow: false },
};

export default function AdminSignupPage() {
  return <AdminSignupFlow />;
}
