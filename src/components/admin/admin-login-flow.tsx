"use client";

import { useState } from "react";

import { AdminLoginCard } from "./admin-login-card";
import { AdminLoginCredentials } from "./admin-login-credentials";
import { AdminLoginOtp } from "./admin-login-otp";

export function AdminLoginFlow({ resendCooldown }: { resendCooldown: number }) {
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(resendCooldown);
  const [alreadySent, setAlreadySent] = useState(false);

  if (step === "credentials") {
    return (
      <AdminLoginCard>
        <AdminLoginCredentials
          onNeedsCode={(value, retryAfter, sent) => {
            setEmail(value);
            setCooldown(retryAfter);
            setAlreadySent(sent);
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
        initialCooldown={cooldown}
        alreadySent={alreadySent}
        onBack={() => setStep("credentials")}
      />
    </AdminLoginCard>
  );
}
