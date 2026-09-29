"use client";

import { useCallback, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { z } from "zod";

import { fetchWithTimeout, requestErrorMessage } from "@/lib/admin/client-fetch";
import { LoginAlert, LoginButton, LoginField } from "./admin-login-card";

const MIN_PASSWORD_LENGTH = 8;

const credentialsSchema = z.object({
  email: z.string().trim().email("That email address does not look right."),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `Use at least ${MIN_PASSWORD_LENGTH} characters.`),
});

type CredentialsValues = z.infer<typeof credentialsSchema>;

export function AdminLoginCredentials({
  onNeedsCode,
}: {
  onNeedsCode: (email: string) => void;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const busy = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = useCallback(async (values: CredentialsValues) => {
    setFormError(null);
    setPending(true);
    try {
      const response = await fetchWithTimeout("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        otpRequired?: boolean;
      } | null;

      if (response.ok && payload?.otpRequired) {
        onNeedsCode(values.email);
        return;
      }
      if (!response.ok) {
        setFormError(payload?.error ?? "Could not sign in.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch (error) {
      setFormError(
        requestErrorMessage(error, "Could not reach the server. Check your connection and try again."),
      );
    } finally {
      busy.current = false;
      setPending(false);
    }
  }, [onNeedsCode, router]);

  const onFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      if (busy.current) {
        event.preventDefault();
        return;
      }
      busy.current = true;
      void handleSubmit(onSubmit, () => {
        busy.current = false;
      })(event);
    },
    [handleSubmit, onSubmit],
  );

  return (
    <form onSubmit={onFormSubmit} className="flex flex-col gap-4" noValidate>
      <LoginField
        id="email"
        label="Email address"
        type="email"
        autoComplete="email"
        icon={<Mail className="h-4 w-4" strokeWidth={1.75} />}
        error={errors.email?.message}
        {...register("email")}
      />
      <LoginField
        id="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        icon={<Lock className="h-4 w-4" strokeWidth={1.75} />}
        error={errors.password?.message}
        {...register("password")}
        trailing={
          <button
            type="button"
            onClick={() => setShowPassword((shown) => !shown)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-[var(--admin-login-icon)] transition-colors hover:text-[var(--admin-login-heading)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--admin-login-accent)]"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        }
      />
      {formError ? <LoginAlert message={formError} /> : null}
      <LoginButton type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </LoginButton>
      <p
        aria-live="polite"
        className="text-center text-xs text-[var(--admin-login-muted)]"
      >
        {pending
          ? "Working. If this is your first sign-in we are emailing a one-time code to the panel owner, which can take up to 10 seconds."
          : "First time signing in? Choose your password here. We will email a one-time code to the panel owner, who will give it to you."}
      </p>
    </form>
  );
}
