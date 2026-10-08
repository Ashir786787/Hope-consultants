import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, Ref } from "react";

export function AdminAlert({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: ReactNode;
}) {
  const toneClass =
    tone === "error"
      ? "border-hope-ember bg-hope-ember/10"
      : "border-hope-midnight bg-hope-midnight/5";
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-lg border-l-4 px-4 py-3 text-sm font-medium text-hope-midnight ${toneClass}`}
    >
      {children}
    </p>
  );
}

export function AdminButton({
  variant,
  className = "",
  ref,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: "primary" | "secondary";
  ref?: Ref<HTMLButtonElement>;
}) {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember disabled:cursor-not-allowed disabled:opacity-50";
  const tone =
    variant === "primary"
      ? "bg-hope-ember text-hope-midnight hover:brightness-105"
      : "border border-hope-midnight/30 text-hope-midnight hover:bg-hope-midnight/5";
  return <button ref={ref} className={`${base} ${tone} ${className}`} {...props} />;
}

export function AdminField({
  id,
  label,
  hint,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-hope-midnight">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`min-h-11 rounded-lg border bg-hope-white px-3 text-base text-hope-midnight transition-colors placeholder:text-hope-fog focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember ${
          error ? "border-hope-ember" : "border-hope-midnight/20"
        }`}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-hope-midnight">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-hope-fog">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function adminControlClass(hasError = false): string {
  const border = hasError ? "border-hope-ember" : "border-hope-midnight/20";
  return `w-full rounded-xl border bg-hope-white px-3 text-base text-hope-midnight transition-colors placeholder:text-hope-fog focus-visible:border-hope-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember disabled:cursor-not-allowed disabled:opacity-60 ${border}`;
}

export function adminLabelClass(): string {
  return "text-sm font-semibold text-hope-midnight";
}

export function adminHelpClass(): string {
  return "text-sm leading-5 text-hope-fog";
}

export function AdminBadge({
  tone,
  children,
}: {
  tone: "owner" | "active" | "inactive" | "pending";
  children: ReactNode;
}) {
  const tones: Record<typeof tone, string> = {
    owner: "bg-hope-ember text-hope-midnight",
    active: "bg-hope-midnight text-hope-white",
    inactive: "bg-hope-midnight/10 text-hope-midnight",
    pending: "border border-hope-midnight/30 text-hope-midnight",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
