"use client";

import { useState } from "react";

import { AdminLoginCard } from "./admin-login-card";
import { AdminSignupForm } from "./admin-signup-form";
import { AdminSignupVerify } from "./admin-signup-verify";

type Step = "form" | "verify";

export function AdminSignupFlow() {
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");

  if (step === "form") {
    return (
      <AdminLoginCard>
        <AdminSignupForm
          onNeedsVerification={(value) => {
            setEmail(value);
            setStep("verify");
          }}
        />
      </AdminLoginCard>
    );
  }

  return (
    <AdminLoginCard>
      <AdminSignupVerify email={email} />
    </AdminLoginCard>
  );
}
