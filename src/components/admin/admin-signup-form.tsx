"use client";

import { useCallback, useRef, useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { z } from "zod";

import { fetchWithTimeout, requestErrorMessage } from "@/lib/admin/client-fetch";
import { LoginAlert, LoginButton, LoginField } from "./admin-login-card";

const MIN_PASSWORD_LENGTH = 8;
const SIGNUP_TIMEOUT_MS = 60_000;

const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name."),
    email: z.string().trim().email("That email address does not look right."),
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Use at least ${MIN_PASSWORD_LENGTH} characters.`),
    confirmPassword: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Use at least ${MIN_PASSWORD_LENGTH} characters.`),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignupValues = z.infer<typeof signupSchema>;

export function AdminSignupForm({
  onNeedsVerification,
}: {
  onNeedsVerification: (email: string) => void;
}) {
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const busy = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = useCallback(
    async (values: SignupValues) => {
      setFormError(null);
      setPending(true);
      try {
        const response = await fetchWithTimeout(
          "/api/admin/signup",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          },
          SIGNUP_TIMEOUT_MS
        );
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
          otpRequired?: boolean;
        } | null;

        if (payload?.otpRequired) {
          onNeedsVerification(values.email.trim().toLowerCase());
          return;
        }
        if (!response.ok) {
          setFormError(payload?.error ?? "Could not create account.");
          return;
        }
        onNeedsVerification(values.email.trim().toLowerCase());
      } catch (error) {
        setFormError(
          requestErrorMessage(error, "Could not reach the server. Check your connection and try again.")
        );
      } finally {
        busy.current = false;
        setPending(false);
      }
    },
    [onNeedsVerification]
  );

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
    [handleSubmit, onSubmit]
  );

  return (
    <form onSubmit={onFormSubmit} className="flex flex-col gap-4" noValidate>
      <LoginField
        id="name"
        label="Full name"
        type="text"
        autoComplete="name"
        icon={<User className="h-4 w-4" strokeWidth={1.75} />}
        error={errors.name?.message}
        {...register("name")}
      />
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
            {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.75} /> : <Eye className="h-4 w-4" strokeWidth={1.75} />}
          </button>
        }
      />
      <LoginField
        id="confirmPassword"
        label="Confirm password"
        type={showConfirm ? "text" : "password"}
        autoComplete="new-password"
        icon={<Lock className="h-4 w-4" strokeWidth={1.75} />}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
        trailing={
          <button
            type="button"
            onClick={() => setShowConfirm((shown) => !shown)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-[var(--admin-login-icon)] transition-colors hover:text-[var(--admin-login-heading)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--admin-login-accent)]"
          >
            {showConfirm ? <EyeOff className="h-4 w-4" strokeWidth={1.75} /> : <Eye className="h-4 w-4" strokeWidth={1.75} />}
          </button>
        }
      />
      {formError ? <LoginAlert message={formError} /> : null}
      <LoginButton type="submit" disabled={pending}>
        {pending ? "Creating account..." : "Create account"}
      </LoginButton>
      <div className="flex flex-col items-center gap-2">
        <a
          href="/admin/login"
          className="min-h-11 rounded-lg px-2 text-sm font-medium text-[var(--admin-login-muted)] underline-offset-4 transition-colors hover:text-[var(--admin-login-heading)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--admin-login-accent)]"
        >
          Back to sign in
        </a>
        <p className="text-center text-xs text-[var(--admin-login-muted)]">
          We will email a one-time code to the panel owner, who will give it to you.
        </p>
      </div>
    </form>
  );
}
