"use client";

import { useState } from "react";

import { AdminLoginCard } from "./admin-login-card";
import { AdminLoginCredentials } from "./admin-login-credentials";
import { AdminLoginOtp } from "./admin-login-otp";

export function AdminLoginFlow({ resendCooldown }: { resendCooldown: number }) {
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");

  if (step === "credentials") {
    return (
      <AdminLoginCard>
        <AdminLoginCredentials
          onNeedsCode={(value) => {
            setEmail(value);
            setStep("otp");
          }}
        />
      </AdminLoginCard>
    );
  }

  return (
    <AdminLoginCard>
      <AdminLoginOtp
        email={email}
        initialCooldown={resendCooldown}
        onBack={() => setStep("credentials")}
      />
    </AdminLoginCard>
  );
}
