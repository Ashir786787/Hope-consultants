"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { AdminOtpInput } from "./admin-otp-input";
import { AdminAlert, AdminButton, AdminField } from "./admin-ui";
import { fetchWithTimeout, requestErrorMessage } from "@/lib/admin/client-fetch";
import { codeFromSlots, emptySlots, type OtpSlots } from "@/lib/admin/otp-entry";

const MIN_LENGTH = 8;

export function AdminPasswordForm({ email }: { email: string }) {
  const [step, setStep] = useState<"request" | "code">("request");
  const [slots, setSlots] = useState<OtpSlots>(emptySlots);
  const [password, setPassword] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const slotsRef = useRef<OtpSlots>(emptySlots());
  const busy = useRef(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const changeSlots = useCallback((next: OtpSlots) => {
    slotsRef.current = next;
    setSlots(next);
  }, []);

  const passwordError =
    password.length > 0 && password.length < MIN_LENGTH
      ? `Use at least ${MIN_LENGTH} characters.`
      : undefined;

  async function sendCode() {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setFormError(null);
    try {
      const response = await fetchWithTimeout("/api/admin/password-change", { method: "POST" });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        retryAfter?: number;
      } | null;
      if (!response.ok) {
        setFormError(payload?.error ?? "Could not send a code.");
        if (typeof payload?.retryAfter === "number") setCooldown(payload.retryAfter);
        return;
      }
      setStep("code");
      setCooldown(payload?.retryAfter ?? 60);
    } catch (error) {
      setFormError(requestErrorMessage(error, "Could not reach the server. Check your connection and try again."));
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  const verify = useCallback(async () => {
    if (busy.current) return;
    const code = codeFromSlots(slotsRef.current);
    if (code.length === 0) {
      setFormError("Enter all six digits of the code.");
      return;
    }
    if (password.length < MIN_LENGTH) {
      setFormError(`Use at least ${MIN_LENGTH} characters.`);
      return;
    }
    busy.current = true;
    setFormError(null);
    setPending(true);
    try {
      const response = await fetchWithTimeout("/api/admin/password-change/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, password }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setFormError(payload?.error ?? "Could not change your password.");
        changeSlots(emptySlots());
        return;
      }
      setDone(true);
      setStep("request");
      changeSlots(emptySlots());
      setPassword("");
    } catch (error) {
      setFormError(requestErrorMessage(error, "Could not reach the server. Check your connection and try again."));
    } finally {
      busy.current = false;
      setPending(false);
    }
  }, [changeSlots, password]);

  const handleComplete = useCallback(() => {
    void verify();
  }, [verify]);

  async function resend() {
    if (busy.current) return;
    busy.current = true;
    setResending(true);
    setFormError(null);
    try {
      const response = await fetchWithTimeout("/api/admin/password-change", { method: "POST" });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        retryAfter?: number;
      } | null;
      if (!response.ok) {
        setFormError(payload?.error ?? "Could not send another code.");
        if (typeof payload?.retryAfter === "number") setCooldown(payload.retryAfter);
        return;
      }
      setCooldown(payload?.retryAfter ?? 60);
      changeSlots(emptySlots());
    } catch (error) {
      setFormError(requestErrorMessage(error, "Could not send another code. Please try again."));
    } finally {
      busy.current = false;
      setResending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {done ? <AdminAlert tone="success">Your password has been changed.</AdminAlert> : null}

      {step === "request" ? (
        <>
          <p className="text-sm text-hope-fog">
            Changing your password needs a one-time code, and the code is emailed to the panel
            owner for {email}, never to you. Ask the owner for it.
          </p>
          <div>
            <AdminButton type="button" variant="primary" disabled={pending} onClick={sendCode}>
              {pending ? "Sending…" : "Email me a code via the owner"}
            </AdminButton>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-hope-fog">
            Enter the 6-digit code the owner gave you, then your new password.
          </p>
          <AdminOtpInput
            slots={slots}
            onChange={changeSlots}
            onComplete={handleComplete}
            invalid={formError !== null}
            describedBy={formError ? "settings-code-error" : undefined}
          />
          <AdminField
            id="new-password"
            label="New password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={passwordError}
            hint={`At least ${MIN_LENGTH} characters.`}
          />
          {formError ? (
            <span id="settings-code-error">
              <AdminAlert tone="error">{formError}</AdminAlert>
            </span>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <AdminButton type="button" variant="primary" disabled={pending} onClick={verify}>
              {pending ? "Saving…" : "Change password"}
            </AdminButton>
            <AdminButton
              type="button"
              variant="secondary"
              disabled={pending || resending || cooldown > 0}
              onClick={resend}
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Send another code"}
            </AdminButton>
          </div>
        </>
      )}

      {formError && step === "request" ? <AdminAlert tone="error">{formError}</AdminAlert> : null}
    </div>
  );
}
