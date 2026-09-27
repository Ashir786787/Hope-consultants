"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminOtpInput } from "./admin-otp-input";
import { LoginAlert, LoginButton, LoginLink } from "./admin-login-card";
import { fetchWithTimeout, requestErrorMessage } from "@/lib/admin/client-fetch";
import { codeFromSlots, emptySlots, type OtpSlots } from "@/lib/admin/otp-entry";

export function AdminLoginOtp({
  email,
  initialCooldown,
  onBack,
}: {
  email: string;
  initialCooldown: number;
  onBack: () => void;
}) {
  const router = useRouter();
  const [slots, setSlots] = useState<OtpSlots>(emptySlots);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(initialCooldown);
  const slotsRef = useRef<OtpSlots>(emptySlots());
  const busy = useRef(false);
  const resendBusy = useRef(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const changeSlots = useCallback((next: OtpSlots) => {
    slotsRef.current = next;
    setSlots(next);
  }, []);

  const verify = useCallback(async () => {
    if (busy.current) return;
    const code = codeFromSlots(slotsRef.current);
    if (code.length === 0) {
      setFormError("Enter all six digits of the code.");
      return;
    }
    busy.current = true;
    setFormError(null);
    setPending(true);
    try {
      const response = await fetchWithTimeout("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setFormError(payload?.error ?? "Could not verify your code.");
        changeSlots(emptySlots());
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch (error) {
      setFormError(
        requestErrorMessage(error, "Could not verify your code. Please try again."),
      );
    } finally {
      busy.current = false;
      setPending(false);
    }
  }, [email, changeSlots, router]);

  const handleComplete = useCallback(() => {
    void verify();
  }, [verify]);

  const onResend = useCallback(async () => {
    if (resendBusy.current) return;
    resendBusy.current = true;
    setFormError(null);
    setResending(true);
    try {
      const response = await fetchWithTimeout("/api/admin/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        retryAfter?: number;
      } | null;

      if (!response.ok) {
        setFormError(payload?.error ?? "Could not send another code.");
        if (typeof payload?.retryAfter === "number") {
          setCooldown(payload.retryAfter);
        }
        return;
      }
      setCooldown(payload?.retryAfter ?? 60);
      changeSlots(emptySlots());
    } catch (error) {
      setFormError(requestErrorMessage(error, "Could not send another code. Please try again."));
    } finally {
      resendBusy.current = false;
      setResending(false);
    }
  }, [email, changeSlots]);

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void verify();
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-[var(--admin-login-heading)]">
          Enter your code
        </h2>
        <p className="text-sm text-[var(--admin-login-muted)]">
          We emailed a 6-digit code to the panel owner for {email}. Ask them for it and enter
          it here. It expires in 10 minutes.
        </p>
      </div>
      <AdminOtpInput
        slots={slots}
        onChange={changeSlots}
        onComplete={handleComplete}
        invalid={formError !== null}
        describedBy={formError ? "code-error" : undefined}
      />
      {formError ? (
        <span id="code-error">
          <LoginAlert message={formError} />
        </span>
      ) : null}
      <LoginButton type="submit" disabled={pending}>
        {pending ? "Verifying…" : "Verify and sign in"}
      </LoginButton>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <LoginLink onClick={onBack} disabled={pending}>
          Use a different email
        </LoginLink>
        <LoginLink onClick={onResend} disabled={pending || resending || cooldown > 0}>
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </LoginLink>
      </div>
    </form>
  );
}
