"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

import { fetchWithTimeout, requestErrorMessage } from "@/lib/admin/client-fetch";
import { LoginAlert, LoginButton } from "./admin-login-card";

const VERIFY_TIMEOUT_MS = 45_000;
const RESEND_TIMEOUT_MS = 45_000;

export function AdminSignupVerify({ email }: { email: string }) {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const busy = useRef(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const setDigit = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setCode((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });
    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }, []);

  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 0) return;
    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i += 1) {
      next[i] = pasted[i];
    }
    setCode(next);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  }, []);

  const handleKeyDown = useCallback((index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && code[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }, [code]);

  const onVerify = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (busy.current) return;
      const joined = code.join("");
      if (joined.length !== 6) {
        setFormError("Enter the 6-digit code.");
        return;
      }
      busy.current = true;
      setFormError(null);
      setPending(true);
      try {
        const response = await fetchWithTimeout(
          "/api/admin/signup/verify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code: joined }),
          },
          VERIFY_TIMEOUT_MS
        );
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        if (!response.ok) {
          setFormError(payload?.error ?? "Could not verify code.");
          setPending(false);
          busy.current = false;
          return;
        }
        router.replace("/admin");
        router.refresh();
      } catch (error) {
        setFormError(requestErrorMessage(error, "Could not reach the server. Try again."));
        setPending(false);
        busy.current = false;
      }
    },
    [code, email, router]
  );

  const onResend = useCallback(async () => {
    if (resending || cooldown > 0) return;
    setFormError(null);
    setResending(true);
    try {
      const response = await fetchWithTimeout(
        "/api/admin/signup/resend",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
        RESEND_TIMEOUT_MS
      );
      const payload = (await response.json().catch(() => null)) as { error?: string; retryAfter?: number } | null;
      if (!response.ok) {
        setFormError(payload?.error ?? "Could not resend code.");
        setResending(false);
        return;
      }
      setCooldown(payload?.retryAfter ?? 60);
      setCode(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } catch (error) {
      setFormError(requestErrorMessage(error, "Could not reach the server. Try again."));
    } finally {
      setResending(false);
    }
  }, [cooldown, email, resending]);

  return (
    <form onSubmit={onVerify} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-lg font-bold text-[var(--admin-login-heading)]">Enter verification code</h2>
        <p className="text-sm text-[var(--admin-login-muted)]">
          The code was sent to the panel owner. Ask them to share it with you.
        </p>
        {email ? <p className="text-xs text-[var(--admin-login-muted)]">{email}</p> : null}
      </div>
      <div className="flex items-center justify-between gap-2">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputsRef.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(event) => setDigit(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={index === 0 ? handlePaste : undefined}
            aria-label={`Digit ${index + 1}`}
            className="h-12 w-12 rounded-lg bg-[var(--admin-login-input)] text-center text-lg font-bold text-[var(--admin-login-heading)] outline-none transition-colors focus:border focus:border-[var(--admin-login-accent)] focus:ring-2 focus:ring-[var(--admin-login-accent)]"
          />
        ))}
      </div>
      {formError ? <LoginAlert message={formError} /> : null}
      <LoginButton type="submit" disabled={pending}>
        {pending ? "Verifying..." : "Verify"}
      </LoginButton>
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onResend}
          disabled={resending || cooldown > 0}
          className="min-h-11 rounded-lg px-2 text-sm font-medium text-[var(--admin-login-muted)] underline-offset-4 transition-colors hover:text-[var(--admin-login-heading)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--admin-login-accent)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resending ? "Sending..." : cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </button>
        <a
          href="/admin/login"
          className="min-h-11 rounded-lg px-2 text-sm font-medium text-[var(--admin-login-muted)] underline-offset-4 transition-colors hover:text-[var(--admin-login-heading)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--admin-login-accent)]"
        >
          Back to sign in
        </a>
      </div>
    </form>
  );
}
