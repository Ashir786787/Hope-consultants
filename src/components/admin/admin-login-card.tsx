"use client";

import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";
import { Lock } from "lucide-react";

const PALETTE = {
  "--admin-login-bg": "#0b0b0b",
  "--admin-login-card": "#171717",
  "--admin-login-border": "#2e2e2e",
  "--admin-login-input": "#262626",
  "--admin-login-accent": "#4F39F6",
  "--admin-login-heading": "#ffffff",
  "--admin-login-muted": "#a1a1a1",
  "--admin-login-icon": "#6b7280",
} as CSSProperties;

export function LoginAlert({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-[var(--admin-login-accent)] px-3 py-2 text-sm text-[var(--admin-login-heading)]"
    >
      {message}
    </p>
  );
}

export function LoginField({
  id,
  label,
  error,
  icon,
  trailing,
  ...inputProps
}: {
  id: string;
  label: string;
  error?: string;
  icon: ReactNode;
  trailing?: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id">) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-[var(--admin-login-heading)]"
      >
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-3 flex text-[var(--admin-login-icon)]">
          {icon}
        </span>
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-12 w-full rounded-lg border border-transparent bg-[var(--admin-login-input)] pl-10 pr-11 text-[var(--admin-login-heading)] outline-none transition-colors placeholder:text-[var(--admin-login-icon)] focus:border-[var(--admin-login-accent)] focus:ring-2 focus:ring-[var(--admin-login-accent)]"
          {...inputProps}
        />
        {trailing ? <span className="absolute right-1 flex">{trailing}</span> : null}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-[var(--admin-login-muted)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function LoginButton({
  type,
  disabled,
  children,
}: {
  type: "submit" | "button";
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="h-12 w-full rounded-lg bg-[var(--admin-login-accent)] text-sm font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--admin-login-accent)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function LoginLink({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="min-h-11 rounded-lg px-2 text-sm font-medium text-[var(--admin-login-muted)] underline-offset-4 transition-colors hover:text-[var(--admin-login-heading)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--admin-login-accent)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function AdminLoginCard({ children }: { children: ReactNode }) {
  return (
    <div
      style={PALETTE}
      className="flex min-h-dvh items-center justify-center bg-[var(--admin-login-bg)] px-4 py-12"
    >
      <main className="w-full max-w-md rounded-3xl border border-[var(--admin-login-border)] bg-[var(--admin-login-card)] p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--admin-login-accent)]">
            <Lock className="h-5 w-5 text-white" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[var(--admin-login-heading)]">
              Hope Consultants
            </h1>
            <p className="text-sm text-[var(--admin-login-muted)]">
              Sign in to the admin panel.
            </p>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
